"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import React, { useEffect, useMemo, useState } from "react";

const DateCard = () => {
    const [dateInfo, setDateInfo] = useState<ComponentTypes.DateInfo | null>(null);

    useEffect(() => {
        async function fetchDateInfo() {
            try {
                const { data } = await httpAdapter.getDateInfo();
                setDateInfo(data ?? null);
            } catch {
                setDateInfo(null);
            }
        }

        fetchDateInfo();
    }, []);

    const percentage = useMemo(() => {
        if (!dateInfo?.remainingDays || !dateInfo?.totalDays) return 0;

        const elapsed = dateInfo.totalDays - dateInfo.remainingDays;
        return Math.min((elapsed / dateInfo.totalDays) * 100, 100);
    }, [dateInfo]);

    if (!dateInfo) return null;

    return (
        <section className="flex flex-col p-8 bg-[var(--card-background)] rounded-[10px] gap-4">
            <header>
                <span className="text-[var(--font-color-faded)] font-semibold">{dateInfo.month?.toUpperCase()}</span>
            </header>

            <div className="flex flex-col">
                <span className="text-6xl font-semibold">{dateInfo.date}</span>
                <span className="text-sm text-[var(--font-color-faded)]">{dateInfo.day}</span>
            </div>

            <div className="flex flex-col gap-3">
                <div className="h-10 bg-[#373535] rounded-[5px] p-2 overflow-hidden">
                    <div className="h-full bg-[var(--accent-color)] rounded-[3px] transition-all duration-500 ease-out" style={{ width: `${percentage}%` }} />
                </div>

                <span className="text-sm text-[var(--font-color-faded)]">
                    {dateInfo.remainingDays} days left in {dateInfo.year}
                </span>
            </div>
        </section>
    );
};

export default DateCard;
