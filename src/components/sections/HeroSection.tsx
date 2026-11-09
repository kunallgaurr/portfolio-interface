import { basics } from "@/lib/content";

/** Placeholder until the visual design is defined in DESIGN.md. */
export function HeroSection() {
	return (
		<section aria-labelledby="hero-title">
			<h1 id="hero-title">{basics.name}</h1>
			<p>{basics.headline}</p>
		</section>
	);
}
