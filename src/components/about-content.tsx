"use client";

import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { type: "spring" as const, stiffness: 120, damping: 22 },
};

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[var(--accent-color)]">{children}</span>
);

const AboutContent = () => {
  return (
    <section className="flex flex-col gap-6 w-[60%] leading-relaxed">
      <motion.header
        className="mb-4 pl-4 border-l-2 border-[var(--accent-color-faded)]"
        {...fadeInUp}
      >
        <h2 className="text-xl font-semibold text-[var(--font-color-faded)]">
          So, who&apos;s this Kunal guy?
        </h2>
        <p className="text-sm text-[var(--font-color-faded)] mt-2">
          Fun fact: He once opened a terminal &quot;just to try something&quot; and never really closed it.
        </p>
      </motion.header>

      <motion.p {...fadeInUp}>
        My name is Kunal, and I&apos;m a <Highlight>software engineer</Highlight>.
      </motion.p>

      <motion.p {...fadeInUp}>
        This is my <Highlight>digital workshop</Highlight>, part lab, part notebook, part slightly organized chaos.
      </motion.p>

      <motion.p {...fadeInUp}>
        I built this space primarily to <Highlight>learn in public</Highlight>. To experiment. To ship. To break things safely.
        To document what worked (and what didn&apos;t). Most of what you see here started as a question
        I couldn&apos;t ignore or a problem I wanted to understand more deeply.
      </motion.p>

      <motion.p {...fadeInUp}>
        I&apos;m endlessly curious about systems, how they scale, how they fail,
        and how they can be made just a little more elegant.
        I enjoy turning rough ideas into structured architectures
        and watching something simple evolve into something resilient.
      </motion.p>

      <motion.p {...fadeInUp}>
        If something here helps you, sparks an idea, or even mildly amuses you,
        that&apos;s a win in my book.
      </motion.p>

      <motion.p {...fadeInUp}>
        And if you ever want to exchange ideas, share feedback,
        or just talk about building things on the internet —
        I&apos;m always open to <Highlight>thoughtful conversations</Highlight>.
      </motion.p>
    </section>
  );
};

export default AboutContent;
