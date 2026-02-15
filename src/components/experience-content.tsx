"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import { getMonth } from "@/utils/date-utilities";
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

const ExperienceItem = ({ exp }: { exp: ComponentTypes.Experience }) => {
    return (
        <article className="flex flex-col gap-6">
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
        </article>
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

    if (loading) return null;
    if (!experience.length) return null;

    return (
        <section className="flex flex-col gap-10 w-[60%]">
            {experience.map((exp) => (
                <ExperienceItem key={exp.id} exp={exp} />
            ))}
        </section>
    );
};

export default ExperienceContent;
