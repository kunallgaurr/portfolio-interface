"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { HttpTypes } from "@/adapters/http/http.types";
import { getMonth } from "@/utils/date-utilities";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const formatDateRange = (start: string, end?: string | null, isCurrent?: boolean) => {
    const startDate = new Date(start);
    const startMonth = getMonth(startDate.getMonth());
    const startYear = startDate.getFullYear();
    if (!end || isCurrent) return `${startMonth} ${startYear} — Present`;
    const endDate = new Date(end);
    const endMonth = getMonth(endDate.getMonth());
    const endYear = endDate.getFullYear();
    return `${startMonth} ${startYear} — ${endMonth} ${endYear}`;
};

const fadeIn = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring" as const, stiffness: 160, damping: 22 },
};

const ExperienceDetailPage = () => {
    const params = useParams();
    const id = params?.id as string | undefined;
    const [experience, setExperience] = useState<HttpTypes.GetExperienceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!id) {
            setNotFound(true);
            setLoading(false);
            return;
        }
        async function load() {
            if (!id) return;
            try {
                const res = await httpAdapter.getExperienceDetail(id);
                const data = res?.data ?? null;
                if (data) {
                    setExperience(data);
                    return;
                }
                const listRes = await httpAdapter.getExperience();
                const list = listRes?.data ?? [];
                const found = Array.isArray(list) ? list.find((e) => e.id === id) : null;
                if (found) setExperience(found as HttpTypes.GetExperienceDetail);
                else setNotFound(true);
            } catch {
                try {
                    const listRes = await httpAdapter.getExperience();
                    const list = listRes?.data ?? [];
                    const found = Array.isArray(list) ? list.find((e) => e.id === id) : null;
                    if (found) setExperience(found as HttpTypes.GetExperienceDetail);
                    else setNotFound(true);
                } catch {
                    setNotFound(true);
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    useEffect(() => {
        if (!experience) return;
        const prev = document.title;
        document.title = `${experience.role} at ${experience.companyName} | Kunal Gaur`;
        return () => {
            document.title = prev;
        };
    }, [experience]);

    if (loading) {
        return (
            <div className="min-h-screen px-[10%] py-[5%] pb-20">
                <div className="max-w-2xl mx-auto flex flex-col gap-10">
                    <div className="h-4 w-24 rounded bg-[#85858555] animate-pulse" />

                    <div className="relative overflow-hidden rounded-2xl bg-[var(--card-background)] border border-white/5 p-8">
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-[0.04] blur-3xl bg-[var(--accent-color)]" />
                        <div className="relative flex flex-col gap-4">
                            <div className="h-4 w-40 rounded bg-[#85858555] animate-pulse" />
                            <div className="h-8 w-64 rounded bg-[#85858555] animate-pulse" />
                            <div className="h-5 w-40 rounded bg-[#85858555] animate-pulse" />
                            <div className="h-6 w-20 rounded-full bg-[#85858555] animate-pulse" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="h-4 w-full rounded bg-[#85858555] animate-pulse" />
                        <div className="h-4 w-[85%] rounded bg-[#85858555] animate-pulse" />
                        <div className="h-4 w-[70%] rounded bg-[#85858555] animate-pulse" />
                    </div>

                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3 items-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#85858555]" />
                                <div
                                    className="h-3 rounded bg-[#85858555] animate-pulse"
                                    style={{ width: `${80 - i * 10}%` }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (notFound || !experience) {
        return (
            <div className="min-h-screen px-[10%] py-[5%] flex flex-col items-center justify-center gap-6">
                <p className="text-[var(--font-color-faded)]">Experience not found.</p>
                <Link
                    href="/about"
                    className="text-sm text-[var(--accent-color)] hover:underline flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Back to About
                </Link>
            </div>
        );
    }

    const dateRange = formatDateRange(experience.startDate, experience.endDate, experience.isCurrent);
    const points = experience.points?.slice().sort((a, b) => a.order - b.order) ?? [];

    return (
        <div className="min-h-screen px-[10%] py-[5%] pb-20">
            <motion.div
                className="max-w-2xl mx-auto flex flex-col gap-12"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: {},
                    show: {
                        transition: { staggerChildren: 0.06, delayChildren: 0.1 },
                    },
                }}
            >
                <motion.div variants={fadeIn} className="flex items-center gap-4">
                    <Link
                        href="/about"
                        className="flex items-center gap-2 text-sm text-[var(--font-color-faded)] hover:text-[var(--accent-color)] transition-colors"
                    >
                        <ArrowLeft size={18} />
                        About
                    </Link>
                </motion.div>

                <motion.header
                    variants={fadeIn}
                    className="relative overflow-hidden rounded-2xl bg-[var(--card-background)] border border-white/5 p-8"
                >
                    <div
                        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-[0.06] blur-3xl"
                        style={{ background: "var(--accent-color)" }}
                        aria-hidden
                    />
                    <div className="relative flex flex-col gap-4">
                        <span className="inline-flex items-center gap-2 text-[var(--font-color-faded)] text-sm">
                            <Briefcase size={16} />
                            {dateRange}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--font-color)] tracking-tight">
                            {experience.role}
                        </h1>
                        <p className="text-xl text-[var(--accent-color)] font-medium">
                            {experience.companyName}
                        </p>
                        {experience.isCurrent && (
                            <span className="rounded-full bg-[var(--accent-color-faded)] px-3 py-1 text-xs font-medium text-[var(--accent-color)] w-fit">
                                Current
                            </span>
                        )}
                    </div>
                </motion.header>

                {experience.description && (
                    <motion.section variants={fadeIn}>
                        <p className="text-[var(--font-color-faded)] leading-relaxed text-lg">
                            {experience.description}
                        </p>
                    </motion.section>
                )}

                {points.length > 0 && (
                    <motion.section variants={fadeIn} className="flex flex-col gap-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--font-color-faded)]">
                            Highlights
                        </h2>
                        <ul className="flex flex-col gap-3">
                            {points.map((point, i) => (
                                <motion.li
                                    key={point.id}
                                    className="flex gap-4 items-start"
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 22,
                                        delay: 0.15 + i * 0.04,
                                    }}
                                >
                                    <span
                                        className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent-color)] shrink-0"
                                        aria-hidden
                                    />
                                    <span className="text-[var(--font-color-faded)] leading-relaxed">
                                        {point.content}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.section>
                )}

                <motion.div variants={fadeIn}>
                    <Link
                        href="/about"
                        className="inline-flex items-center gap-2 text-sm text-[var(--accent-color)] hover:underline"
                    >
                        <ArrowLeft size={16} />
                        Back to experience timeline
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ExperienceDetailPage;
