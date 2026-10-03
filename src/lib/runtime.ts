/**
 * Mutable per-frame state shared between the DOM layer and the WebGL scene.
 * It is deliberately not React state: it changes every frame and nothing
 * should re-render because of it.
 */

export const SECTION_IDS = [
  "hero",
  "about",
  "skills",
  "work",
  "experience",
  "contact",
] as const;

export const runtime = {
  /** Section index plus the blend toward the next one, e.g. 2.4. */
  scene: 0,
  /** Progress through each section, 0 at its top and 1 at its bottom. */
  progress: [0, 0, 0, 0, 0, 0] as number[],
  /** Horizontal progress through the pinned project gallery. */
  workProgress: 0,
  /** Smoothed scroll velocity in viewport heights per second. */
  scrollVelocity: 0,

  pointer: {
    /** Pixels from the top-left of the viewport. */
    x: 0,
    y: 0,
    /** True once the pointer has moved at least once. */
    active: false,
  },

  /** 0 while the preloader is up, tweened to 1 as the scene opens. */
  intro: 0,
  /** Index of the skill being hovered or focused, -1 for none. */
  hoverSkill: -1,
  /** Index of the project whose expanded view is open, -1 for none. */
  modalProject: -1,
  /** 0 when the expanded view is closed, 1 when fully open. */
  modalBlend: 0,

  reducedMotion: false,
  coarsePointer: false,
  /** True when project covers are drawn by WebGL instead of CSS. */
  planes: false,
  /** True when skill labels follow their 3D nodes. */
  liveLabels: false,

  /** Elements the scene positions itself against. */
  skillEls: [] as (HTMLElement | null)[],
  skillStageEl: null as HTMLElement | null,
  coverEls: [] as (HTMLElement | null)[],
  modalCoverEl: null as HTMLElement | null,

  /** Set by the canvas; renders one frame at the given time in seconds. */
  advance: null as ((time: number) => void) | null,
  /** "pending" until the first frame is drawn or WebGL is ruled out. */
  gl: "pending" as "pending" | "ready" | "unavailable",
};

/**
 * Writes that components make from event handlers and ref callbacks. They are
 * plain functions so component bodies never mutate shared state directly.
 */
export const stage = {
  hoverSkill(index: number) {
    runtime.hoverSkill = index;
  },
  unhoverSkill(index: number) {
    if (runtime.hoverSkill === index) runtime.hoverSkill = -1;
  },
  modalProject(index: number) {
    runtime.modalProject = index;
  },
  skillEl(index: number, el: HTMLElement | null) {
    runtime.skillEls[index] = el;
  },
  skillStageEl(el: HTMLElement | null) {
    runtime.skillStageEl = el;
  },
  coverEl(index: number, el: HTMLElement | null) {
    runtime.coverEls[index] = el;
  },
  modalCoverEl(el: HTMLElement | null) {
    runtime.modalCoverEl = el;
  },
};

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();

/** Minimal event bus for the few one-off signals between components. */
export const bus = {
  on(event: "intro" | "gl", fn: Listener) {
    let set = listeners.get(event);
    if (!set) listeners.set(event, (set = new Set()));
    set.add(fn);
    return () => {
      set.delete(fn);
    };
  },
  emit(event: "intro" | "gl") {
    listeners.get(event)?.forEach((fn) => fn());
  },
};

export const clamp = (v: number, min = 0, max = 1) =>
  v < min ? min : v > max ? max : v;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Frame-rate independent exponential smoothing factor. */
export const damp = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt);

export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
