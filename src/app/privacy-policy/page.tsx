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
                <motion.header {...fadeInUp} className="mb-4 flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-color-faded)]/40 text-[var(--accent-color)]">
                        <ShieldCheck size={18} aria-hidden />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--font-color)]">
                            Your privacy matters to me.
                        </h2>
                        <p className="text-sm text-[var(--font-color-faded)] mt-2">
                            I value your privacy and security.
                        </p>
                    </div>
                </motion.header>

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
