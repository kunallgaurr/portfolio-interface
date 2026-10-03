"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

const LABELS: Record<string, string> = { open: "Open", copy: "Copy" };

/**
 * A custom cursor for mouse users: a dot that tracks the pointer exactly and
 * a ring that trails it and changes shape over interactive elements.
 * Elements opt into a state with data-cursor="link | open | node | copy".
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!fine || reduced || !dotEl || !ringEl) return;

    const html = document.documentElement;
    html.classList.add("has-cursor");

    const dotX = gsap.quickTo(dotEl, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dotEl, "y", { duration: 0.12, ease: "power3" });
    const ringX = gsap.quickTo(ringEl, "x", { duration: 0.55, ease: "power3" });
    const ringY = gsap.quickTo(ringEl, "y", { duration: 0.55, ease: "power3" });

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      html.classList.add("cursor-on");
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.<HTMLElement>(
        "[data-cursor], a, button",
      );
      const state = target ? target.dataset.cursor || "link" : "";
      html.dataset.cursorState = state;
      if (label.current) label.current.textContent = LABELS[state] ?? "";
    };
    const down = () => html.classList.add("cursor-down");
    const up = () => html.classList.remove("cursor-down");
    const leave = () => html.classList.remove("cursor-on");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    html.addEventListener("pointerleave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      html.removeEventListener("pointerleave", leave);
      html.classList.remove("has-cursor", "cursor-on", "cursor-down");
      delete html.dataset.cursorState;
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__ring" ref={ring}>
        <span ref={label} />
      </div>
      <div className="cursor__dot" ref={dot} />
    </div>
  );
}
