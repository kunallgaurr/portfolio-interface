"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { content } from "@/content";
import { runtime, stage } from "@/lib/runtime";
import { SectionLabel } from "./Chrome";

const { projects } = content;
const pad = (n: number) => String(n).padStart(2, "0");

/** Everything behind the expanded view: it fades out and stops taking input. */
const setBackgroundInert = (inert: boolean) => {
  document
    .querySelectorAll<HTMLElement>("main > section > :not(dialog), .site-header")
    .forEach((el) => {
      el.inert = inert;
    });
};

/**
 * The project gallery and its expanded view. Each card's cover is an empty
 * frame the WebGL scene draws a panel into; opening a project sends that
 * panel flying to the cover of the dialog.
 */
export function Work() {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closing = useRef(false);
  const [selected, setSelected] = useState(0);
  const project = projects.items[selected];

  const open = (index: number, trigger: HTMLElement) => {
    const el = dialog.current;
    if (!el || el.open) return;
    opener.current = trigger;
    closing.current = false;
    setSelected(index);
    stage.modalProject(index);
    // show() rather than showModal(): the top layer would cover the cursor.
    el.show();
    el.scrollTop = 0;
    setBackgroundInert(true);
    document.documentElement.classList.add("modal-open");
    el.querySelector<HTMLElement>(".dialog__close")?.focus({ preventScroll: true });

    const instant = runtime.reducedMotion;
    gsap.killTweensOf(runtime, "modalBlend");
    gsap.to(runtime, { modalBlend: 1, duration: instant ? 0.01 : 1, ease: "power3.inOut" });
    gsap.fromTo(
      el.querySelectorAll("[data-dialog-item]"),
      { y: 36, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: instant ? 0.01 : 0.9,
        ease: "expo.out",
        stagger: 0.06,
        delay: instant ? 0 : 0.35,
      },
    );
  };

  const close = () => {
    const el = dialog.current;
    if (!el || !el.open || closing.current) return;
    closing.current = true;
    document.documentElement.classList.remove("modal-open");

    const instant = runtime.reducedMotion;
    gsap.to(el.querySelectorAll("[data-dialog-item]"), {
      y: 20,
      autoAlpha: 0,
      duration: instant ? 0.01 : 0.35,
      ease: "power2.in",
    });
    gsap.killTweensOf(runtime, "modalBlend");
    gsap.to(runtime, {
      modalBlend: 0,
      duration: instant ? 0.01 : 0.85,
      ease: "power3.inOut",
      onComplete: () => {
        stage.modalProject(-1);
        closing.current = false;
        el.close();
        setBackgroundInert(false);
        opener.current?.focus({ preventScroll: true });
      },
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <section id="work" className="work" aria-labelledby="work-title">
      <div className="work__stage">
        <div className="work__head">
          <SectionLabel index="03">{projects.label}</SectionLabel>
          <h2 id="work-title" className="work__heading" data-split="lines">
            {projects.heading}
          </h2>
        </div>

        <div className="work__track" data-work-track data-reveal-group>
          {projects.items.map((item, i) => (
            <article className="card" key={item.slug}>
              <button
                type="button"
                className="card__open"
                data-cursor="open"
                aria-label={`Open details for ${item.title}`}
                onClick={(e) => open(i, e.currentTarget)}
              >
                <span
                  className="card__cover"
                  ref={(el) => stage.coverEl(i, el)}
                >
                  <span className={`cover-art cover-art--${i % 4}`} aria-hidden="true" />
                </span>
              </button>
              <div className="card__meta">
                <p className="card__num mono">
                  {pad(i + 1)} <span>/ {item.year}</span>
                </p>
                <div className="card__text">
                  <h3 className="card__title">{item.title}</h3>
                  <p className="card__summary">{item.summary}</p>
                </div>
                <ul className="tags mono" aria-label="Technologies">
                  {item.stack.slice(0, 4).map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <p className="work__count mono" aria-hidden="true">
          <span data-work-count>01</span> / {pad(projects.items.length)}
        </p>
      </div>

      <dialog
        ref={dialog}
        className="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        data-lenis-prevent
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="dialog__inner">
          <button
            type="button"
            className="dialog__close mono"
            onClick={close}
            data-magnetic
          >
            Close
          </button>

          <div
            className="dialog__cover"
            ref={(el) => stage.modalCoverEl(el)}
          >
            <span className={`cover-art cover-art--${selected % 4}`} aria-hidden="true" />
          </div>

          <div className="dialog__body">
            <div className="dialog__title">
              <p className="mono" data-dialog-item>
                {pad(selected + 1)} · {project.year} · {project.role}
              </p>
              <h2 id="dialog-title" data-dialog-item>
                {project.title}
              </h2>
            </div>

            <div className="dialog__copy">
              {project.description.map((paragraph) => (
                <p key={paragraph} data-dialog-item>
                  {paragraph}
                </p>
              ))}
              <ul className="tags mono" aria-label="Technologies" data-dialog-item>
                {project.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
              {project.links.length > 0 && (
                <p className="dialog__links" data-dialog-item>
                  {project.links.map((link) => (
                    <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  ))}
                </p>
              )}
            </div>

            <dl className="dialog__stats">
              {project.highlights.map((item) => (
                <div key={item.label} data-dialog-item>
                  <dt className="mono">{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </dialog>
    </section>
  );
}
