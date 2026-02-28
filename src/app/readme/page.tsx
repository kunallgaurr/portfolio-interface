"use client";

import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { type: "spring" as const, stiffness: 120, damping: 22 },
};

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[var(--accent-color)]">{children}</span>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold text-[var(--font-color)] mt-8 mb-2">
    {children}
  </h2>
);

const ReadMe = () => {
  return (
    <div className="min-h-screen px-[10%] py-[5%]">
      <div className="flex flex-col gap-6 w-full max-w-2xl leading-relaxed">
        <motion.p {...fadeInUp} className="text-lg">
          Welcome to my little experiment on the internet.
        </motion.p>

        <motion.p {...fadeInUp} className="text-[var(--font-color-faded)]">
          This repository powers my personal corner of the web, a place where ideas get tested,
          systems get stress-tested, and curiosity gets deployed to production. Most of what lives
          here started as a question, a late-night thought, or a &quot;what if I try this?&quot; moment.
        </motion.p>

        <motion.p {...fadeInUp} className="text-[var(--font-color-faded)]">
          If something breaks, that&apos;s part of the research.
        </motion.p>

        <motion.div {...fadeInUp}>
          <SectionTitle>How I like to work</SectionTitle>
          <ul className="flex flex-col gap-3 list-disc pl-5 text-[var(--font-color-faded)]">
            <li>
              <strong className="text-[var(--font-color)]">Move fast, but build it right.</strong>{" "}
              I believe in getting things done efficiently, without cutting corners. If it&apos;s
              worth building, it&apos;s worth building well.
            </li>
            <li>
              <strong className="text-[var(--font-color)]">Work with intention.</strong> I like
              understanding the why behind decisions, trade-offs, constraints, and long-term impact,
              before committing to a direction.
            </li>
            <li>
              <strong className="text-[var(--font-color)]">Own the outcome.</strong> I care about
              how things behave in production, not just how they look in development. Ship, refine,
              improve, repeat.
            </li>
          </ul>
        </motion.div>

        <motion.div {...fadeInUp}>
          <SectionTitle>How I communicate</SectionTitle>
          <ul className="flex flex-col gap-3 list-disc pl-5 text-[var(--font-color-faded)]">
            <li>
              <strong className="text-[var(--font-color)]">Clarity over everything.</strong> I prefer
              precise requirements, defined goals, and clear next steps. Ambiguity slows momentum.
            </li>
            <li>
              <strong className="text-[var(--font-color)]">Direct and honest.</strong> If something
              is unclear, I&apos;ll say so. If I&apos;m confused, I ask questions early rather than assume.
            </li>
            <li>
              <strong className="text-[var(--font-color)]">Decisive collaboration.</strong> I value
              thoughtful discussion, but once a direction is chosen, I prefer committing and moving
              forward.
            </li>
          </ul>
        </motion.div>

        <motion.div {...fadeInUp}>
          <SectionTitle>How I learn</SectionTitle>
          <ul className="flex flex-col gap-3 list-disc pl-5 text-[var(--font-color-faded)]">
            <li>
              <strong className="text-[var(--font-color)]">Learn by doing.</strong> I read docs, but
              I learn by shipping. Breaking things in a sandbox beats theory every time.
            </li>
            <li>
              <strong className="text-[var(--font-color)]">Share what I find.</strong> If I solve a
              tricky problem, I document it. Someone else will hit the same wall.
            </li>
            <li>
              <strong className="text-[var(--font-color)]">Stay curious.</strong> The best ideas often
              come from outside my usual stack. I keep an eye on what&apos;s new without chasing every
              trend.
            </li>
          </ul>
        </motion.div>

        <motion.div {...fadeInUp}>
          <SectionTitle>What I value</SectionTitle>
          <ul className="flex flex-col gap-3 list-disc pl-5 text-[var(--font-color-faded)]">
            <li>
              <strong className="text-[var(--font-color)]">Simplicity.</strong> The best systems are
              easy to reason about. I&apos;d rather have a few well-chosen tools than a kitchen sink.
            </li>
            <li>
              <strong className="text-[var(--font-color)]">Reliability.</strong> Uptime, error handling,
              and graceful degradation matter. Users shouldn&apos;t see our mistakes.
            </li>
            <li>
              <strong className="text-[var(--font-color)]">Iteration.</strong> Perfect is the enemy of
              shipped. I prefer to get something working, then refine.
            </li>
          </ul>
        </motion.div>

        <motion.p {...fadeInUp} className="text-[var(--font-color-faded)] mt-4">
          If any of this resonates, or you want to build something together —{" "}
          <Highlight>let&apos;s talk</Highlight>.
        </motion.p>
      </div>
    </div>
  );
};

export default ReadMe;
