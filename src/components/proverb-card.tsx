"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const ProverbCard = () => {
  const [index, setIndex] = useState(0);
  const [proverb, setProverb] = useState<ComponentTypes.Proverb[]>([]);
  const [loading, setLoading] = useState(true);

  const current = proverb[index];
  const hasProverbs = proverb.length > 0;

  function changeIndex() {
    if (loading || !hasProverbs) return;
    setIndex((prev) => (prev + 1) % proverb.length);
  }

  useEffect(() => {
    let cancelled = false;
    async function fetchProverb() {
      try {
        setLoading(true);
        const { data } = await httpAdapter.getProverb();
        if (!cancelled) setProverb(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!cancelled) console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProverb();
    return () => { cancelled = true; };
  }, []);

  const cardClassName =
    "flex flex-col h-[200px] p-8 bg-[var(--card-background)] rounded-[10px] gap-2 cursor-pointer border border-transparent hover:border-white/5 transition-colors";

  if (loading) {
    return (
      <div className={cardClassName}>
        <div className="h-3 w-28 rounded bg-[#85858555] animate-pulse shrink-0" />
        <div className="space-y-1.5 flex-1 min-h-0">
          <div className="h-4 w-full rounded bg-[#85858555] animate-pulse" />
          <div className="h-4 w-[90%] rounded bg-[#85858555] animate-pulse" />
        </div>
        <div className="h-3 w-20 rounded bg-[#85858555] animate-pulse shrink-0" />
      </div>
    );
  }

  if (!hasProverbs) return null;

  return (
    <motion.div
      onClick={changeIndex}
      className={cardClassName}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 22 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <span className="font-semibold tracking-widest text-[var(--font-color-faded)] uppercase shrink-0">
        Proverb of the day
      </span>
      <blockquote className="text-[var(--font-color)] leading-relaxed min-h-0 flex-1 overflow-hidden line-clamp-4">
        &ldquo;{current?.quote ?? ""}&rdquo;
      </blockquote>
      <div className="flex items-center justify-between gap-2 shrink-0">
        {current?.author ? (
          <cite className="not-italic text-[var(--font-color-faded)]">
            — {current.author}
          </cite>
        ) : (
          <span />
        )}
        <span className="text-xs text-[var(--font-color-faded)]">
          Click for next
        </span>
      </div>
    </motion.div>
  );
};

export default ProverbCard;
