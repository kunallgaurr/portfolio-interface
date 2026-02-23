"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import React, { useEffect, useMemo, useState } from "react";

const DateCard = () => {
    const [dateInfo, setDateInfo] = useState<ComponentTypes.DateInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchDateInfo() {
            setIsLoading(true);
            try {
                const { data } = await httpAdapter.getDateInfo();
                setDateInfo(data ?? null);
            } catch {
                setDateInfo(null);
            } finally {
                setIsLoading(false);
            }
        }

        fetchDateInfo();
    }, []);

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

    if (!dateInfo) return null;

    return (
        <section className={sectionClassName}>
            <header>
                <span className="text-[var(--font-color-faded)] font-semibold">{dateInfo.month?.toUpperCase()}</span>
            </header>

            <div className="flex flex-col">
                <span className="text-6xl">{dateInfo.date}</span>
                <span className="text-sm text-[var(--font-color-faded)]">{dateInfo.day}</span>
            </div>

            <div className="flex flex-col gap-3">
                <div className="h-10 bg-[#373535] rounded-[5px] p-2 overflow-hidden">
                    <div className="h-full bg-[#85858555] rounded-[3px] transition-all duration-500 ease-out" style={{ width: `${percentage}%` }} />
                </div>

                <span className="text-sm text-[var(--font-color-faded)]">
                    {dateInfo.remainingDays} days left in {dateInfo.year}
                </span>
            </div>
        </section>
    );
};

export default DateCard;
