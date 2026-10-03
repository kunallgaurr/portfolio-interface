"use client";

import { useState } from "react";
import { content } from "@/content";
import { stage } from "@/lib/runtime";
import { SectionLabel } from "./Chrome";

const { skills } = content;

// Flat list in the same order the scene lays out its nodes.
const flat = skills.groups.flatMap((group) =>
  group.skills.map((skill) => ({ ...skill, group: group.title })),
);
// Index of each group's first skill within that flat list.
const offsets = skills.groups.map((_, g) =>
  skills.groups.slice(0, g).reduce((sum, group) => sum + group.skills.length, 0),
);

/**
 * Skill names are ordinary list items. Once the scene is running, each one is
 * pinned to its node in the orbiting constellation; without WebGL, or on small
 * screens, they stay a plain grouped list.
 */
export function Skills() {
  const [active, setActive] = useState(-1);
  const current = active >= 0 ? flat[active] : null;

  const focus = (index: number) => {
    stage.hoverSkill(index);
    setActive(index);
  };
  const blur = (index: number) => {
    stage.unhoverSkill(index);
    setActive((value) => (value === index ? -1 : value));
  };

  return (
    <section id="skills" className="skills" aria-labelledby="skills-title">
      <div
        className="skills__stage"
        ref={(el) => stage.skillStageEl(el)}
      >
        <div className="skills__head">
          <SectionLabel index="02">{skills.label}</SectionLabel>
          <h2 id="skills-title" className="skills__heading" data-split="lines">
            {skills.heading}
          </h2>
        </div>

        <div className="skills__groups">
          {skills.groups.map((group, g) => (
            <div className="skill-group" key={group.title}>
              <h3 className="mono">{group.title}</h3>
              <ul>
                {group.skills.map((skill, s) => {
                  const i = offsets[g] + s;
                  return (
                    <li
                      key={skill.name}
                      className={`skill${active === i ? " is-active" : ""}`}
                      ref={(el) => stage.skillEl(i, el)}
                    >
                      <button
                        type="button"
                        data-cursor="node"
                        onPointerEnter={() => focus(i)}
                        onPointerLeave={() => blur(i)}
                        onFocus={() => focus(i)}
                        onBlur={() => blur(i)}
                      >
                        {skill.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="skills__detail" aria-live="polite">
          {current ? (
            <>
              <p className="mono skills__detail-meta">
                {current.group} · {current.level}
              </p>
              <p className="skills__detail-name">{current.name}</p>
              <p className="skills__detail-note">{current.note}</p>
            </>
          ) : (
            <p className="mono skills__detail-meta">{skills.hint}</p>
          )}
        </div>
      </div>
    </section>
  );
}
