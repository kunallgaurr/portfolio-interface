import { Vector3 } from "three";
import {
  CONTACT,
  PATH,
  SKILL_RINGS,
  gateZ,
  pathPoint,
  type SkillNode,
} from "./layout";

/**
 * Builds one target texture per section. Each texel is a particle:
 * xyz is its rest position and w is a tag the shaders use to animate and
 * colour it. Particles pick their role at random, so any prefix of the
 * texture is a fair sample of the whole shape; that lets the renderer draw
 * fewer particles on slow devices without holes appearing.
 */

type Rng = () => number;

function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(rng: Rng) {
  const u = Math.max(rng(), 1e-7);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(Math.PI * 2 * rng());
}

/** Uniform random direction on the unit sphere, written into out. */
function sphere(rng: Rng, out: Vector3) {
  const z = rng() * 2 - 1;
  const a = rng() * Math.PI * 2;
  const r = Math.sqrt(1 - z * z);
  return out.set(Math.cos(a) * r, z, Math.sin(a) * r);
}

type Fill = (rng: Rng, out: Float32Array, o: number) => void;

function fill(size: number, seed: number, fn: Fill) {
  const data = new Float32Array(size * size * 4);
  const rng = mulberry32(seed);
  for (let i = 0; i < size * size; i++) fn(rng, data, i * 4);
  return data;
}

const v = new Vector3();

/* Hero: a turbulent core with two orbital rings. Tags: 0 shell, 0.5 inner
   volume, 1 and 2 rings (laid flat here, tilted in the shader), 3 dust. */
const hero: Fill = (rng, out, o) => {
  const pick = rng();
  let tag = 0;
  if (pick < 0.6) {
    sphere(rng, v).multiplyScalar(2 * (1 + gauss(rng) * 0.012));
  } else if (pick < 0.74) {
    sphere(rng, v).multiplyScalar(2 * Math.cbrt(rng()) * 0.9);
    tag = 0.5;
  } else if (pick < 0.87) {
    const a = rng() * Math.PI * 2;
    const r = 3.15 + gauss(rng) * 0.05;
    v.set(Math.cos(a) * r, gauss(rng) * 0.015, Math.sin(a) * r);
    tag = 1;
  } else if (pick < 0.96) {
    const a = rng() * Math.PI * 2;
    const r = 3.95 + gauss(rng) * 0.14;
    v.set(Math.cos(a) * r, gauss(rng) * 0.02, Math.sin(a) * r);
    tag = 2;
  } else {
    sphere(rng, v).multiplyScalar(5 + rng() * 9);
    tag = 3;
  }
  out[o] = v.x;
  out[o + 1] = v.y;
  out[o + 2] = v.z;
  out[o + 3] = tag;
};

/* About: a wide field of ridgelines the shader turns into rolling waves.
   Tags: 0 ridgeline, 0.5 scattered fill, 3 dust above. */
const about: Fill = (rng, out, o) => {
  const pick = rng();
  let tag = 0;
  let x = (rng() * 2 - 1) * 17;
  let y = -1.7;
  let z = -24 + rng() * 31;
  if (pick < 0.88) {
    z = Math.round(z / 0.34) * 0.34;
    y += gauss(rng) * 0.01;
  } else if (pick < 0.92) {
    tag = 0.5;
  } else {
    tag = 3;
    x = (rng() * 2 - 1) * 14;
    y = -1 + rng() * 8;
    z = -20 + rng() * 26;
  }
  out[o] = x;
  out[o + 1] = y;
  out[o + 2] = z;
  out[o + 3] = tag;
};

/* Skills: a core, three orbit lines, a cluster per skill and far stars.
   Tag = ring * 100 + node + 1, where ring 0 means "does not orbit". */
function skills(nodes: SkillNode[]): Fill {
  return (rng, out, o) => {
    const pick = rng();
    let tag = 0;
    if (pick < 0.07) {
      sphere(rng, v).multiplyScalar(0.42 * Math.cbrt(rng()));
    } else if (pick < 0.36) {
      const ring = Math.floor(rng() * SKILL_RINGS.length);
      const a = rng() * Math.PI * 2;
      const r = SKILL_RINGS[ring].radius + gauss(rng) * 0.012;
      v.set(Math.cos(a) * r, gauss(rng) * 0.012, Math.sin(a) * r);
      tag = (ring + 1) * 100;
    } else if (pick < 0.78 && nodes.length > 0) {
      const index = Math.floor(rng() * nodes.length);
      const node = nodes[index];
      const r = SKILL_RINGS[node.ring].radius;
      sphere(rng, v).multiplyScalar(0.17 * Math.abs(gauss(rng)) * 0.75);
      v.x += Math.cos(node.angle) * r;
      v.z += Math.sin(node.angle) * r;
      tag = (node.ring + 1) * 100 + index + 1;
    } else {
      sphere(rng, v).multiplyScalar(7 + rng() * 11);
    }
    out[o] = v.x;
    out[o + 1] = v.y;
    out[o + 2] = v.z;
    out[o + 3] = tag;
  };
}

/* Work: a rifled tunnel the project panels float inside.
   Tags: 0 helical streaks, 0.5 accent streaks, 1 wall haze, 3 dust. */
const work: Fill = (rng, out, o) => {
  const pick = rng();
  const z = -40 + rng() * 54;
  let tag = 0;
  let a = rng() * Math.PI * 2;
  let r = 5.4;
  if (pick < 0.62) {
    const strands = 28;
    const strand = Math.floor(rng() * strands);
    a = (strand / strands) * Math.PI * 2 + z * 0.09 + gauss(rng) * 0.004;
    r += gauss(rng) * 0.03;
    tag = strand % 7 === 0 ? 0.5 : 0;
  } else if (pick < 0.93) {
    r += gauss(rng) * 0.35;
    tag = 1;
  } else {
    r = Math.sqrt(rng()) * 4.6;
    tag = 3;
  }
  out[o] = Math.cos(a) * r;
  out[o + 1] = Math.sin(a) * r;
  out[o + 2] = z;
  out[o + 3] = tag;
};

/* Experience: a path into the distance with a ring gate per job.
   Tags: 0 path, 1..8 gates, 9 dust. */
function experience(jobCount: number): Fill {
  const gates = Math.max(1, Math.min(jobCount, 8));
  return (rng, out, o) => {
    const pick = rng();
    let tag = 0;
    if (pick < 0.44) {
      const z = PATH.zStart + rng() * (PATH.zEnd - PATH.zStart);
      pathPoint(z, v);
      const spread = rng() < 0.7 ? 0.035 : 0.3;
      v.x += gauss(rng) * spread;
      v.y += gauss(rng) * spread * 0.6;
    } else if (pick < 0.76) {
      const k = Math.floor(rng() * gates);
      const z = gateZ(k, gates);
      pathPoint(z, v);
      // Dashed double ring: twelve arcs with gaps between them.
      const dash = Math.floor(rng() * 12);
      const a = ((dash + rng() * 0.72) / 12) * Math.PI * 2;
      const outer = rng() < 0.3;
      const r = (outer ? PATH.gateRadius + 0.35 : PATH.gateRadius) + gauss(rng) * 0.012;
      v.x += Math.cos(a) * r;
      v.y += PATH.camLift + Math.sin(a) * r;
      v.z += gauss(rng) * 0.01 + (outer ? -0.25 : 0);
      tag = 1 + k;
    } else {
      const z = PATH.zStart + 6 + rng() * (PATH.zEnd - PATH.zStart - 12);
      pathPoint(z, v);
      v.x += (rng() * 2 - 1) * 10;
      v.y += (rng() * 2 - 1) * 5.5 + 1;
      tag = 9;
    }
    out[o] = v.x;
    out[o + 1] = v.y;
    out[o + 2] = v.z;
    out[o + 3] = tag;
  };
}

/* Contact: an eclipse ring with a corona streaming off it.
   Tags: 0 ring, 1 corona, 3 dust. */
const contact: Fill = (rng, out, o) => {
  const pick = rng();
  const a = rng() * Math.PI * 2;
  let r = CONTACT.radius;
  let z = CONTACT.z;
  let tag = 0;
  if (pick < 0.5) {
    r += Math.abs(gauss(rng)) * 0.035;
    z += gauss(rng) * 0.02;
  } else if (pick < 0.86) {
    r += -Math.log(Math.max(rng(), 1e-6)) * 0.55;
    z += gauss(rng) * 0.12;
    tag = 1;
  } else {
    r = 4 + rng() * 14;
    z += (rng() * 2 - 1) * 9;
    tag = 3;
  }
  out[o] = Math.cos(a) * r;
  out[o + 1] = Math.sin(a) * r;
  out[o + 2] = z;
  out[o + 3] = tag;
};

/** A tight seed cloud at the origin the hero form bursts out of. */
export function buildSeed(size: number) {
  return fill(size, 7, (rng, out, o) => {
    sphere(rng, v).multiplyScalar(0.05 * Math.cbrt(rng()));
    out[o] = v.x;
    out[o + 1] = v.y;
    out[o + 2] = v.z;
    out[o + 3] = 1;
  });
}

export function buildShapes(size: number, nodes: SkillNode[], jobCount: number) {
  return [
    fill(size, 11, hero),
    fill(size, 23, about),
    fill(size, 37, skills(nodes)),
    fill(size, 41, work),
    fill(size, 59, experience(jobCount)),
    fill(size, 67, contact),
  ];
}
