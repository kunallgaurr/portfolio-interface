import { content } from "@/content";
import { SectionLabel } from "./Chrome";

export function About() {
  const { about } = content;
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="about__lead">
        <SectionLabel index="01">{about.label}</SectionLabel>
        <h2 id="about-title" className="about__statement" data-split="lines">
          {about.statement}
        </h2>
      </div>

      <div className="about__grid">
        <div className="about__copy">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph} data-reveal>
              {paragraph}
            </p>
          ))}
        </div>
        <dl className="stats" data-reveal-group>
          {about.stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <dt className="mono">{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
