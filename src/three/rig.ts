import * as THREE from "three";
import { clamp, damp, lerp, runtime, smoothstep } from "@/lib/runtime";
import { CONTACT, PATH, pathPoint } from "./layout";

type Pose = {
  position: THREE.Vector3;
  target: THREE.Vector3;
  /** Where the vanishing point sits, as a fraction of the viewport. */
  shiftX: number;
  shiftY: number;
  /** Distance that is in focus. */
  focus: number;
  roll: number;
};

const makePose = (): Pose => ({
  position: new THREE.Vector3(),
  target: new THREE.Vector3(),
  shiftX: 0,
  shiftY: 0,
  focus: 9,
  roll: 0,
});

const BASE_FOV = 45;

/**
 * Drives the camera along a path keyed to the page sections. Each section
 * defines a pose as a function of its own progress; scrolling between two
 * sections blends their poses.
 */
export class CameraRig {
  focus = 9;
  /** Current view offset in CSS pixels, for anything that maps DOM to 3D. */
  readonly offset = new THREE.Vector2();

  private readonly a = makePose();
  private readonly b = makePose();
  private readonly position = new THREE.Vector3();
  private readonly target = new THREE.Vector3();
  private readonly parallax = new THREE.Vector2();
  private shiftX = 0;
  private shiftY = 0;
  private roll = 0;
  private started = false;

  update(
    camera: THREE.PerspectiveCamera,
    width: number,
    height: number,
    scene: number,
    dt: number,
  ) {
    const aspect = width / height;
    // 0 on a phone held upright, 1 on a landscape screen.
    const wide = smoothstep(0.85, 1.35, aspect);

    const index = clamp(Math.floor(scene), 0, 5);
    const next = Math.min(index + 1, 5);
    const k = scene - index;
    const blend = k * k * (3 - 2 * k);

    this.pose(index, wide, this.a);
    this.pose(next, wide, this.b);
    const a = this.a;
    const b = this.b;
    a.position.lerp(b.position, blend);
    a.target.lerp(b.target, blend);

    // Smooth the camera so fast scrolling never snaps it.
    const follow = this.started ? damp(runtime.reducedMotion ? 12 : 5.5, dt) : 1;
    this.started = true;
    this.position.lerp(a.position, follow);
    this.target.lerp(a.target, follow);
    this.shiftX = lerp(this.shiftX, lerp(a.shiftX, b.shiftX, blend), follow);
    this.shiftY = lerp(this.shiftY, lerp(a.shiftY, b.shiftY, blend), follow);
    this.roll = lerp(this.roll, lerp(a.roll, b.roll, blend), follow);
    this.focus = lerp(this.focus, lerp(a.focus, b.focus, blend), follow);

    // Narrow screens get a wider lens so the forms still fit.
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(BASE_FOV / 2));
    const fov = THREE.MathUtils.radToDeg(
      2 * Math.atan(tanHalf * clamp(0.85 / aspect, 1, 2.1)),
    );
    camera.fov = fov;
    camera.aspect = aspect;

    camera.position.copy(this.position);
    camera.up.set(0, 1, 0);
    camera.lookAt(this.target);

    // The pointer nudges the camera for a sense of depth.
    const still = runtime.reducedMotion || runtime.coarsePointer || !runtime.pointer.active;
    const px = still ? 0 : (runtime.pointer.x / width) * 2 - 1;
    const py = still ? 0 : (runtime.pointer.y / height) * 2 - 1;
    this.parallax.x = lerp(this.parallax.x, px, damp(2.5, dt));
    this.parallax.y = lerp(this.parallax.y, py, damp(2.5, dt));
    camera.translateX(this.parallax.x * 0.45);
    camera.translateY(-this.parallax.y * 0.28);
    camera.lookAt(this.target);
    camera.rotateZ(this.roll);

    this.offset.set(-this.shiftX * width, this.shiftY * height);
    camera.setViewOffset(width, height, this.offset.x, this.offset.y, width, height);
    camera.updateMatrixWorld();
  }

  private pose(index: number, wide: number, out: Pose) {
    const p = runtime.progress[index] ?? 0;
    out.shiftX = 0;
    out.shiftY = 0;
    out.roll = 0;

    switch (index) {
      case 0: {
        out.position.set(0, 0.15, 11.6 - p * 2.6);
        out.target.set(0, 0, 0);
        out.shiftX = 0.21 * wide;
        out.shiftY = 0.13 * (1 - wide) + 0.03 * wide;
        out.focus = 10.4;
        break;
      }
      case 1: {
        out.position.set(0, 0.9 + p * 0.8, 9.5 - p * 3.5);
        out.target.set(0, -1.5, -7);
        out.shiftY = 0.04;
        out.focus = 11;
        break;
      }
      case 2: {
        const a = (p - 0.5) * 0.8;
        out.position.set(Math.sin(a) * 11.2, 2.7, Math.cos(a) * 11.2);
        out.target.set(0, -0.15, 0);
        out.shiftY = -0.03 * wide;
        out.focus = 11.2;
        break;
      }
      case 3: {
        const w = runtime.workProgress;
        out.position.set(0, 0, 10 - w * 9);
        out.target.set(0, 0, -12 - w * 9);
        out.roll = (w - 0.5) * 0.45;
        out.focus = 15;
        break;
      }
      case 4: {
        const z = PATH.camStart - p * PATH.camTravel;
        pathPoint(z, out.position);
        out.position.y += PATH.camLift;
        pathPoint(z - 7, out.target);
        out.target.y += PATH.camLift - 0.15;
        out.shiftX = 0.17 * wide;
        out.focus = 7;
        break;
      }
      default: {
        out.position.set(0, 0, CONTACT.z + 9 - p * 0.9);
        out.target.set(0, 0, CONTACT.z);
        out.shiftY = 0.01;
        out.focus = 8.5;
      }
    }
  }
}
