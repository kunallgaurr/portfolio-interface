"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tv, Trophy, UtensilsCrossed, Music, Coffee, Lightbulb, Verified } from "lucide-react";
import { useToast } from "@/contexts/toast-context";
import {
  markEasterEggFound,
  getRemainingEasterEggCount,
} from "@/utils/easter-eggs";

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { type: "spring" as const, stiffness: 120, damping: 22 },
};

const SectionIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-color-faded)]/40 text-[var(--accent-color)]">
    <Icon size={16} aria-hidden />
  </span>
);

const EASTER_EGG_ID_PICKS = "picks-pivot";

const Picks = () => {
  const toast = useToast();
  const [pivotCount, setPivotCount] = useState(0);
  const [officeReveal, setOfficeReveal] = useState(false);
  const [mountainReveal, setMountainReveal] = useState(false);
  const [f1Reveal, setF1Reveal] = useState(false);
  const [footballReveal, setFootballReveal] = useState(false);
  const [biryaniReveal, setBiryaniReveal] = useState(false);
  const [cafeReveal, setCafeReveal] = useState(false);

  useEffect(() => {
    if (pivotCount < 3) return;
    const newlyFound = markEasterEggFound(EASTER_EGG_ID_PICKS);
    if (!newlyFound) return;
    const remaining = getRemainingEasterEggCount();
    const message =
      remaining === 0
        ? "You found an easter egg! You found them all!"
        : `You found an easter egg! ${remaining} remaining.`;
    toast.showToast(message);
  }, [pivotCount, toast]);

  return (
    <div className="min-h-[calc(100svh-100px)] px-4 sm:px-6 lg:px-[10%] pt-4 sm:pt-6 lg:pt-[5%] pb-24 lg:pb-[5%]">
      <div className="flex flex-col gap-10 w-full max-w-2xl leading-relaxed">
        <motion.header {...fadeInUp} className="mb-4 flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-color-faded)]/40 text-[var(--accent-color)]">
            <Verified size={18} aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--font-color)] cursor-pointer" 
              onClick={() => setPivotCount((c) => c + 1)}
            >
              Picks & preferences
            </h2>
            <p className="text-sm text-[var(--font-color-faded)] mt-2">
              Things I enjoy when I&apos;m not staring at a terminal.
            </p>
            {pivotCount >= 3 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="block mt-2 text-[var(--accent-color)] text-sm"
              >
                PIVOT! PIVOT! PIVOT!
              </motion.span>
            )}
          </div>
        </motion.header>

        <motion.section {...fadeInUp} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <SectionIcon icon={Tv} />
            <h2 className="text-lg font-semibold text-[var(--font-color)]">
              On the screen
            </h2>
          </div>
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

        <motion.section {...fadeInUp} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <SectionIcon icon={Trophy} />
            <h2 className="text-lg font-semibold text-[var(--font-color)]">
              In the stands
            </h2>
          </div>
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

        <motion.section {...fadeInUp} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <SectionIcon icon={UtensilsCrossed} />
            <h2 className="text-lg font-semibold text-[var(--font-color)]">
              On the plate
            </h2>
          </div>
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

        <motion.section {...fadeInUp} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <SectionIcon icon={Music} />
            <h2 className="text-lg font-semibold text-[var(--font-color)]">
              Live & loud
            </h2>
          </div>
          <p className="text-[var(--font-color-faded)]">
            I love attending <span className="text-[var(--font-color)]">live standup shows</span>.
            There&apos;s something about a room full of strangers laughing together. If you know a
            good act, send them my way.
          </p>
        </motion.section>

        <motion.section {...fadeInUp} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <SectionIcon icon={Coffee} />
            <h2 className="text-lg font-semibold text-[var(--font-color)]">
              Caffeine & peaks
            </h2>
          </div>
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

        <motion.section {...fadeInUp} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <SectionIcon icon={Lightbulb} />
            <h2 className="text-lg font-semibold text-[var(--font-color)]">
              Suggestions
            </h2>
          </div>
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
