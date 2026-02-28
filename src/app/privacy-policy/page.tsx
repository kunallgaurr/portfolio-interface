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
        <div className="min-h-screen px-[10%] py-[5%]">
            <div className="flex flex-col gap-5 w-full max-w-2xl">
                <motion.div
                    className="flex items-center gap-3"
                    {...fadeInUp}
                    transition={{ ...fadeInUp.transition, delay: 0 }}
                >
                    <ShieldCheck
                        size={28}
                        className="text-[var(--accent-color)] shrink-0"
                        aria-hidden
                    />
                    <span className="text-[var(--font-color)] text-xl">
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
