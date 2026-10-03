import * as THREE from "three";
import { bus, clamp, damp, lerp, runtime } from "@/lib/runtime";
import { backdropFragment, backdropVertex } from "./glsl";
import { skillNodePosition, type SkillNode } from "./layout";
import { PanelSystem } from "./panels";
import { ParticleSystem } from "./particles";
import { CameraRig } from "./rig";

export type EngineOptions = {
  /** Side of the square state texture; particle count is its square. */
  textureSize: number;
  skillNodes: SkillNode[];
  jobCount: number;
  projectCount: number;
};

export const PALETTE = {
  base: "#050506",
  accent: "#ff5a1f",
  ice: "#9fdcff",
  hot: "#ffe9d2",
};

/**
 * Everything in the WebGL scene, kept outside React. The canvas component
 * creates one Engine, calls update() once per frame and dispose() on unmount.
 */
export class Engine {
  private readonly particles: ParticleSystem;
  private readonly panels: PanelSystem;
  private readonly rig = new CameraRig();
  private readonly backdrop: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;

  private scene = 0;
  private time = 0;
  private skillAngle = 0;
  private skillSpeed = 1;
  private pointerEnergy = 0;
  private labelsShown = false;
  private frames = 0;
  private hadPointer = false;
  private readonly lastPointer = new THREE.Vector2();
  private readonly rayDirection = new THREE.Vector3(0, 0, -1);
  private readonly rayPoint = new THREE.Vector3();
  private readonly lastRayPoint = new THREE.Vector3();
  private readonly pointerVelocity = new THREE.Vector3();
  private readonly scratch = new THREE.Vector3();
  private readonly bufferSize = new THREE.Vector2();

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    private readonly world: THREE.Scene,
    private readonly camera: THREE.PerspectiveCamera,
    private readonly options: EngineOptions,
  ) {
    const palette = {
      accent: new THREE.Color(PALETTE.accent),
      ice: new THREE.Color(PALETTE.ice),
      hot: new THREE.Color(PALETTE.hot),
    };

    this.particles = new ParticleSystem(
      renderer,
      options.textureSize,
      options.skillNodes,
      options.jobCount,
      palette,
    );
    this.panels = new PanelSystem(options.projectCount, palette);

    const triangle = new THREE.BufferGeometry();
    triangle.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3),
    );
    triangle.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2));
    this.backdrop = new THREE.Mesh(
      triangle,
      new THREE.ShaderMaterial({
        vertexShader: backdropVertex,
        fragmentShader: backdropFragment,
        uniforms: {
          uTime: { value: 0 },
          uAspect: { value: 1 },
          uScene: { value: 0 },
          uDim: { value: 1 },
          uBase: { value: new THREE.Color(PALETTE.base) },
          uAccent: { value: palette.accent },
          uIce: { value: palette.ice },
        },
        depthTest: false,
        depthWrite: false,
      }),
    );
    this.backdrop.frustumCulled = false;
    this.backdrop.renderOrder = -1;

    world.add(this.backdrop, this.panels.group, this.particles.points);
  }

  /** Share of particles to draw, between 0 and 1. */
  setFraction(fraction: number) {
    this.particles.setFraction(fraction);
  }

  update(width: number, height: number, delta: number) {
    // Long frames (tab switches, hitches) must not blow up the simulation.
    const dt = clamp(delta, 1 / 240, 1 / 15);
    const calm = runtime.reducedMotion;
    this.time += dt * (calm ? 0.35 : 1);

    this.scene = lerp(this.scene, runtime.scene, this.frames === 0 ? 1 : damp(calm ? 14 : 7, dt));
    this.rig.update(this.camera, width, height, this.scene, dt);

    this.updatePointer(width, height, dt);

    // The constellation slows to a stop while a skill is being inspected.
    this.skillSpeed = lerp(this.skillSpeed, runtime.hoverSkill >= 0 ? 0 : 1, damp(4, dt));
    this.skillAngle += dt * 0.085 * this.skillSpeed * (calm ? 0.4 : 1);

    this.renderer.getDrawingBufferSize(this.bufferSize);
    const scale =
      this.bufferSize.y / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)));
    const dim = 1 - runtime.modalBlend * 0.82;

    this.particles.update(this.renderer, {
      dt,
      time: this.time,
      scene: this.scene,
      intro: runtime.intro,
      skillAngle: this.skillAngle,
      hoverSkill: runtime.hoverSkill,
      rayOrigin: this.camera.position,
      rayDirection: this.rayDirection,
      pointerVelocity: this.pointerVelocity,
      pointerBase: calm || !this.hadPointer ? 0 : 5,
      pointerEnergy: calm ? 0 : this.pointerEnergy,
      focus: this.rig.focus,
      scale,
      dim,
      calm,
    });

    this.updateLabels(width, height);
    this.panels.update(this.camera, width, height, this.rig.offset, this.time, dt);

    const b = this.backdrop.material.uniforms;
    b.uTime.value = this.time;
    b.uAspect.value = width / height;
    b.uScene.value = this.scene;
    b.uDim.value = dim;

    // Report ready once a couple of frames have actually been drawn.
    this.frames++;
    if (this.frames === 3 && runtime.gl === "pending") {
      runtime.gl = "ready";
      bus.emit("gl");
    }
  }

  /** Turns the pointer into a world-space ray and a measure of its motion. */
  private updatePointer(width: number, height: number, dt: number) {
    const pointer = runtime.pointer;
    if (!pointer.active) return;

    const moved = this.hadPointer
      ? Math.hypot(pointer.x - this.lastPointer.x, pointer.y - this.lastPointer.y)
      : 0;
    this.lastPointer.set(pointer.x, pointer.y);

    // Speed in viewport heights per second, squashed into 0..1.
    const speed = moved / height / dt;
    const target = clamp(speed / 1.6);
    this.pointerEnergy = lerp(this.pointerEnergy, target, damp(target > this.pointerEnergy ? 14 : 3, dt));

    this.rayDirection
      .set((pointer.x / width) * 2 - 1, -(pointer.y / height) * 2 + 1, 0.5)
      .unproject(this.camera)
      .sub(this.camera.position)
      .normalize();

    this.rayPoint.copy(this.camera.position).addScaledVector(this.rayDirection, this.rig.focus);
    if (this.hadPointer) {
      this.scratch.copy(this.rayPoint).sub(this.lastRayPoint).divideScalar(dt).clampLength(0, 18);
      this.pointerVelocity.lerp(this.scratch, damp(12, dt));
    }
    this.lastRayPoint.copy(this.rayPoint);
    this.hadPointer = true;
  }

  /** Pins each skill label to its node in the constellation. */
  private updateLabels(width: number, height: number) {
    if (!runtime.liveLabels) return;
    const shown = clamp(1.6 - Math.abs(this.scene - 2) * 2.6);
    if (shown <= 0 && !this.labelsShown) return;
    this.labelsShown = shown > 0;

    const stage = runtime.skillStageEl?.getBoundingClientRect();
    const left = stage?.left ?? 0;
    const top = stage?.top ?? 0;
    const nodes = this.options.skillNodes;

    for (let i = 0; i < nodes.length; i++) {
      const el = runtime.skillEls[i];
      if (!el) continue;
      const p = skillNodePosition(nodes[i], this.skillAngle, this.scratch);
      const distance = p.distanceTo(this.camera.position);
      p.project(this.camera);
      const x = (p.x * 0.5 + 0.5) * width - left;
      const y = (-p.y * 0.5 + 0.5) * height - top;
      // Nodes on the far side of the orbit recede.
      const near = clamp((16 - distance) / 9);
      const hovered = runtime.hoverSkill === i;
      const alpha = shown * (hovered ? 1 : 0.55 + 0.45 * near);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${(0.82 + near * 0.24).toFixed(3)})`;
      el.style.opacity = alpha.toFixed(3);
      el.style.visibility = alpha < 0.02 ? "hidden" : "visible";
      el.style.zIndex = hovered ? "40" : String(Math.round(near * 30));
    }
  }

  dispose() {
    this.world.remove(this.backdrop, this.panels.group, this.particles.points);
    this.backdrop.geometry.dispose();
    this.backdrop.material.dispose();
    this.particles.dispose();
    this.panels.dispose();
  }
}
