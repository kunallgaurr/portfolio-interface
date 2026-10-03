"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { useEffect } from "react";
import { content } from "@/content";
import { SECTION_IDS, bus, clamp, damp, lerp, runtime } from "@/lib/runtime";

const SECTION_NAMES = ["Intro", ...content.nav.map((item) => item.label)];

/**
 * The page's single clock. Each frame it advances smooth scrolling, measures
 * where the sections are, moves the horizontal gallery, updates the HUD and
 * then asks the WebGL scene to render, in that order, so DOM and canvas agree.
 * It also wires up the scroll-triggered text reveals.
 */
export function SiteRuntime() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const html = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)");
    const desktop = window.matchMedia("(min-width: 900px)");
    runtime.reducedMotion = reduced;
    runtime.coarsePointer = coarse.matches;

    // Always open on the hero; the intro hands off into it.
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const lenis = reduced ? null : new Lenis({ autoRaf: false, anchors: true, lerp: 0.085 });
    lenis?.on("scroll", ScrollTrigger.update);
    if (runtime.intro === 0) lenis?.stop();

    const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector);
    const sections = SECTION_IDS.map((id) => document.getElementById(id));
    const workSection = sections[3];
    const track = $("[data-work-track]");
    const workCount = $("[data-work-count]");
    const bar = $("[data-progress]");
    const sectionIndex = $("[data-section-index]");
    const sectionName = $("[data-section-name]");
    const rail = $("[data-rail]");
    const navLinks = Array.from(document.querySelectorAll<HTMLElement>("[data-nav]"));

    // Display headings are set in viewport units; if the copy changes and a
    // line no longer fits, scale that heading down until it does.
    const fit = () => {
      const range = document.createRange();
      document.querySelectorAll<HTMLElement>("[data-fit]").forEach((el) => {
        el.style.fontSize = "";
        const available = el.clientWidth;
        let widest = 0;
        // A range measures the text itself, even inside a clipping mask.
        for (const line of Array.from(el.children)) {
          range.selectNodeContents(line);
          widest = Math.max(widest, range.getBoundingClientRect().width);
        }
        if (available > 0 && widest > available) {
          const size = parseFloat(getComputedStyle(el).fontSize);
          el.style.fontSize = `${Math.floor((size * available * 0.985) / widest)}px`;
        }
      });
    };

    let workDistance = 0;
    const layout = () => {
      fit();
      const ready = runtime.gl === "ready";
      runtime.coarsePointer = coarse.matches;
      runtime.planes = ready && desktop.matches && !coarse.matches;
      const live = ready && desktop.matches && window.innerHeight >= 560;
      if (runtime.liveLabels && !live) {
        runtime.skillEls.forEach((el) => el?.removeAttribute("style"));
      }
      runtime.liveLabels = live;
      html.dataset.planes = runtime.planes ? "on" : "off";
      html.dataset.labels = live ? "live" : "static";

      // The gallery scrolls sideways on desktop: make the section as tall as
      // the track is wide so vertical scroll maps onto it.
      if (workSection && track) {
        if (desktop.matches) {
          workDistance = Math.max(0, track.scrollWidth - window.innerWidth);
          workSection.style.height = `${window.innerHeight + workDistance}px`;
        } else {
          workDistance = 0;
          workSection.style.height = "";
          track.style.transform = "";
        }
      }
      ScrollTrigger.refresh();
    };

    let lastScroll = window.scrollY;
    let lastIndex = -1;
    let lastCount = -1;
    const tick = (time: number, deltaMs: number) => {
      lenis?.raf(time * 1000);

      const vh = window.innerHeight;
      const dt = Math.max(deltaMs / 1000, 1 / 240);
      let scene = 0;
      let workTop = 0;
      for (let i = 0; i < sections.length; i++) {
        const el = sections[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        runtime.progress[i] = clamp((vh * 0.5 - rect.top) / rect.height);
        // A section takes over as its top edge rises through the viewport.
        if (i > 0) scene += clamp((vh * 0.9 - rect.top) / (vh * 0.8));
        if (i === 3) workTop = rect.top;
      }
      runtime.scene = scene;

      if (track && workDistance > 0) {
        const p = clamp(-workTop / workDistance);
        runtime.workProgress = p;
        track.style.transform = `translate3d(${(-p * workDistance).toFixed(2)}px, 0, 0)`;
        const count = Math.min(
          content.projects.items.length,
          Math.floor(p * content.projects.items.length) + 1,
        );
        if (workCount && count !== lastCount) {
          lastCount = count;
          workCount.textContent = String(count).padStart(2, "0");
        }
      } else {
        runtime.workProgress = runtime.progress[3];
      }

      const y = window.scrollY;
      const velocity = (y - lastScroll) / vh / dt;
      lastScroll = y;
      runtime.scrollVelocity = lerp(runtime.scrollVelocity, velocity, damp(8, dt));

      const max = html.scrollHeight - vh;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? clamp(y / max).toFixed(4) : 0})`;
      rail?.style.setProperty("--progress", runtime.progress[4].toFixed(4));

      const index = clamp(Math.round(scene), 0, SECTION_IDS.length - 1);
      if (index !== lastIndex) {
        lastIndex = index;
        if (sectionIndex) sectionIndex.textContent = String(index + 1).padStart(2, "0");
        if (sectionName) sectionName.textContent = SECTION_NAMES[index] ?? "";
        navLinks.forEach((link, i) => {
          if (i + 1 === index) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      }

      // Nothing is drawn while the tab is in the background.
      if (!document.hidden) runtime.advance?.(time);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onPointer = (e: PointerEvent) => {
      runtime.pointer.x = e.clientX;
      runtime.pointer.y = e.clientY;
      runtime.pointer.active = true;
    };
    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      runtime.pointer.x = touch.clientX;
      runtime.pointer.y = touch.clientY;
      runtime.pointer.active = true;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(layout, 120);
    };
    window.addEventListener("resize", onResize);
    const offGl = bus.on("gl", layout);
    layout();

    /* ------------------------------------------------------------ motion */

    let heroTimeline: gsap.core.Timeline | null = null;
    const ctx = gsap.context(() => {
      if (reduced) return;

      gsap.utils.toArray<HTMLElement>('[data-split="lines"]').forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 112,
              duration: 1.25,
              ease: "expo.out",
              stagger: 0.085,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }),
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 34,
          autoAlpha: 0,
          duration: 1.15,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        gsap.from(group.children, {
          y: 44,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: "top 86%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-job]").forEach((job) => {
        ScrollTrigger.create({
          trigger: job,
          start: "top 62%",
          end: "bottom 38%",
          toggleClass: "is-active",
        });
      });

      // The hero plays when the preloader hands off, not on scroll.
      const name = SplitText.create(".hero__line", { type: "chars", aria: "none" });
      heroTimeline = gsap
        .timeline({ paused: true })
        .fromTo(
          name.chars,
          { yPercent: 118 },
          { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.045 },
          0,
        )
        .fromTo(
          "[data-hero-fade]",
          { y: 22, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.3, ease: "expo.out", stagger: 0.09 },
          0.55,
        );

      // Buttons lean toward the pointer.
      if (!coarse.matches) {
        gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            gsap.to(el, {
              x: (e.clientX - r.left - r.width / 2) * 0.32,
              y: (e.clientY - r.top - r.height / 2) * 0.32,
              duration: 0.5,
              ease: "power3.out",
            });
          };
          const leave = () =>
            gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.4)" });
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
        });
      }
    });

    const startIntro = () => {
      html.classList.remove("is-loading");
      lenis?.start();
      gsap.to(runtime, { intro: 1, duration: reduced ? 0.4 : 3.4, ease: "power2.out" });
      heroTimeline?.play();
      ScrollTrigger.refresh();
    };
    const offIntro = bus.on("intro", startIntro);

    // Line breaks move once web fonts arrive.
    document.fonts?.ready.then(layout);

    return () => {
      offIntro();
      offGl();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("touchmove", onTouch);
      gsap.ticker.remove(tick);
      ctx.revert();
      lenis?.destroy();
    };
  }, []);

  return null;
}
