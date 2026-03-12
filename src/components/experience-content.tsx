"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import { getMonth } from "@/utils/date-utilities";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const formatDateRange = (start: string, end?: string | null, isCurrent?: boolean) => {
    const startDate = new Date(start);
    const startMonth = getMonth(startDate.getMonth());
    const startYear = startDate.getFullYear();

    if (!end || isCurrent) {
        return `${startMonth} ${startYear} - Present`;
    }

    const endDate = new Date(end);
    const endMonth = getMonth(endDate.getMonth());
    const endYear = endDate.getFullYear();

    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
};

const ExperienceItem = ({ exp, index }: { exp: ComponentTypes.Experience; index: number }) => {
    const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
    const router = useRouter();

    const handleClick = () => {
        router.push(`/about/${exp.id}`);
    };

    return (
        <motion.button
            type="button"
            onClick={handleClick}
            className="group relative flex items-stretch gap-4 text-left w-full"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
                delay: index * 0.06,
            }}
        >
            <div className="relative flex flex-col items-center pt-1">
                <span className="h-3 w-3 rounded-full border-2 border-[var(--accent-color)] bg-[var(--base-background)] group-hover:bg-[var(--accent-color)] transition-colors" />
                <span className="flex-1 w-px bg-[var(--accent-color-faded)]" />
            </div>

            <div className="flex-1 rounded-lg bg-[var(--card-background)]/60 border border-white/5 group-hover:border-[var(--accent-color-faded)] px-4 py-3 flex items-center justify-between transition-colors">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-[var(--font-color)]">{exp.role}</span>
                    <span className="text-xs text-[var(--font-color-faded)]">{exp.companyName}</span>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                    {exp.isCurrent && (
                        <span className="rounded-full bg-[var(--accent-color-faded)] px-2 py-0.5 text-[10px] font-medium text-[var(--accent-color)]">
                            Present
                        </span>
                    )}
                    <span className="text-[11px] text-[var(--font-color-faded)]">{dateRange}</span>
                </div>
            </div>
        </motion.button>
    );
};

const ExperienceContent = () => {
    const [experience, setExperience] = useState<ComponentTypes.Experience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchExperience() {
            try {
                const { data } = await httpAdapter.getExperience();
                setExperience(data ?? []);
            } finally {
                setLoading(false);
            }
        }

        fetchExperience();
    }, []);

    if (loading) {
        return (
            <section className="flex flex-col gap-8 w-full max-w-2xl">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-stretch gap-4">
                        <div className="flex flex-col items-center pt-1">
                            <div className="h-3 w-3 rounded-full bg-[#85858555]" />
                            <div className="flex-1 w-px bg-[#85858555]" />
                        </div>
                        <div className="flex-1 rounded-lg border border-[#85858555] px-4 py-3 space-y-2">
                            <div className="h-4 w-40 rounded bg-[#85858555] animate-pulse" />
                            <div className="h-3 w-28 rounded bg-[#85858555] animate-pulse" />
                        </div>
                    </div>
                ))}
            </section>
        );
    }

    if (!experience.length) return null;

    return (
        <section className="flex flex-col gap-8 w-full max-w-2xl">
            {experience.map((exp, index) => (
                <ExperienceItem key={exp.id} exp={exp} index={index} />
            ))}
        </section>
    );
};

export default ExperienceContent;
