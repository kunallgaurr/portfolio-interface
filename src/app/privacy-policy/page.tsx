"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import React from "react";

const fadeInUp = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring" as const, stiffness: 160, damping: 22 },
};

const PrivacyPolicy = () => {
    return (
        <div className="min-h-[calc(100svh-100px)] px-4 sm:px-6 lg:px-[10%] pt-4 sm:pt-6 lg:pt-[5%] pb-24 lg:pb-[5%]">
            <div className="flex flex-col gap-6 w-full max-w-2xl leading-relaxed">
                <header className="mb-4 pl-4 border-l-2 border-[var(--accent-color-faded)]">
                    <h1 className="text-2xl font-semibold text-[var(--font-color)]">Privacy policy</h1>
                    <p className="text-sm text-[var(--font-color-faded)] mt-2">
                        How I handle your data.
                    </p>
                </header>

                <motion.div
                    className="flex items-center gap-3"
                    {...fadeInUp}
                    transition={{ ...fadeInUp.transition, delay: 0 }}
                >
                    <ShieldCheck
                        size={24}
                        className="text-[var(--accent-color)] shrink-0"
                        aria-hidden
                    />
                    <span className="text-[var(--font-color)] font-medium">
                        Your privacy matters to me.
                    </span>
                </motion.div>

                <motion.p
                    className="text-[var(--font-color-faded)] leading-relaxed"
                    {...fadeInUp}
                    transition={{ ...fadeInUp.transition, delay: 0.05 }}
                >
                    This website is built to showcase my work, not to collect your data. I do not
                    intentionally collect, store, or track any personal information unless it is
                    explicitly stated (for example, if you choose to contact me directly).
                </motion.p>

                <motion.p
                    className="text-[var(--font-color-faded)] leading-relaxed"
                    {...fadeInUp}
                    transition={{ ...fadeInUp.transition, delay: 0.1 }}
                >
                    I don&apos;t run hidden trackers, I don&apos;t sell data, and I&apos;m not
                    interested in building a secret database of visitors.
                </motion.p>

                <motion.p
                    className="text-[var(--font-color-faded)] leading-relaxed"
                    {...fadeInUp}
                    transition={{ ...fadeInUp.transition, delay: 0.15 }}
                >
                    If you choose to share information with me, such as through a contact form or
                    email, it will only be used to respond to you. I will never share your
                    information with third parties without your clear permission.
                </motion.p>

                <motion.p
                    className="text-[var(--font-color-faded)] leading-relaxed"
                    {...fadeInUp}
                    transition={{ ...fadeInUp.transition, delay: 0.2 }}
                >
                    In short:{" "}
                    <span className="text-[var(--accent-color)]">
                        You&apos;re here to explore my work, not to be analyzed.
                    </span>
                </motion.p>

                <motion.p
                    className="text-[var(--font-color-faded)] leading-relaxed"
                    {...fadeInUp}
                    transition={{ ...fadeInUp.transition, delay: 0.25 }}
                >
                    If anything ever changes regarding data collection, this page will be updated
                    transparently.
                </motion.p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
