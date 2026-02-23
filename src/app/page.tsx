"use client"

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
        <div className="px-[10%] py-[5%] min-h-screen flex flex-col gap-2">
            <motion.div
                className="flex justify-between"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
                <TimeCard />
                <Status />
            </motion.div>

            <div className="flex items-center flex-1">
                <div className="flex w-[60%] text-4xl">
                    <motion.span
                        className="text-[var(--font-color-faded)]"
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: {},
                            show: {
                                transition: {
                                    staggerChildren: 0.03,
                                    delayChildren: 0.12,
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
                                    className={`inline-block ${isHighlighted ? "text-[var(--font-color)]" : ""}`}
                                    variants={{
                                        hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
                                        show: {
                                            opacity: 1,
                                            y: 0,
                                            filter: "blur(0px)",
                                            transition: {
                                                type: "spring",
                                                stiffness: 220,
                                                damping: 22,
                                            },
                                        },
                                    }}
                                    whileHover={{
                                        y: -2,
                                        transition: { type: "spring", stiffness: 400, damping: 20 },
                                    }}
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
