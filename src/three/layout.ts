import type { Vector3 } from "three";

/**
 * World-space layout shared by the particle targets, the shaders and the
 * camera. The GLSL in glsl.ts repeats some of these numbers; keep them in sync.
 */

export const SHAPE = {
  hero: 0,
  about: 1,
  skills: 2,
  work: 3,
  experience: 4,
  contact: 5,
} as const;

/* ------------------------------------------------------------------ skills */

export const SKILL_RINGS = [
  { radius: 2.3, speed: 1 },
  { radius: 3.5, speed: -0.62 },
  { radius: 4.7, speed: 0.42 },
];
export const SKILL_TILT_X = 0.42;
export const SKILL_TILT_Z = 0.12;

export type SkillNode = {
  /** Index into SKILL_RINGS. */
  ring: number;
  /** Angle on the ring at rest, in radians. */
  angle: number;
};

/** One ring per skill group, nodes spread evenly around it. */
export function layoutSkills(groupSizes: number[]): SkillNode[] {
  const nodes: SkillNode[] = [];
  groupSizes.forEach((count, group) => {
    const ring = Math.min(group, SKILL_RINGS.length - 1);
    const offset = group * 0.9 + 0.35;
    for (let i = 0; i < count; i++) {
      nodes.push({ ring, angle: offset + (i / count) * Math.PI * 2 });
    }
  });
  return nodes;
}

/** World position of a skill node for the given orbit angle. */
export function skillNodePosition(node: SkillNode, orbit: number, out: Vector3) {
  const ring = SKILL_RINGS[node.ring];
  out.set(Math.cos(node.angle) * ring.radius, 0, Math.sin(node.angle) * ring.radius);
  return skillTransform(out, node.ring, orbit);
}

/** Mirrors the skills branch of animateShape() in the shaders. */
export function skillTransform(p: Vector3, ring: number, orbit: number) {
  rotY(p, orbit * SKILL_RINGS[ring].speed);
  rotX(p, SKILL_TILT_X);
  rotZ(p, SKILL_TILT_Z);
  return p;
}

function rotY(p: Vector3, a: number) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return p.set(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}
function rotX(p: Vector3, a: number) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return p.set(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}
function rotZ(p: Vector3, a: number) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return p.set(c * p.x - s * p.y, s * p.x + c * p.y, p.z);
}

/* -------------------------------------------------------------- experience */

export const PATH = {
  zStart: 2,
  zEnd: -62,
  /** Camera z at the start of the section and how far it travels. */
  camStart: 5,
  camTravel: 58,
  /** Height of the camera above the path centre line. */
  camLift: 0.9,
  gateRadius: 2.3,
};

/** Centre line of the timeline path at depth z. */
export function pathPoint(z: number, out: Vector3) {
  return out.set(Math.sin(z * 0.16) * 1.3, Math.cos(z * 0.11) * 0.5 - 1.0, z);
}

/** Depth of the ring gate that marks job k of n. */
export function gateZ(k: number, n: number) {
  return PATH.camStart - ((k + 0.5) / n) * PATH.camTravel - 4;
}

/* ----------------------------------------------------------------- contact */

export const CONTACT = {
  z: -72,
  radius: 2.6,
};
