import * as THREE from "three";
import { clamp, damp, lerp, runtime } from "@/lib/runtime";
import { panelFragment, panelVertex } from "./glsl";

/** Distance from the camera at which panels float. */
const DEPTH = 6;
const CORNER_RADIUS = 14;

type Panel = {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  hover: number;
  tiltX: number;
  tiltY: number;
  mouse: THREE.Vector2;
};

/**
 * One shader-drawn panel per project. Each panel is glued to a DOM element:
 * every frame it reads that element's rectangle and places itself in front of
 * the camera so the two line up, then adds depth, tilt and distortion that
 * plain DOM could not.
 */
export class PanelSystem {
  readonly group = new THREE.Group();
  private readonly panels: Panel[] = [];
  private readonly geometry = new THREE.PlaneGeometry(1, 1, 48, 32);

  constructor(count: number, palette: { accent: THREE.Color; ice: THREE.Color; hot: THREE.Color }) {
    const deep = new THREE.Color("#0b0a0d");
    // Alternate warm and cool panels while staying inside the palette.
    const schemes = [
      { mid: palette.accent, glow: palette.hot },
      { mid: new THREE.Color("#2b5d86"), glow: palette.ice },
      { mid: new THREE.Color("#b3320c"), glow: palette.accent },
      { mid: new THREE.Color("#3a4a6b"), glow: palette.hot },
    ];

    for (let i = 0; i < count; i++) {
      const scheme = schemes[i % schemes.length];
      const material = new THREE.ShaderMaterial({
        vertexShader: panelVertex,
        fragmentShader: panelFragment,
        uniforms: {
          uTime: { value: 0 },
          uSeed: { value: i * 1.37 + 0.6 },
          uHover: { value: 0 },
          uBend: { value: 0 },
          uOpacity: { value: 1 },
          uRadius: { value: CORNER_RADIUS },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uPlane: { value: new THREE.Vector2(1, 1) },
          uDeep: { value: deep },
          uMid: { value: scheme.mid },
          uGlow: { value: scheme.glow },
        },
        transparent: true,
      });
      const mesh = new THREE.Mesh(this.geometry, material);
      mesh.frustumCulled = false;
      mesh.visible = false;
      mesh.renderOrder = 1;
      this.group.add(mesh);
      this.panels.push({ mesh, hover: 0, tiltX: 0, tiltY: 0, mouse: new THREE.Vector2(0.5, 0.5) });
    }
  }

  update(
    camera: THREE.PerspectiveCamera,
    width: number,
    height: number,
    offset: THREE.Vector2,
    time: number,
    dt: number,
  ) {
    this.group.visible = runtime.planes;
    if (!runtime.planes) return;

    this.group.position.copy(camera.position);
    this.group.quaternion.copy(camera.quaternion);

    const visibleHeight = 2 * DEPTH * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const unit = visibleHeight / height; // world units per CSS pixel at DEPTH
    const modal = runtime.modalBlend;
    const pointer = runtime.pointer;
    const bend = clamp(runtime.scrollVelocity * 0.22, -0.5, 0.5);

    for (let i = 0; i < this.panels.length; i++) {
      const panel = this.panels[i];
      const el = runtime.coverEls[i];
      const { mesh } = panel;
      if (!el) {
        mesh.visible = false;
        continue;
      }

      const rect = el.getBoundingClientRect();
      let x = rect.left;
      let y = rect.top;
      let w = rect.width;
      let h = rect.height;

      // The open project travels from its card to the expanded view's cover.
      const opening = runtime.modalProject === i && modal > 0 && runtime.modalCoverEl;
      if (opening) {
        const to = runtime.modalCoverEl!.getBoundingClientRect();
        x = lerp(x, to.left, modal);
        y = lerp(y, to.top, modal);
        w = lerp(w, to.width, modal);
        h = lerp(h, to.height, modal);
      }

      const opacity = opening ? 1 : 1 - modal;
      const onScreen = x < width + 80 && x + w > -80 && y < height + 80 && y + h > -80;
      mesh.visible = onScreen && w > 1 && opacity > 0.01;
      if (!mesh.visible) {
        panel.hover = 0;
        continue;
      }

      const inside =
        pointer.active &&
        !runtime.coarsePointer &&
        (opening ? modal > 0.95 : modal === 0) &&
        pointer.x >= x &&
        pointer.x <= x + w &&
        pointer.y >= y &&
        pointer.y <= y + h;
      const u = clamp((pointer.x - x) / w);
      const v = clamp(1 - (pointer.y - y) / h);

      panel.hover = lerp(panel.hover, inside ? 1 : 0, damp(inside ? 7 : 4, dt));
      if (inside) {
        panel.mouse.x = lerp(panel.mouse.x, u, damp(10, dt));
        panel.mouse.y = lerp(panel.mouse.y, v, damp(10, dt));
      }
      const tilt = runtime.reducedMotion || opening ? 0 : 1;
      panel.tiltY = lerp(panel.tiltY, inside ? (u - 0.5) * 0.42 * tilt : 0, damp(5, dt));
      panel.tiltX = lerp(panel.tiltX, inside ? -(v - 0.5) * 0.3 * tilt : 0, damp(5, dt));

      const cx = x + w / 2 + offset.x;
      const cy = y + h / 2 + offset.y;
      mesh.position.set((cx - width / 2) * unit, (height / 2 - cy) * unit, -DEPTH);
      mesh.scale.set(w * unit, h * unit, 1);
      mesh.rotation.set(panel.tiltX, panel.tiltY, 0);

      const uniforms = mesh.material.uniforms;
      uniforms.uTime.value = time;
      uniforms.uHover.value = panel.hover;
      uniforms.uBend.value = opening ? bend * (1 - modal) : bend;
      uniforms.uOpacity.value = opacity;
      uniforms.uMouse.value.copy(panel.mouse);
      uniforms.uPlane.value.set(w, h);
    }
  }

  dispose() {
    this.geometry.dispose();
    this.panels.forEach((p) => p.mesh.material.dispose());
  }
}
