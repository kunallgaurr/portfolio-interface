---
name: animejs
description: Write Anime.js v4 animations in this Next.js project. Use whenever creating or editing an animation (timelines, multi-step sequences, staggers, SVG or path drawing, text effects, scroll-driven or looping motion). Not for transitions (enter/exit, route, layout, hover, tap, state), which use Motion.
---

# Anime.js animations

This project uses **Anime.js v4** (`animejs` package). v4 rewrote the API, so most examples online and in training data (v3) are wrong here. If something below does not match the installed version, check the types in `node_modules/animejs/dist/modules/` before writing code.

## v3 → v4: do not write the old API

| v3 (wrong)                          | v4 (correct)                                  |
| ----------------------------------- | --------------------------------------------- |
| `import anime from 'animejs'`       | `import { animate } from 'animejs'`           |
| `anime({ targets: el, ... })`       | `animate(el, { ... })`                        |
| `anime.timeline({ ... })`           | `createTimeline({ ... })`                     |
| `tl.add({ targets: el, ... }, pos)` | `tl.add(el, { ... }, pos)`                    |
| `anime.stagger(100)`                | `stagger(100)`                                |
| `easing: 'easeOutExpo'`             | `ease: 'outExpo'`                             |
| `direction: 'alternate'`            | `alternate: true`                             |
| `anime.setDashoffset`               | `svg.createDrawable(el)` + animate `draw`     |
| `anime.remove(el)`                  | `scope.revert()` (or `animation.revert()`)    |

Everything is a named import from `animejs`: `animate`, `createTimeline`, `createScope`, `stagger`, `splitText`, `onScroll`, `svg`, `utils`, `eases`.

## Rules

1. **Client components only.** The file starts with `"use client"`. Keep it small: an animated wrapper or element, never a whole section. The section stays a server component and renders this one.
2. **Always use a scope.** Create every animation inside `createScope({ root })` in a `useEffect`, and call `scope.revert()` in the cleanup. This limits selectors to the component, and undoes all animations, split text and scroll observers on unmount. It also makes React Strict Mode's double effect run safely.
3. **Target through the scope root.** Use a `ref` as the scope `root` and select children with selectors inside it. Do not query `document`.
4. **Respect reduced motion.** Register a `reduceMotion` media query on the scope and branch on `self.matches.reduceMotion`. When it is true, jump to the final state (or play a simple opacity fade). No movement, scaling or looping.
5. **No hard-coded timing.** Take durations, delays and eases from the shared motion values in `src/lib/motion.ts`, which mirror the motion tokens in the design system. If a value is missing, add it there (and to the `@theme` tokens) first.
6. **Style only through classes.** Elements get their look from design-system classes. Anime.js only animates movement-related properties (`opacity`, `translate*`, `scale`, `rotate`, SVG `draw`, etc.), not colors or sizes that the design system owns.
7. **Follow the project code style:** tabs, max 80 columns, named export, PascalCase file in the right `src/components/` category.

## Template

```tsx
"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, createScope, stagger } from "animejs";
import { motionTokens } from "@/lib/motion";

type FadeUpListProps = {
	children: ReactNode;
};

export function FadeUpList({ children }: FadeUpListProps) {
	const root = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const scope = createScope({
			root,
			mediaQueries: {
				reduceMotion: "(prefers-reduced-motion: reduce)",
			},
		}).add((self) => {
			const reduceMotion = self?.matches.reduceMotion;

			if (reduceMotion) {
				animate("[data-animate]", {
					opacity: [0, 1],
					duration: motionTokens.duration.fast,
				});
				return;
			}

			animate("[data-animate]", {
				opacity: [0, 1],
				translateY: [motionTokens.distance.md, 0],
				duration: motionTokens.duration.base,
				ease: motionTokens.ease.out,
				delay: stagger(motionTokens.stagger.base),
			});
		});

		return () => scope.revert();
	}, []);

	return <div ref={root}>{children}</div>;
}
```

Children opt in with a `data-animate` attribute, so the component stays reusable and selectors stay inside the scope.

## Common patterns

**Timeline**: sequence steps with positions (`'+=100'`, `'-=200'`, `'<'` for "with the previous step"):

```ts
createTimeline({ defaults: { ease: motionTokens.ease.out } })
	.add(".title", { opacity: [0, 1] })
	.add(".subtitle", { opacity: [0, 1] }, "-=200")
	.add(".cta", { scale: [0.9, 1] }, "<");
```

**Text effects**: split, then animate the pieces. The scope reverts the split on unmount.

```ts
const { chars } = splitText(".headline", { chars: true });
animate(chars, {
	opacity: [0, 1],
	delay: stagger(motionTokens.stagger.tight),
});
```

**SVG line drawing**:

```ts
animate(svg.createDrawable(".path"), {
	draw: ["0 0", "0 1"],
	duration: motionTokens.duration.slow,
});
```

**Scroll-triggered**: pass an observer as `autoplay`:

```ts
animate(".card", {
	opacity: [0, 1],
	autoplay: onScroll({ target: ".card", enter: "bottom top" }),
});
```

## Checklist before finishing

- [ ] `"use client"` and the component is small.
- [ ] All animations are created inside `createScope(...).add(...)` in `useEffect`.
- [ ] Cleanup returns `scope.revert()`.
- [ ] Reduced motion is handled.
- [ ] No hard-coded durations, delays or eases.
- [ ] No v3 API (`anime(...)`, `targets:`, `easing:`, `anime.timeline`).
