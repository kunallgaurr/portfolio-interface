"use client";

import Status from "@/components/status";
import TimeCard from "@/components/timecard";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

const highlightedWords = new Set(["microservices", "architecture", "production"]);

function normalizeWord(chunk: string) {
    return chunk.replace(/[^\p{L}\p{N}_]+/gu, "").toLowerCase();
}

function getTimeGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning.";
    if (h < 17) return "Good afternoon.";
    return "Good evening.";
}

const HomeHero = () => {
    const greeting = useMemo(getTimeGreeting, []);
    const intro =
        "I hit random keys, summon microservices, and call it architecture. Somehow it compiles, scales, and survives production. Occasionally, I even pretend it was planned.";

    const tokens = useMemo(() => intro.split(/(\s+)/), [intro]);

    const [rotation, setRotation] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [showCursor, setShowCursor] = useState(true);
    const [hoveredWord, setHoveredWord] = useState<string | null>(null);

    useEffect(() => {
        const t = setTimeout(() => setShowCursor(false), 4800);
        return () => clearTimeout(t);
    }, []);

    const handleFlip = () => {
        if (isFlipping) return;
        setIsFlipping(true);
        setRotation((prev) => (prev === 0 ? 180 : 0));
    };

    const scrollToContent = () => {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    };

    return (
        <div className="relative min-h-[90svh] px-4 sm:px-6 lg:px-[10%] pt-4 pb-20 lg:py-[5%] flex flex-col overflow-hidden">
            {/* Background: subtle grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
                    `,
                    backgroundSize: "48px 48px",
                }}
                aria-hidden
            />
            {/* Ambient glows */}
            <div
                className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.07] blur-[120px]"
                style={{ background: "var(--accent-color)" }}
                aria-hidden
            />
            <div
                className="pointer-events-none absolute top-1/2 -left-24 w-64 h-64 rounded-full opacity-[0.04] blur-[80px]"
                style={{ background: "var(--accent-color)" }}
                aria-hidden
            />

            {/* Top bar */}
            <motion.div
                className="relative flex flex-wrap justify-between items-center gap-2 sm:gap-4 shrink-0 z-10"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
            >
                <TimeCard />
                <Status />
            </motion.div>

            {/* Main hero */}
            <div className="relative flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-between flex-1 min-h-0 mt-6 sm:mt-10 lg:mt-12 gap-8 lg:gap-12 z-10">
                {/* Left: copy */}
                <div className="order-2 lg:order-1 w-full lg:flex-1 lg:max-w-[52%] flex flex-col items-center lg:items-start text-center lg:text-left">
                    <motion.p
                        className="text-sm sm:text-base uppercase tracking-[0.2em] text-[var(--accent-color)] font-medium mb-2 lg:mb-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                    >
                        {greeting}
                    </motion.p>
                    <motion.p
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[var(--font-color)] mb-4 lg:mb-5 tracking-tight"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        I&apos;m Kunal.
                    </motion.p>
                    <div className="flex w-full min-w-0 max-w-xl lg:max-w-none text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
                        <motion.span
                            className="text-[var(--font-color-faded)]"
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: {},
                                show: {
                                    transition: {
                                        staggerChildren: 0.018,
                                        delayChildren: 0.25,
                                    },
                                },
                            }}
                        >
                            {tokens.map((token, i) => {
                                if (!token.trim()) {
                                    return <span key={`ws-${i}`}>{token}</span>;
                                }
                                const normalized = normalizeWord(token);
                                const isHighlighted = highlightedWords.has(normalized);
                                return (
                                    <motion.span
                                        key={`${normalized}-${i}`}
                                        className={`inline-block relative ${isHighlighted ? "text-[var(--font-color)]" : ""}`}
                                        variants={{
                                            hidden: { opacity: 0, y: 6 },
                                            show: {
                                                opacity: 1,
                                                y: 0,
                                                transition: { type: "spring", stiffness: 200, damping: 22 },
                                            },
                                        }}
                                        onMouseEnter={() => isHighlighted && setHoveredWord(normalized)}
                                        onMouseLeave={() => setHoveredWord(null)}
                                    >
                                        {isHighlighted ? (
                                            <span
                                                className={`inline-block cursor-default transition-transform duration-200 ${
                                                    hoveredWord === normalized ? "scale-105" : ""
                                                }`}
                                            >
                                                <span className="relative">
                                                    {token}
                                                    <motion.span
                                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent-color)] origin-left"
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: hoveredWord === normalized ? 1 : 0 }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                    />
                                                </span>
                                            </span>
                                        ) : (
                                            token
                                        )}
                                    </motion.span>
                                );
                            })}
                            <AnimatePresence>
                                {showCursor && (
                                    <motion.span
                                        key="cursor"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="inline-block w-[2px] h-[0.85em] ml-0.5 align-middle bg-[var(--accent-color)] rounded-sm animate-[cursor-blink_1s_step-end_infinite]"
                                        aria-hidden
                                    />
                                )}
                            </AnimatePresence>
                        </motion.span>
                    </div>
                    <motion.div
                        className="mt-6 lg:mt-8 flex flex-wrap items-center gap-3 justify-center lg:justify-start"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                    >
                        <Link
                            href="/about"
                            className="group inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-[var(--font-color)] hover:border-[var(--accent-color-faded)] hover:bg-[var(--accent-color-faded)]/20 transition-colors"
                        >
                            <Sparkles size={16} className="text-[var(--accent-color)]" />
                            Explore my work
                        </Link>
                        <button
                            type="button"
                            onClick={scrollToContent}
                            className="inline-flex items-center gap-1.5 text-xs text-[var(--font-color-faded)] hover:text-[var(--font-color)] transition-colors"
                        >
                            Scroll
                            <ChevronDown size={14} className="animate-bounce" style={{ animationDuration: "2s" }} />
                        </button>
                    </motion.div>
                </div>

                {/* Right: portrait */}
                <motion.div
                    className="order-1 lg:order-2 relative shrink-0 w-44 h-44 sm:w-52 sm:h-52 lg:w-64 lg:h-64"
                    style={{ perspective: "1400px" }}
                    initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 160,
                        damping: 22,
                        delay: 0.35,
                    }}
                >
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <div
                            className="absolute inset-0 rounded-full p-[3px] transition-shadow duration-300"
                            style={{
                                background: "linear-gradient(135deg, var(--accent-color) 0%, transparent 45%, rgba(255,255,255,0.12) 100%)",
                                boxShadow: "0 0 50px -12px var(--accent-color)",
                            }}
                        >
                            <div className="w-full h-full rounded-full bg-[var(--base-background)] p-2">
                                <motion.button
                                    type="button"
                                    onClick={handleFlip}
                                    onAnimationComplete={() => setIsFlipping(false)}
                                    animate={{ rotateY: rotation }}
                                    transition={{
                                        duration: 1.1,
                                        ease: [0.25, 0.1, 0.25, 1],
                                    }}
                                    className="relative w-full h-full rounded-full overflow-hidden cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--base-background)] group/btn"
                                    style={{ transformStyle: "preserve-3d" }}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    aria-label="Flip portrait"
                                >
                                    <span
                                        className="absolute inset-0 rounded-full overflow-hidden"
                                        style={{ backfaceVisibility: "hidden" }}
                                    >
                                        <Image
                                            src="/my-image.png"
                                            alt="Portrait of Kunal Gaur"
                                            fill
                                            sizes="(max-width: 640px) 176px, (max-width: 1024px) 208px, 256px"
                                            className="object-cover object-[center_38%] transition-transform duration-500 group-hover/btn:scale-105"
                                            priority
                                        />
                                    </span>
                                    <span
                                        className="absolute inset-0 rounded-full overflow-hidden"
                                        style={{
                                            backfaceVisibility: "hidden",
                                            transform: "rotateY(180deg)",
                                        }}
                                    >
                                        <Image
                                            src="/my-image.png"
                                            alt=""
                                            fill
                                            sizes="(max-width: 640px) 176px, (max-width: 1024px) 208px, 256px"
                                            className="object-cover object-[center_38%] scale-x-[-1]"
                                            priority
                                            aria-hidden
                                        />
                                    </span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                    <motion.p
                        className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-[var(--font-color-faded)]/80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        Tap to flip
                    </motion.p>
                </motion.div>
            </div>

            {/* Bottom spacer for scroll cue */}
            <div className="h-16 shrink-0" aria-hidden />
        </div>
    );
};

export default HomeHero;
