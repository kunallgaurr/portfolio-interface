/**
 * Shared motion values for Motion (transitions) and Anime.js (animations).
 *
 * Placeholder values until DESIGN.md defines the motion system. Keep these in
 * sync with the motion tokens in `src/app/globals.css`.
 */
export const motionTokens = {
	duration: {
		fast: 200,
		base: 500,
		slow: 900,
	},
	ease: {
		out: "outExpo",
		inOut: "inOutQuad",
	},
	distance: {
		sm: 8,
		md: 24,
		lg: 64,
	},
	stagger: {
		tight: 20,
		base: 80,
	},
} as const;

/** Motion uses seconds and cubic-bezier arrays rather than Anime.js names. */
export const transitionTokens = {
	duration: {
		fast: motionTokens.duration.fast / 1000,
		base: motionTokens.duration.base / 1000,
		slow: motionTokens.duration.slow / 1000,
	},
	ease: {
		out: [0.16, 1, 0.3, 1],
		inOut: [0.45, 0, 0.55, 1],
	},
} as const;
