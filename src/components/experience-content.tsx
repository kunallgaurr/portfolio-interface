"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import { getMonth } from "@/utils/date-utilities";
import { motion } from "framer-motion";
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
    return (
        <motion.article
            className="flex flex-col gap-6"
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
            <header className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-lg font-medium">{exp.role}</span>
                    <span className="text-[var(--font-color-faded)] text-xs">{exp.companyName}</span>
                </div>

                <span className="text-sm text-[var(--font-color-faded)]">{formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
            </header>

            {exp.description && <p className="text-[var(--font-color-faded)] leading-relaxed">{exp.description}</p>}

            {exp.points?.length > 0 && (
                <ul className="flex flex-col gap-4 list-disc pl-5">
                    {exp.points.map((point) => (
                        <li key={point.id} className="leading-relaxed">
                            {point.content}
                        </li>
                    ))}
                </ul>
            )}
        </motion.article>
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
            <section className="flex flex-col gap-10 w-[60%]">
                {[1, 2].map((i) => (
                    <article key={i} className="flex flex-col gap-6">
                        <header className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <div className="h-6 w-48 rounded bg-[#85858555] animate-pulse" />
                                <div className="h-4 w-32 rounded bg-[#85858555] animate-pulse" />
                            </div>
                            <div className="h-4 w-36 rounded bg-[#85858555] animate-pulse" />
                        </header>
                        <div className="space-y-2">
                            <div className="h-4 w-full rounded bg-[#85858555] animate-pulse" />
                            <div className="h-4 w-[85%] rounded bg-[#85858555] animate-pulse" />
                        </div>
                        <ul className="flex flex-col gap-3 list-none pl-0">
                            {[1, 2, 3].map((j) => (
                                <li key={j} className="h-4 rounded bg-[#85858555] animate-pulse" style={{ width: `${80 - j * 10}%` }} />
                            ))}
                        </ul>
                    </article>
                ))}
            </section>
        );
    }

    if (!experience.length) return null;

    return (
        <section className="flex flex-col gap-10 w-[60%]">
            {experience.map((exp, index) => (
                <ExperienceItem key={exp.id} exp={exp} index={index} />
            ))}
        </section>
    );
};

export default ExperienceContent;
