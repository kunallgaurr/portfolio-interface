/**
 * All GLSL for the scene. Numbers that describe the layout (ring speeds,
 * tilts, the path curve) mirror layout.ts.
 */

const noise = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

// Simplex noise, Ian McEwan / Ashima Arts (MIT).
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
    i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
    i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

vec3 snoise3(vec3 p) {
  return vec3(
    snoise(p),
    snoise(p + vec3(31.4, -17.2, 9.7)),
    snoise(p + vec3(-11.3, 23.9, -41.1)));
}

// Divergence-free flow field, so particles swirl instead of clumping.
vec3 curl(vec3 p) {
  const float e = 0.12;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);
  vec3 x0 = snoise3(p - dx); vec3 x1 = snoise3(p + dx);
  vec3 y0 = snoise3(p - dy); vec3 y1 = snoise3(p + dy);
  vec3 z0 = snoise3(p - dz); vec3 z1 = snoise3(p + dz);
  return vec3(
    y1.z - y0.z - z1.y + z0.y,
    z1.x - z0.x - x1.z + x0.z,
    x1.y - x0.y - y1.x + y0.x) / (2.0 * e);
}
`;

const common = /* glsl */ `
vec3 hash3(vec2 p) {
  vec3 q = vec3(
    dot(p, vec2(127.1, 311.7)),
    dot(p, vec2(269.5, 183.3)),
    dot(p, vec2(419.2, 371.9)));
  return fract(sin(q) * 43758.5453);
}

// Each particle leaves for the next shape at its own moment.
float particleMix(float m, float r) {
  float delay = r * 0.42;
  return smoothstep(delay, delay + 0.58, m);
}

vec3 rotY(vec3 p, float a) {
  float c = cos(a); float s = sin(a);
  return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}
vec3 rotX(vec3 p, float a) {
  float c = cos(a); float s = sin(a);
  return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}
vec3 rotZ(vec3 p, float a) {
  float c = cos(a); float s = sin(a);
  return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z);
}
`;

const animate = /* glsl */ `
uniform float uTime;
uniform float uSkillAngle;

vec2 pathXY(float z) {
  return vec2(sin(z * 0.16) * 1.3, cos(z * 0.11) * 0.5 - 1.0);
}

// Moves a rest position into its live, animated position.
vec3 animateShape(int shape, vec4 t) {
  vec3 p = t.xyz;
  float tag = t.w;

  if (shape == 0) {
    if (tag < 0.75) {
      p = rotY(p, uTime * 0.1);
      float n = snoise(p * 0.8 + vec3(0.0, uTime * 0.16, 0.0));
      float n2 = snoise(p * 2.1 - vec3(uTime * 0.22));
      p += normalize(p + 1e-5) * (n * 0.36 + n2 * 0.08) * (tag < 0.25 ? 1.0 : 0.6);
    } else if (tag < 1.5) {
      p = rotZ(rotX(rotY(p, uTime * 0.3), 1.15), 0.35);
    } else if (tag < 2.5) {
      p = rotZ(rotX(rotY(p, -uTime * 0.19), -0.45), -0.8);
    }
  } else if (shape == 1) {
    if (tag < 2.5) {
      float w = snoise(vec3(p.x * 0.15, p.z * 0.15, uTime * 0.11));
      w += snoise(vec3(p.x * 0.42 + 4.0, p.z * 0.42, uTime * 0.19)) * 0.3;
      p.y += w * 1.05;
    }
  } else if (shape == 2) {
    float ring = floor(tag / 100.0 + 0.001);
    if (ring > 0.5) {
      float speed = ring < 1.5 ? 1.0 : (ring < 2.5 ? -0.62 : 0.42);
      p = rotZ(rotX(rotY(p, uSkillAngle * speed), 0.42), 0.12);
    }
  } else if (shape == 3) {
    if (tag < 2.5) p = rotZ(p, uTime * 0.035);
  } else if (shape == 4) {
    if (tag < 0.5) {
      p.x += snoise(vec3(p.z * 0.28, uTime * 0.25, 0.0)) * 0.07;
      p.y += snoise(vec3(p.z * 0.28, 7.0, uTime * 0.25)) * 0.07;
    } else if (tag < 8.5) {
      vec2 c = pathXY(p.z) + vec2(0.0, 0.9);
      float dir = mod(tag, 2.0) < 1.0 ? 1.0 : -1.0;
      float a = uTime * 0.16 * dir;
      vec2 d = p.xy - c;
      p.xy = c + vec2(cos(a) * d.x - sin(a) * d.y, sin(a) * d.x + cos(a) * d.y);
    }
  } else {
    if (tag < 0.5) {
      p = rotZ(p, uTime * 0.07);
    } else if (tag < 1.5) {
      float r = length(p.xy);
      float ang = atan(p.y, p.x);
      float flare = snoise(vec3(cos(ang) * 1.6, sin(ang) * 1.6, uTime * 0.22));
      r += max(flare, 0.0) * (r - 2.6) * 1.5;
      ang += uTime * 0.03;
      p.xy = vec2(cos(ang), sin(ang)) * r;
    }
  }
  return p;
}
`;

/* ------------------------------------------------------------ simulation */

export const simVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const seedFragment = /* glsl */ `
uniform sampler2D uSource;
varying vec2 vUv;
void main() {
  gl_FragColor = texture2D(uSource, vUv);
}
`;

export const velocityFragment = /* glsl */ `
${noise}
${common}
${animate}

uniform sampler2D uPos;
uniform sampler2D uVel;
uniform sampler2D uTargetA;
uniform sampler2D uTargetB;
uniform int uShapeA;
uniform int uShapeB;
uniform float uMix;
uniform float uDt;
uniform float uStiffness;
uniform float uDamping;
uniform float uFlow;
uniform float uBurst;
uniform vec3 uRayO;
uniform vec3 uRayD;
uniform vec3 uPointerVel;
uniform float uPointerBase;
uniform float uPointerEnergy;
varying vec2 vUv;

void main() {
  vec3 pos = texture2D(uPos, vUv).xyz;
  vec3 vel = texture2D(uVel, vUv).xyz;
  vec3 rnd = hash3(vUv);

  float m = particleMix(uMix, rnd.x);
  vec3 a = animateShape(uShapeA, texture2D(uTargetA, vUv));
  vec3 b = animateShape(uShapeB, texture2D(uTargetB, vUv));
  vec3 target = mix(a, b, m);

  // Spring toward the target, with per-particle stiffness for layered motion.
  vec3 force = (target - pos) * uStiffness * (0.55 + rnd.y * 0.9);

  // Ambient flow, stronger while a particle is travelling between shapes.
  float travelling = sin(m * 3.14159265);
  force += curl(pos * 0.21 + uTime * 0.045) * (uFlow + travelling * uBurst);

  // The pointer is a ray through the scene: push away from it, swirl
  // around it and drag along with it.
  vec3 rel = pos - uRayO;
  float along = max(dot(rel, uRayD), 0.0);
  vec3 off = rel - uRayD * along;
  float d = length(off);
  float radius = 0.35 + along * 0.075;
  float fall = exp(-(d * d) / (radius * radius));
  vec3 n = off / (d + 1e-4);
  force += n * fall * (uPointerBase + uPointerEnergy * 30.0);
  force += cross(uRayD, n) * fall * uPointerEnergy * 16.0;
  force += uPointerVel * fall * 2.5;

  vel += force * uDt;
  vel *= exp(-uDamping * uDt);
  gl_FragColor = vec4(vel, 1.0);
}
`;

export const positionFragment = /* glsl */ `
uniform sampler2D uPos;
uniform sampler2D uVel;
uniform float uDt;
varying vec2 vUv;
void main() {
  vec3 pos = texture2D(uPos, vUv).xyz;
  vec3 vel = texture2D(uVel, vUv).xyz;
  gl_FragColor = vec4(pos + vel * uDt, 1.0);
}
`;

/* -------------------------------------------------------------- particles */

export const particleVertex = /* glsl */ `
${noise}
${common}
${animate}

uniform sampler2D uPos;
uniform sampler2D uVel;
uniform sampler2D uTargetA;
uniform sampler2D uTargetB;
uniform int uShapeA;
uniform int uShapeB;
uniform float uMix;
uniform float uSize;
uniform float uScale;
uniform float uFocus;
uniform float uAperture;
uniform float uAlpha;
uniform float uDim;
uniform float uIntro;
uniform float uHoverSkill;
uniform float uFlow;
uniform float uBurst;
uniform vec3 uAccent;
uniform vec3 uIce;
uniform vec3 uHot;
varying vec3 vColor;
varying float vSoft;

const vec3 DUST = vec3(0.72, 0.78, 0.9);

// Colour in rgb, brightness in a.
vec4 shapeColor(int shape, float tag, vec3 rnd, vec3 p) {
  vec3 c = uAccent;
  float a = 1.0;
  if (shape == 0) {
    if (tag < 0.25) {
      c = mix(uAccent * 0.5, uAccent, rnd.y);
      c = mix(c, uHot, pow(rnd.z, 10.0));
    } else if (tag < 0.75) {
      c = uAccent * 0.55; a = 0.4;
    } else if (tag < 2.5) {
      c = mix(uIce, vec3(1.0), rnd.y * 0.35); a = 0.85;
    } else {
      c = DUST; a = 0.4;
    }
  } else if (shape == 1) {
    float h = smoothstep(-2.4, -0.55, p.y);
    c = mix(uIce * 0.6, uAccent, h * h);
    a = mix(0.5, 1.1, h);
    if (tag > 2.5) { c = DUST; a = 0.35; }
  } else if (shape == 2) {
    float node = mod(tag, 100.0) - 1.0;
    float ring = floor(tag / 100.0 + 0.001);
    if (ring > 0.5 && node > -0.5) {
      c = mix(uAccent, uHot, rnd.y * 0.45);
      if (abs(node - uHoverSkill) < 0.5) { c = uHot; a = 2.2; }
    } else if (ring > 0.5) {
      c = uIce; a = 0.42;
    } else if (length(p) < 1.6) {
      c = mix(uAccent, uHot, rnd.y); a = 0.9;
    } else {
      c = DUST; a = 0.4;
    }
  } else if (shape == 3) {
    if (tag < 0.25) { c = mix(uIce * 0.45, uIce, rnd.y); a = 0.55; }
    else if (tag < 0.75) { c = uAccent; a = 0.8; }
    else if (tag < 2.5) { c = uIce * 0.6; a = 0.3; }
    else { c = DUST; a = 0.4; }
  } else if (shape == 4) {
    if (tag < 0.5) { c = mix(uAccent, uHot, pow(rnd.y, 5.0)); a = 0.9; }
    else if (tag < 8.5) { c = mix(uIce, vec3(1.0), rnd.y * 0.3); a = 0.95; }
    else { c = DUST; a = 0.38; }
  } else {
    if (tag < 0.5) { c = mix(uHot, uAccent, rnd.y * 0.7); }
    else if (tag < 1.5) { c = mix(uAccent, uAccent * 0.35, rnd.y); a = 0.65; }
    else { c = DUST; a = 0.38; }
  }
  return vec4(c, a);
}

void main() {
  vec2 ref = position.xy;
  vec3 rnd = hash3(ref);
  float m = particleMix(uMix, rnd.x);
  vec4 ta = texture2D(uTargetA, ref);
  vec4 tb = texture2D(uTargetB, ref);

#ifdef STATELESS
  // No float render targets on this device: place particles directly.
  vec3 pos = mix(animateShape(uShapeA, ta), animateShape(uShapeB, tb), m);
  pos += curl(pos * 0.21 + uTime * 0.045) * 0.09 * (uFlow + sin(m * 3.14159265) * uBurst * 0.4);
  pos *= mix(0.02, 1.0, uIntro);
  float speed = 0.0;
#else
  vec3 pos = texture2D(uPos, ref).xyz;
  float speed = length(texture2D(uVel, ref).xyz);
#endif

  vec4 col = mix(
    shapeColor(uShapeA, ta.w, rnd, pos),
    shapeColor(uShapeB, tb.w, rnd, pos),
    m);
  // Fast particles run hot.
  col.rgb = mix(col.rgb, uHot, smoothstep(2.0, 11.0, speed) * 0.75);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = max(-mv.z, 0.05);

  // A few particles are much larger than the rest.
  float world = uSize * (0.55 + rnd.z * 0.6 + pow(rnd.y, 14.0) * 2.6);
  float sharp = world * uScale / dist;
  // Fake depth of field: out-of-focus particles grow and fade.
  float coc = uAperture * abs(dist - uFocus) / dist * uScale;
  float px = clamp(sharp + coc, 1.5, 22.0);
  float energy = (sharp * sharp) / (px * px);

  gl_PointSize = px;
  vSoft = smoothstep(3.0, 14.0, px);
  // Particles about to pass the lens fade out instead of filling the frame.
  float near = smoothstep(0.8, 4.0, dist);
  vColor = col.rgb * col.a * uAlpha * uDim * near * max(energy, 0.006);
}
`;

export const particleFragment = /* glsl */ `
varying vec3 vColor;
varying float vSoft;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c) * 2.0;
  if (d > 1.0) discard;
  // Small points are soft dots, large ones are flat bokeh discs.
  float dot_ = 1.0 - d;
  float disc = smoothstep(1.0, 0.72, d);
  float a = mix(dot_ * dot_ * 1.6, disc, vSoft);
  gl_FragColor = vec4(vColor * a, 1.0);
}
`;

/* --------------------------------------------------------------- backdrop */

export const backdropVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 1.0, 1.0);
}
`;

export const backdropFragment = /* glsl */ `
${noise}
uniform float uTime;
uniform float uAspect;
uniform float uScene;
uniform float uDim;
uniform vec3 uBase;
uniform vec3 uAccent;
uniform vec3 uIce;
varying vec2 vUv;

void main() {
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
  float t = uTime * 0.025;
  float n = snoise(vec3(p * 0.8, t + uScene * 0.35)) * 0.5 + 0.5;
  float n2 = snoise(vec3(p * 1.7 + 9.0, t * 1.3)) * 0.5 + 0.5;

  // Two soft pools of colour that drift as the page scrolls.
  vec2 warmAt = vec2(0.45 * cos(uScene * 0.9 + 0.4), 0.22 * sin(uScene * 1.3));
  vec2 coolAt = vec2(-0.5 * cos(uScene * 0.7), -0.3 + 0.2 * sin(uScene * 1.1 + 2.0));
  float warm = smoothstep(1.1, 0.0, length(p - warmAt));
  float cool = smoothstep(1.2, 0.0, length(p - coolAt));

  vec3 col = uBase;
  col += uAccent * warm * warm * 0.02 * (0.5 + n);
  col += uIce * cool * cool * 0.012 * (0.5 + n2);
  gl_FragColor = vec4(col * uDim, 1.0);
}
`;

/* ----------------------------------------------------------------- panels */

export const panelVertex = /* glsl */ `
uniform float uHover;
uniform float uBend;
uniform vec2 uMouse;
uniform vec2 uPlane;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 p = position;
  // Bulge toward the viewer under the pointer and bow with scroll speed.
  // z is unscaled, so these are world units.
  vec2 dm = (uv - uMouse) * vec2(uPlane.x / uPlane.y, 1.0);
  p.z += uHover * 0.22 * exp(-dot(dm, dm) * 5.0);
  p.z -= sin(uv.x * 3.14159265) * uBend * 0.5;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const panelFragment = /* glsl */ `
${noise}
uniform float uTime;
uniform float uSeed;
uniform float uHover;
uniform float uBend;
uniform float uOpacity;
uniform float uRadius;
uniform vec2 uMouse;
uniform vec2 uPlane;
uniform vec3 uDeep;
uniform vec3 uMid;
uniform vec3 uGlow;
varying vec2 vUv;

float fbm(vec2 p, float z) {
  float f = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    f += amp * snoise(vec3(p, z));
    p = p * 2.03 + 17.1;
    amp *= 0.5;
  }
  return f * 0.5 + 0.5;
}

// Domain-warped noise read as a contour map: a different terrain per seed.
vec3 art(vec2 uv) {
  float aspect = uPlane.x / uPlane.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 1.5 + uSeed * 3.7;
  float t = uTime * 0.045 + uSeed * 11.0;
  vec2 q = vec2(fbm(p, t), fbm(p + vec2(5.2, 1.3), t));
  float f = fbm(p + 1.9 * q, t * 1.2 + 3.0);

  vec3 col = mix(uDeep, uMid * 0.85, smoothstep(0.38, 0.86, f));
  col = mix(col, uGlow, smoothstep(0.7, 1.0, f * (0.6 + q.x * 0.7)) * 0.8);

  float band = abs(fract(f * 12.0) - 0.5);
  float line = smoothstep(0.045, 0.0, band);
  col += uGlow * line * 0.22 * smoothstep(0.2, 0.7, f);

  // Fine grid, so the panel reads as an instrument rather than a painting.
  vec2 g = abs(fract(uv * vec2(aspect, 1.0) * 14.0) - 0.5);
  col += uGlow * smoothstep(0.49, 0.5, max(g.x, g.y)) * 0.05;
  return col;
}

float roundedBox(vec2 p, vec2 half_, float r) {
  vec2 q = abs(p) - half_ + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 uv = vUv;
  float aspect = uPlane.x / uPlane.y;
  vec2 dm = (uv - uMouse) * vec2(aspect, 1.0);
  float d = length(dm);

  // Liquid ripple spreading from the pointer.
  float ripple = sin(d * 30.0 - uTime * 4.5) * exp(-d * 4.5) * uHover;
  uv += normalize(dm + 1e-4) * ripple * 0.012;
  uv = (uv - 0.5) * (1.0 - uHover * 0.05) + 0.5;

  float split = uHover * (0.004 + exp(-d * 3.0) * 0.012) + abs(uBend) * 0.02;
  vec3 col;
  if (split > 0.0008) {
    vec2 dir = normalize(dm + vec2(1e-4, 0.0));
    col = vec3(art(uv + dir * split).r, art(uv).g, art(uv - dir * split).b);
  } else {
    col = art(uv);
  }

  // Edge falloff and a sheen that follows the pointer.
  vec2 e = vUv * (1.0 - vUv);
  col *= 0.55 + 0.45 * smoothstep(0.0, 0.06, e.x * e.y * 4.0);
  col += uGlow * exp(-d * 3.5) * uHover * 0.12;

  vec2 px = (vUv - 0.5) * uPlane;
  float sd = roundedBox(px, uPlane * 0.5, uRadius);
  float alpha = (1.0 - smoothstep(-1.0, 0.5, sd)) * uOpacity;
  if (alpha < 0.003) discard;
  gl_FragColor = vec4(col, alpha);
}
`;
