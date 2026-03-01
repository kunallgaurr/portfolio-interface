"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { type: "spring" as const, stiffness: 120, damping: 22 },
};

const Picks = () => {
  const [pivotCount, setPivotCount] = useState(0);
  const [officeReveal, setOfficeReveal] = useState(false);
  const [mountainReveal, setMountainReveal] = useState(false);
  const [f1Reveal, setF1Reveal] = useState(false);
  const [footballReveal, setFootballReveal] = useState(false);
  const [biryaniReveal, setBiryaniReveal] = useState(false);
  const [cafeReveal, setCafeReveal] = useState(false);

  return (
    <div className="min-h-screen lg:px-[10%] px-[10px] lg:py-[5%] py-[10%]">
      <div className="flex flex-col gap-10 w-full max-w-2xl leading-relaxed">
        <motion.header {...fadeInUp} className="flex flex-col gap-1">
          <h1
            className="text-2xl  text-[var(--font-color)] cursor-default select-none"
            onClick={() => setPivotCount((c) => c + 1)}
          >
            Picks & preferences
          </h1>
          <p className="text-sm text-[var(--font-color-faded)]">
            Things I enjoy when I&apos;m not staring at a terminal.
          </p>
          {pivotCount >= 3 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[var(--accent-color)]  text-lg mt-2"
            >
              PIVOT! PIVOT! PIVOT!
            </motion.span>
          )}
        </motion.header>

        <motion.section {...fadeInUp}>
          <h2 className="text-lg  text-[var(--font-color)] mb-3">
            On the screen
          </h2>
          <p className="text-[var(--font-color-faded)]">
            I rewatch <span className="text-[var(--font-color)]">Friends</span> more than I&apos;d
            care to admit; yes, even the one with the couch. <span className="text-[var(--font-color)]">The Office</span> is my
            comfort show; Michael Scott&apos;s cringe is therapeutic.
            <span
              className="cursor-pointer text-[var(--font-color-faded)] hover:text-[var(--accent-color)] transition-colors"
              onClick={() => setOfficeReveal(!officeReveal)}
            >
              {" "}
              That&apos;s what she said.
            </span>
            {officeReveal && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="block mt-2 text-[var(--accent-color)] text-sm"
              >
                — Dwight would approve.
              </motion.span>
            )}
          </p>
          <p className="text-[var(--font-color-faded)] mt-2">
            <span className="text-[var(--font-color)]">F1</span> weekends are sacred. The sound of
            engines, the strategy calls, the last-lap drama, it&apos;s{" "}
            <span
              className="cursor-pointer text-[var(--font-color)] hover:text-[var(--accent-color)] transition-colors"
              onDoubleClick={() => setF1Reveal(!f1Reveal)}
            >
              chess at 300 km/h
            </span>
            .
            {f1Reveal && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="block mt-2 text-[var(--accent-color)] text-sm"
              >
                Box box. Box box.
              </motion.span>
            )}
          </p>
        </motion.section>

        <motion.section {...fadeInUp}>
          <h2 className="text-lg  text-[var(--font-color)] mb-3">
            In the stands
          </h2>
          <p className="text-[var(--font-color-faded)]">
            Big <span className="text-[var(--font-color)]">football</span> fan. Match days are
            non-negotiable. I&apos;ll argue about tactics, curse at the screen, and celebrate like
            we just won the league. The{" "}
            <span
              className="cursor-pointer text-[var(--font-color)] hover:text-[var(--accent-color)] transition-colors"
              onMouseEnter={() => setFootballReveal(true)}
              onMouseLeave={() => setFootballReveal(false)}
            >
              beautiful game
            </span>
            {" "}hits different.
            {footballReveal && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline ml-2 text-[var(--accent-color)] text-sm"
              >
                It&apos;s coming home.
              </motion.span>
            )}
          </p>
        </motion.section>

        <motion.section {...fadeInUp}>
          <h2 className="text-lg  text-[var(--font-color)] mb-3">
            On the plate
          </h2>
          <p className="text-[var(--font-color-faded)]">
            <span className="text-[var(--font-color)]">Mughlai cuisine</span>: biryani, kebabs,
            butter chicken,{" "}
            <span
              className="cursor-pointer text-[var(--font-color)] hover:text-[var(--accent-color)] transition-colors"
              onClick={() => setBiryaniReveal(!biryaniReveal)}
            >
              the works
            </span>
            . If it&apos;s slow-cooked and spiced right, I&apos;m in. Also a
            sucker for a good chai and street food when the mood hits.
            {biryaniReveal && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="block mt-2 text-[var(--accent-color)] text-sm"
              >
                — Extra raita, please.
              </motion.span>
            )}
          </p>
        </motion.section>

        <motion.section {...fadeInUp}>
          <h2 className="text-lg  text-[var(--font-color)] mb-3">
            Live & loud
          </h2>
          <p className="text-[var(--font-color-faded)]">
            I love attending <span className="text-[var(--font-color)]">live standup shows</span>.
            There&apos;s something about a room full of strangers laughing together. If you know a
            good act, send them my way.
          </p>
        </motion.section>

        <motion.section {...fadeInUp}>
          <h2 className="text-lg  text-[var(--font-color)] mb-3">
            Caffeine & peaks
          </h2>
          <p className="text-[var(--font-color-faded)]">
            I enjoy <span className="text-[var(--font-color)]">exploring cafes</span>, the quiet
            ones with good wifi and better coffee. New city? First thing I look up is the{" "}
            <span
              className="cursor-pointer text-[var(--font-color)] hover:text-[var(--accent-color)] transition-colors"
              onMouseEnter={() => setCafeReveal(true)}
              onMouseLeave={() => setCafeReveal(false)}
            >
              specialty roasters
            </span>
            .
            {cafeReveal && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline ml-2 text-[var(--accent-color)] text-sm"
              >
                Flat white, no sugar.
              </motion.span>
            )}
          </p>
          <p className="text-[var(--font-color-faded)] mt-2">
            And <span className="text-[var(--font-color)]">mountains</span>. I like mountains.
            <span
              className="cursor-pointer text-[var(--font-color-faded)] hover:text-[var(--accent-color)] transition-colors inline-block ml-1"
              onMouseEnter={() => setMountainReveal(true)}
              onMouseLeave={() => setMountainReveal(false)}
            >
              ↯
            </span>
            {mountainReveal && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline ml-2 text-[var(--accent-color)] text-sm"
              >
                The mountains are calling.
              </motion.span>
            )}
          </p>
        </motion.section>

        <motion.section {...fadeInUp}>
          <h2 className="text-lg  text-[var(--font-color)] mb-3">
            Suggestions
          </h2>
          <ul className="list-disc pl-5 text-[var(--font-color-faded)] space-y-2">
            <li>Watch a race weekend if you haven&apos;t, start with Monaco or Monza.</li>
            <li>Try a proper biryani from a place that takes hours to make it.</li>
            <li>Book a standup show. Live comedy hits different.</li>
            <li>Find a cafe with a view. Or a mountain with a cafe. Both work.</li>
          </ul>
        </motion.section>
      </div>
    </div>
  );
};

export default Picks;
