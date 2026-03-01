"use client";

import Status from "@/components/status";
import TimeCard from "@/components/timecard";
import React from "react";
import { motion } from "framer-motion";

const intro =
    "Hi I am Kunal, I hit random keys, summon microservices, and call it architecture. Somehow it compiles, scales, and survives production. Occasionally, I even pretend it was planned.";

const highlightedWords = new Set(["microservices", "architecture", "production"]);

function normalizeWord(chunk: string) {
    return chunk.replace(/[^\p{L}\p{N}_]+/gu, "").toLowerCase();
}

const Home = () => {
    const tokens = React.useMemo(() => intro.split(/(\s+)/), []);

    return (
        <div className="lg:px-[10%] px-[10px] lg:py-[5%] py-[10px] min-h-[calc(100svh-100px)] flex flex-col gap-2">
            <motion.div
                className="flex justify-between gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <TimeCard />
                <Status />
            </motion.div>

            <div className="flex items-center flex-1 mt-6">
                <div className="flex w-full md:w-[60%] text-2xl md:text-3xl leading-relaxed">
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
                                        // eslint-disable-next-line react/no-array-index-key
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
                                    // eslint-disable-next-line react/no-array-index-key
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
        </div>
    );
};

export default Home;
