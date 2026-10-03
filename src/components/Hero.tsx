import { content } from "@/content";

export function Hero() {
  const { person } = content;
  return (
    <section id="hero" className="hero" aria-label="Introduction">
      <p className="hero__eyebrow mono" data-hero-fade>
        <span>Portfolio</span>
        <span>{person.location}</span>
      </p>

      <h1 className="hero__name" data-fit aria-label={`${person.firstName} ${person.lastName}`}>
        <span className="hero__line" aria-hidden="true">
          {person.firstName}
        </span>
        <span className="hero__line hero__line--second" aria-hidden="true">
          {person.lastName}
        </span>
      </h1>

      <div className="hero__intro">
        <p className="hero__role mono" data-hero-fade>
          {person.role}
        </p>
        <p className="hero__tagline" data-hero-fade>
          {person.tagline}
        </p>
      </div>

      <div className="hero__foot mono">
        <span className="status" data-hero-fade>
          <i className="status__dot" />
          {person.availability}
        </span>
        <a className="scroll-hint" href="#about" data-hero-fade>
          Scroll
          <i className="scroll-hint__line" />
        </a>
      </div>
    </section>
  );
}
