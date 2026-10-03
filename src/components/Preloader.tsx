"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { content } from "@/content";
import { bus, runtime } from "@/lib/runtime";

/** Shortest and longest time the intro stays up, in milliseconds. */
const MIN_TIME = 1900;
const MAX_TIME = 7000;

/**
 * Covers the page while fonts load and shaders compile, then wipes away and
 * signals the hero to begin.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const count = el.querySelector<HTMLElement>("[data-count]");
    const bar = el.querySelector<HTMLElement>("[data-bar]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minimum = reduced ? 400 : MIN_TIME;

    const start = performance.now();
    let fonts = false;
    let shown = 0;
    document.fonts?.ready.then(() => {
      fonts = true;
    });

    const finish = () => {
      gsap.ticker.remove(tick);
      gsap
        .timeline({
          onComplete: () => {
            el.style.display = "none";
          },
        })
        .to(el.querySelectorAll("[data-pre]"), {
          yPercent: -130,
          autoAlpha: 0,
          duration: reduced ? 0.01 : 0.7,
          ease: "power3.in",
          stagger: 0.06,
        })
        .add(() => bus.emit("intro"), ">-0.1")
        .to(
          el,
          reduced
            ? { autoAlpha: 0, duration: 0.3 }
            : { clipPath: "inset(0% 0% 100% 0%)", duration: 1.15, ease: "expo.inOut" },
          "<",
        );
    };

    const tick = () => {
      const elapsed = performance.now() - start;
      const ready = (runtime.gl !== "pending" && fonts) || elapsed > MAX_TIME;
      // Creep toward 90% while waiting, then run out to 100.
      const target = ready && elapsed > minimum ? 1 : 0.9 * (1 - Math.exp(-elapsed / 800));
      shown += (target - shown) * 0.1;
      if (target === 1 && shown > 0.994) shown = 1;
      if (count) count.textContent = String(Math.round(shown * 100)).padStart(3, "0");
      if (bar) bar.style.transform = `scaleX(${shown.toFixed(4)})`;
      if (shown === 1) finish();
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader__top">
        <span className="mono" data-pre>
          {content.person.firstName} {content.person.lastName}
        </span>
        <span className="mono" data-pre>
          {content.person.role}
        </span>
      </div>
      <div className="preloader__count" data-pre>
        <span data-count>000</span>
      </div>
      <div className="preloader__bottom" data-pre>
        <span className="mono">Preparing scene</span>
        <span className="preloader__bar">
          <i data-bar />
        </span>
      </div>
    </div>
  );
}
