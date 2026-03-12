"use client";

import { motion } from "framer-motion";
import React from "react";

const Loading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--base-background)]">
            <motion.div
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                <motion.div
                    className="h-10 w-10 rounded-full border-2 border-[var(--accent-color-faded)] border-t-[var(--accent-color)]"
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 0.9,
                        ease: "linear",
                    }}
                    aria-hidden
                />
                <span className="text-xs tracking-[0.18em] uppercase text-[var(--font-color-faded)]">
                    Loading portfolio
                </span>
            </motion.div>
        </div>
    );
};

export default Loading;

