"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import { motion } from "framer-motion";
import { CalendarX } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const DateCard = () => {
    const [dateInfo, setDateInfo] = useState<ComponentTypes.DateInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const fetchDateInfo = useCallback(async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await httpAdapter.getDateInfo();
            const statusCode = response?.status?.code;
            if (statusCode !== 200) {
                setDateInfo(null);
                setHasError(true);
                return;
            }
            setDateInfo(response?.data ?? null);
        } catch {
            setDateInfo(null);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDateInfo();
    }, [fetchDateInfo]);

    const percentage = useMemo(() => {
        if (!dateInfo?.remainingDays || !dateInfo?.totalDays) return 0;

        const elapsed = dateInfo.totalDays - dateInfo.remainingDays;
        return Math.min((elapsed / dateInfo.totalDays) * 100, 100);
    }, [dateInfo]);

    const sectionClassName =
        "flex flex-col p-8 bg-[var(--card-background)] rounded-[10px] gap-4";

    if (isLoading) {
        return (
            <section className={sectionClassName}>
                <header>
                    <div className="h-5 w-20 rounded bg-[#85858555] animate-pulse" />
                </header>

                <div className="flex flex-col gap-2">
                    <div className="h-14 w-16 rounded bg-[#85858555] animate-pulse" />
                    <div className="h-4 w-24 rounded bg-[#85858555] animate-pulse" />
                </div>

                <div className="flex flex-col gap-3">
                    <div className="h-10 bg-[#373535] rounded-[5px] p-2 overflow-hidden">
                        <div className="h-full w-1/3 rounded-[3px] bg-[#85858555] animate-pulse" />
                    </div>
                    <div className="h-4 w-36 rounded bg-[#85858555] animate-pulse" />
                </div>
            </section>
        );
    }

    if (hasError || !dateInfo) {
        return (
            <motion.section
                className={sectionClassName}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
            >
                <div className="flex flex-col items-center justify-center gap-4 py-4 text-center">
                    <CalendarX
                        size={36}
                        className="text-[var(--font-color-faded)]"
                        aria-hidden
                    />
                    <p className="text-sm text-[var(--font-color-faded)]">
                        Couldn&apos;t load the date. Something went wrong on our end.
                    </p>
                    <button
                        type="button"
                        onClick={fetchDateInfo}
                        className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-[var(--font-color)] hover:bg-[var(--accent-color-faded)] transition-colors"
                    >
                        Try again
                    </button>
                </div>
            </motion.section>
        );
    }

    return (
        <motion.section
            className={sectionClassName}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
        >
            <motion.header
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 200, damping: 22 }}
            >
                <span className="text-[var(--font-color-faded)] font-semibold">{dateInfo.month?.toUpperCase()}</span>
            </motion.header>

            <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 22 }}
            >
                <span className="text-6xl">{dateInfo.date}</span>
                <span className="text-sm text-[var(--font-color-faded)]">{dateInfo.day}</span>
            </motion.div>

            <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 22 }}
            >
                <div className="h-10 bg-[#373535] rounded-[5px] p-2 overflow-hidden">
                    <motion.div
                        className="h-full bg-[#85858555] rounded-[3px]"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>

                <span className="text-sm text-[var(--font-color-faded)]">
                    {dateInfo.remainingDays} days left in {dateInfo.year}
                </span>
            </motion.div>
        </motion.section>
    );
};

export default DateCard;
