import * as THREE from "three";
import {
  particleFragment,
  particleVertex,
  positionFragment,
  seedFragment,
  simVertex,
  velocityFragment,
} from "./glsl";
import { buildSeed, buildShapes } from "./shapes";
import type { SkillNode } from "./layout";

/** How each shape behaves once particles have arrived. */
const DYNAMICS = [
  { stiffness: 15, damping: 3.0, flow: 2.4 }, // hero
  { stiffness: 12, damping: 3.0, flow: 0.22 }, // about
  { stiffness: 24, damping: 4.6, flow: 0.35 }, // skills
  { stiffness: 10, damping: 3.0, flow: 1.5 }, // work
  { stiffness: 14, damping: 3.4, flow: 0.9 }, // experience
  { stiffness: 20, damping: 3.6, flow: 0.7 }, // contact
];

export type ParticleFrame = {
  dt: number;
  time: number;
  /** Section index plus blend toward the next. */
  scene: number;
  intro: number;
  skillAngle: number;
  hoverSkill: number;
  rayOrigin: THREE.Vector3;
  rayDirection: THREE.Vector3;
  pointerVelocity: THREE.Vector3;
  pointerBase: number;
  pointerEnergy: number;
  focus: number;
  /** Drawing-buffer pixels per world unit at distance 1. */
  scale: number;
  dim: number;
  calm: boolean;
};

/**
 * A particle system simulated entirely on the GPU. Positions and velocities
 * live in float textures; each frame a fragment shader springs every particle
 * toward a blend of two target shapes, stirs it with curl noise and reacts to
 * the pointer. Devices without float render targets fall back to placing
 * particles directly in the vertex shader.
 */
export class ParticleSystem {
  readonly points: THREE.Points;
  readonly count: number;
  readonly stateless: boolean;

  private readonly size: number;
  private readonly targets: THREE.DataTexture[];
  private readonly seed: THREE.DataTexture;
  private readonly zero: THREE.DataTexture;
  private readonly material: THREE.ShaderMaterial;
  private readonly simScene = new THREE.Scene();
  private readonly simCamera = new THREE.Camera();
  private readonly simMesh: THREE.Mesh;
  private readonly seedMaterial: THREE.ShaderMaterial;
  private readonly velocityMaterial: THREE.ShaderMaterial;
  private readonly positionMaterial: THREE.ShaderMaterial;
  private readonly positionTargets: THREE.WebGLRenderTarget[] = [];
  private readonly velocityTargets: THREE.WebGLRenderTarget[] = [];
  private readonly shared = {
    uTime: { value: 0 },
    uSkillAngle: { value: 0 },
  };
  private flip = 0;
  private seeded = false;
  private fraction = 1;

  constructor(
    renderer: THREE.WebGLRenderer,
    size: number,
    nodes: SkillNode[],
    jobCount: number,
    palette: { accent: THREE.Color; ice: THREE.Color; hot: THREE.Color },
  ) {
    this.size = size;
    this.count = size * size;
    this.stateless = !renderer.extensions.has("EXT_color_buffer_float");

    const texture = (data: Float32Array) => {
      const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
      t.needsUpdate = true;
      return t;
    };
    this.targets = buildShapes(size, nodes, jobCount).map(texture);
    this.seed = texture(buildSeed(size));
    this.zero = texture(new Float32Array(size * size * 4));

    // Simulation passes draw one triangle that covers the whole target.
    const triangle = new THREE.BufferGeometry();
    triangle.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3),
    );
    triangle.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2));

    const pass = (fragmentShader: string, uniforms: Record<string, THREE.IUniform>) =>
      new THREE.ShaderMaterial({
        vertexShader: simVertex,
        fragmentShader,
        uniforms,
        depthTest: false,
        depthWrite: false,
      });

    this.seedMaterial = pass(seedFragment, { uSource: { value: this.seed } });
    this.velocityMaterial = pass(velocityFragment, {
      ...this.shared,
      uPos: { value: null },
      uVel: { value: null },
      uTargetA: { value: this.targets[0] },
      uTargetB: { value: this.targets[1] },
      uShapeA: { value: 0 },
      uShapeB: { value: 1 },
      uMix: { value: 0 },
      uDt: { value: 0.016 },
      uStiffness: { value: 10 },
      uDamping: { value: 3 },
      uFlow: { value: 1 },
      uBurst: { value: 5 },
      uRayO: { value: new THREE.Vector3() },
      uRayD: { value: new THREE.Vector3(0, 0, -1) },
      uPointerVel: { value: new THREE.Vector3() },
      uPointerBase: { value: 0 },
      uPointerEnergy: { value: 0 },
    });
    this.positionMaterial = pass(positionFragment, {
      uPos: { value: null },
      uVel: { value: null },
      uDt: { value: 0.016 },
    });

    this.simMesh = new THREE.Mesh(triangle, this.seedMaterial);
    this.simMesh.frustumCulled = false;
    this.simScene.add(this.simMesh);

    if (!this.stateless) {
      const make = () =>
        new THREE.WebGLRenderTarget(size, size, {
          type: THREE.FloatType,
          format: THREE.RGBAFormat,
          minFilter: THREE.NearestFilter,
          magFilter: THREE.NearestFilter,
          depthBuffer: false,
          stencilBuffer: false,
          generateMipmaps: false,
        });
      this.positionTargets.push(make(), make());
      this.velocityTargets.push(make(), make());
    }

    // Each vertex only carries the texel it reads its state from.
    const refs = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count; i++) {
      refs[i * 3] = ((i % size) + 0.5) / size;
      refs[i * 3 + 1] = (Math.floor(i / size) + 0.5) / size;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(refs, 3));

    this.material = new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      defines: this.stateless ? { STATELESS: "" } : {},
      uniforms: {
        ...this.shared,
        uPos: { value: null },
        uVel: { value: null },
        uTargetA: { value: this.targets[0] },
        uTargetB: { value: this.targets[1] },
        uShapeA: { value: 0 },
        uShapeB: { value: 1 },
        uMix: { value: 0 },
        uSize: { value: 0.0125 * Math.sqrt(512 / size) },
        uScale: { value: 1000 },
        uFocus: { value: 9 },
        uAperture: { value: 0.0016 },
        uAlpha: { value: 0.6 },
        uDim: { value: 1 },
        uIntro: { value: 0 },
        uHoverSkill: { value: -1 },
        uFlow: { value: 1 },
        uBurst: { value: 5 },
        uAccent: { value: palette.accent },
        uIce: { value: palette.ice },
        uHot: { value: palette.hot },
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: true,
      depthWrite: false,
    });

    this.points = new THREE.Points(geometry, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 2;
  }

  /** Draw only part of the particles; the shapes stay intact. */
  setFraction(fraction: number) {
    this.fraction = fraction;
    this.points.geometry.setDrawRange(0, Math.floor(this.count * fraction));
  }

  update(renderer: THREE.WebGLRenderer, frame: ParticleFrame) {
    const last = this.targets.length - 1;
    const scene = Math.min(Math.max(frame.scene, 0), last);
    const a = Math.min(Math.floor(scene), last);
    const b = Math.min(a + 1, last);
    const mix = scene - a;

    // Blend the feel of the two shapes along with their positions.
    const da = DYNAMICS[a];
    const db = DYNAMICS[b];
    const calm = frame.calm ? 0.35 : 1;
    // During the intro the spring starts loose so the form unfurls.
    const open = 0.06 + 0.94 * frame.intro * frame.intro;
    const stiffness = (da.stiffness + (db.stiffness - da.stiffness) * mix) * open;
    const damping = da.damping + (db.damping - da.damping) * mix;
    const flow = (da.flow + (db.flow - da.flow) * mix) * calm + (1 - frame.intro) * 5;
    const burst = 7 * calm;

    this.shared.uTime.value = frame.time;
    this.shared.uSkillAngle.value = frame.skillAngle;

    if (!this.stateless) {
      const previous = renderer.getRenderTarget();
      if (!this.seeded) this.runSeed(renderer);

      const read = this.flip;
      const write = 1 - this.flip;

      const vu = this.velocityMaterial.uniforms;
      vu.uPos.value = this.positionTargets[read].texture;
      vu.uVel.value = this.velocityTargets[read].texture;
      vu.uTargetA.value = this.targets[a];
      vu.uTargetB.value = this.targets[b];
      vu.uShapeA.value = a;
      vu.uShapeB.value = b;
      vu.uMix.value = mix;
      vu.uDt.value = frame.dt;
      vu.uStiffness.value = stiffness;
      vu.uDamping.value = damping;
      vu.uFlow.value = flow;
      vu.uBurst.value = burst;
      vu.uRayO.value.copy(frame.rayOrigin);
      vu.uRayD.value.copy(frame.rayDirection);
      vu.uPointerVel.value.copy(frame.pointerVelocity);
      vu.uPointerBase.value = frame.pointerBase;
      vu.uPointerEnergy.value = frame.pointerEnergy;
      this.simMesh.material = this.velocityMaterial;
      renderer.setRenderTarget(this.velocityTargets[write]);
      renderer.render(this.simScene, this.simCamera);

      const pu = this.positionMaterial.uniforms;
      pu.uPos.value = this.positionTargets[read].texture;
      pu.uVel.value = this.velocityTargets[write].texture;
      pu.uDt.value = frame.dt;
      this.simMesh.material = this.positionMaterial;
      renderer.setRenderTarget(this.positionTargets[write]);
      renderer.render(this.simScene, this.simCamera);

      renderer.setRenderTarget(previous);
      this.flip = write;
    }

    const u = this.material.uniforms;
    if (!this.stateless) {
      u.uPos.value = this.positionTargets[this.flip].texture;
      u.uVel.value = this.velocityTargets[this.flip].texture;
    }
    u.uTargetA.value = this.targets[a];
    u.uTargetB.value = this.targets[b];
    u.uShapeA.value = a;
    u.uShapeB.value = b;
    u.uMix.value = mix;
    u.uScale.value = frame.scale;
    u.uFocus.value = frame.focus;
    u.uIntro.value = frame.intro;
    u.uHoverSkill.value = frame.hoverSkill;
    u.uFlow.value = flow;
    u.uBurst.value = burst;
    u.uDim.value = frame.dim;
    // Fewer particles are drawn brighter so the forms keep their weight.
    u.uAlpha.value = 0.6 / Math.sqrt(this.fraction);
  }

  private runSeed(renderer: THREE.WebGLRenderer) {
    this.simMesh.material = this.seedMaterial;
    const source = this.seedMaterial.uniforms.uSource;
    for (let i = 0; i < 2; i++) {
      source.value = this.seed;
      renderer.setRenderTarget(this.positionTargets[i]);
      renderer.render(this.simScene, this.simCamera);
      source.value = this.zero;
      renderer.setRenderTarget(this.velocityTargets[i]);
      renderer.render(this.simScene, this.simCamera);
    }
    this.seeded = true;
  }

  dispose() {
    this.points.geometry.dispose();
    this.simMesh.geometry.dispose();
    this.material.dispose();
    this.seedMaterial.dispose();
    this.velocityMaterial.dispose();
    this.positionMaterial.dispose();
    this.targets.forEach((t) => t.dispose());
    this.seed.dispose();
    this.zero.dispose();
    this.positionTargets.forEach((t) => t.dispose());
    this.velocityTargets.forEach((t) => t.dispose());
  }
}
