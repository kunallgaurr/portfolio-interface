import { content } from "@/content";
import { SectionLabel } from "./Chrome";

export function Timeline() {
  const { experience } = content;
  return (
    <section id="experience" className="timeline" aria-labelledby="experience-title">
      <div className="timeline__head">
        <SectionLabel index="04">{experience.label}</SectionLabel>
        <h2 id="experience-title" className="timeline__heading" data-split="lines">
          {experience.heading}
        </h2>
      </div>

      <ol className="timeline__list" data-rail>
        {experience.jobs.map((job) => (
          <li className="job" key={`${job.company}-${job.period}`} data-job>
            <p className="job__period mono">
              <span>{job.period}</span>
              <span>{job.location}</span>
            </p>
            <h3 className="job__role">{job.role}</h3>
            <p className="job__company">{job.company}</p>
            <p className="job__summary">{job.summary}</p>
            {job.points.length > 0 && (
              <ul className="job__points">
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
