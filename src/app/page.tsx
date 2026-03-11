"use client";

import Status from "@/components/status";
import TimeCard from "@/components/timecard";
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";

const intro =
    "Hi I am Kunal, I hit random keys, summon microservices, and call it architecture. Somehow it compiles, scales, and survives production. Occasionally, I even pretend it was planned.";

const highlightedWords = new Set(["microservices", "architecture", "production"]);

function normalizeWord(chunk: string) {
    return chunk.replace(/[^\p{L}\p{N}_]+/gu, "").toLowerCase();
}

const wordCount = intro.split(/\s+/).filter(Boolean).length;
const textRevealDuration = 0.08 + (wordCount - 1) * 0.02;

const Home = () => {
    const tokens = React.useMemo(() => intro.split(/(\s+)/), []);
    const [rotation, setRotation] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    const handleFlip = () => {
        if (isFlipping) return;
        setIsFlipping(true);
        setRotation((prev) => (prev === 0 ? 180 : 0));
    };

    return (
        <div className="relative px-4 sm:px-6 lg:px-[10%] pt-4 pb-28 sm:pb-24 lg:py-[5%] lg:pb-[5%] min-h-[calc(100svh-100px)] flex flex-col overflow-hidden">
            {/* Ambient glow */}
            <div
                className="pointer-events-none absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-[0.06] blur-[100px]"
                style={{ background: "var(--accent-color)" }}
                aria-hidden
            />

            <motion.div
                className="relative flex flex-wrap justify-between items-center gap-2 sm:gap-4 shrink-0"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <TimeCard />
                <Status />
            </motion.div>

            <div className="relative flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-start flex-1 min-h-0 mt-8 lg:mt-12 gap-10 lg:gap-16">
                {/* Text block */}
                <div className="order-2 lg:order-1 w-full lg:flex-1 lg:max-w-[54%] flex flex-col items-center lg:items-start">
                    <div className="flex w-full min-w-0 max-w-xl lg:max-w-none text-base sm:text-xl md:text-2xl lg:text-3xl leading-relaxed text-center lg:text-left justify-center lg:justify-start">
                        <motion.span
                            className="text-[var(--font-color-faded)]"
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: {},
                                show: {
                                    transition: {
                                        staggerChildren: 0.02,
                                        delayChildren: 0.08,
                                    },
                                },
                            }}
                        >
                            {tokens.map((token, i) => {
                                if (!token.trim()) {
                                    return (
                                        <span
                                            key={`ws-${i}`}
                                        >
                                            {token}
                                        </span>
                                    );
                                }
                                const normalized = normalizeWord(token);
                                const isHighlighted = highlightedWords.has(normalized);
                                return (
                                    <motion.span
                                        key={`${normalized}-${i}`}
                                        className={isHighlighted ? "text-[var(--font-color)]" : ""}
                                        variants={{
                                            hidden: { opacity: 0 },
                                            show: { opacity: 1 },
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {token}
                                    </motion.span>
                                );
                            })}
                        </motion.span>
                    </div>
                </div>

                {/* Portrait — floating card with gradient ring */}
                <motion.div
                    className="order-1 lg:order-2 relative shrink-0 w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72"
                    style={{ perspective: "1400px" }}
                    initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 180,
                        damping: 22,
                        delay: textRevealDuration * 0.6,
                    }}
                >
                    {/* Gradient ring */}
                    <div
                        className="absolute inset-0 rounded-full p-[3px]"
                        style={{
                            background: "linear-gradient(135deg, var(--accent-color) 0%, transparent 50%, rgba(255,255,255,0.15) 100%)",
                            boxShadow: "0 0 40px -8px var(--accent-color)",
                        }}
                    >
                        <div className="w-full h-full rounded-full bg-[var(--base-background)] p-[10px]">
                            <motion.button
                                type="button"
                                onClick={handleFlip}
                                onAnimationComplete={() => setIsFlipping(false)}
                                animate={{ rotateY: rotation }}
                                transition={{
                                    duration: 1.2,
                                    ease: [0.25, 0.1, 0.25, 1],
                                }}
                                className="relative w-full h-full rounded-full overflow-hidden cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--base-background)]"
                                style={{ transformStyle: "preserve-3d" }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
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
                                        sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
                                        className="object-cover object-[center_38%]"
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
                                        sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
                                        className="object-cover object-[center_38%] scale-x-[-1]"
                                        priority
                                        aria-hidden
                                    />
                                </span>
                            </motion.button>
                        </div>
                    </div>
                    <p className="mt-3 lg:mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-[var(--font-color-faded)]/70">
                        Tap to flip
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
