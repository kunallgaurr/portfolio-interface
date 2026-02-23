"use client";

import React from "react";
import { motion } from "framer-motion";

const AboutContent = () => {
  return (
    <motion.section
      className="flex flex-col gap-6 w-[60%] leading-relaxed"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-[var(--font-color-faded)]">
          So, who’s this Kunal guy?
        </h2>
        <p className="text-sm text-[var(--font-color-faded)] mt-2">
          Fun fact: He once opened a terminal “just to try something” and never really closed it.
        </p>
      </header>

      <p>
        My name is Kunal, and I’m a software engineer.
      </p>

      <p>
        This is my digital workshop, part lab, part notebook, part slightly organized chaos.
      </p>

      <p>
        I built this space primarily to learn in public. To experiment. To ship. To break things safely.
        To document what worked (and what didn’t). Most of what you see here started as a question
        I couldn’t ignore or a problem I wanted to understand more deeply.
      </p>

      <p>
        I’m endlessly curious about systems, how they scale, how they fail,
        and how they can be made just a little more elegant.
        I enjoy turning rough ideas into structured architectures
        and watching something simple evolve into something resilient.
      </p>

      <p>
        If something here helps you, sparks an idea, or even mildly amuses you,
        that’s a win in my book.
      </p>

      <p>
        And if you ever want to exchange ideas, share feedback,
        or just talk about building things on the internet —
        I’m always open to thoughtful conversations.
      </p>
    </motion.section>
  );
};

export default AboutContent;
