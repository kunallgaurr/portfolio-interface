"use client"

"use client";

import { Coffee } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

const Error = ({ reset }: ErrorProps) => {
    return (
        <div className="min-h-screen w-full px-[10%] py-[5%] flex items-center justify-center">
            <motion.section
                className="flex flex-col p-8 bg-[var(--card-background)] rounded-[10px] gap-6 max-w-xl w-full"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
            >
                <header className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#85858555]">
                        <Coffee
                            size={20}
                            strokeWidth={1.8}
                            className="text-[var(--font-color-faded)]"
                            aria-hidden
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[var(--font-color-faded)] text-xs font-semibold tracking-[0.2em] uppercase">
                            Easy there
                        </span>
                        <h1 className="text-xl font-semibold">
                            Looks like you&apos;re trying too many things at once.
                        </h1>
                    </div>
                </header>

                <div className="space-y-1 text-sm text-[var(--font-color-faded)]">
                    <p>Slow down, have a coffee, and then explore more.</p>
                    <p>
                        Your last burst of requests hit a temporary limit, but things usually cool down after a short
                        break.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-[#85858555] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
                    >
                        Try again
                    </button>

                    <Link
                        href="/"
                        className="text-xs text-[var(--font-color-faded)] underline underline-offset-4 hover:text-[var(--font-color)]"
                    >
                        Or head back to the homepage
                    </Link>
                </div>
            </motion.section>
        </div>
    );
};

export default Error;