"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { HttpTypes } from "@/adapters/http/http.types";
import { motion } from "framer-motion";
import { ArrowUpRight, FolderGit2, Star } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { type: "spring" as const, stiffness: 120, damping: 22 },
};

const stagger = {
    animate: {
        transition: { staggerChildren: 0.05, delayChildren: 0.06 },
    },
};

const itemVariants = {
    initial: { opacity: 0, y: 16 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 140, damping: 22 },
    },
};

const ProjectsPage = () => {
    const [projects, setProjects] = useState<HttpTypes.GetProjects[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [search, setSearch] = useState("");

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            setHasError(false);
            const response = await httpAdapter.getProjects();
            const statusCode = response?.status?.code;
            if (statusCode !== 200) {
                setProjects([]);
                setHasError(true);
                return;
            }
            const data = response?.data ?? [];
            setProjects(Array.isArray(data) ? data : []);
        } catch {
            setProjects([]);
            setHasError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const filteredProjects = useMemo(() => {
        if (!search.trim()) return projects;
        const q = search.trim().toLowerCase();
        return projects.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                (p.fullName && p.fullName.toLowerCase().includes(q)) ||
                (p.description && p.description.toLowerCase().includes(q))
        );
    }, [projects, search]);

    if (loading) {
        return (
            <div className="relative min-h-[calc(100svh-100px)] px-4 sm:px-6 lg:px-[10%] pt-6 sm:pt-8 lg:pt-[6%] pb-24 overflow-hidden" aria-busy="true">
                <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full opacity-[0.04] blur-[90px] bg-[var(--accent-color)] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="relative max-w-5xl mx-auto flex flex-col gap-10">
                    <header className="mb-4 flex items-start gap-3">
                        <div className="skeleton mt-0.5 h-9 w-9 shrink-0 rounded-lg" />
                        <div className="flex-1 space-y-2 min-w-0">
                            <div className="skeleton h-5 w-28 rounded" />
                            <div className="skeleton h-4 w-72 rounded" />
                            <div className="skeleton h-9 w-full max-w-xs rounded-lg mt-3" />
                        </div>
                    </header>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="rounded-2xl border border-white/10 bg-[var(--card-background)]/30 p-5 sm:p-6 flex flex-col"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="skeleton h-10 w-10 rounded-lg shrink-0" />
                                    <div className="skeleton h-8 w-8 rounded-full shrink-0" />
                                </div>
                                <div className="mt-3 flex-1 min-w-0 space-y-1.5">
                                    <div className="skeleton h-5 w-3/4 rounded" />
                                    <div className="skeleton h-4 w-full rounded" />
                                    <div className="skeleton h-4 w-2/3 rounded" />
                                </div>
                                <div className="mt-4 flex items-center gap-4">
                                    <div className="skeleton h-4 w-12 rounded" />
                                    <div className="skeleton h-4 w-14 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="min-h-[calc(100svh-100px)] px-4 sm:px-6 lg:px-[10%] pt-6 sm:pt-8 lg:pt-[6%] pb-24 flex items-center justify-center">
                <motion.div
                    className="flex flex-col items-center gap-5 text-center max-w-sm"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 160, damping: 22 }}
                >
                    <div className="rounded-2xl border border-white/10 bg-[var(--card-background)]/40 p-8">
                        <FolderGit2 size={40} className="text-[var(--font-color-faded)]" />
                    </div>
                    <p className="text-sm text-[var(--font-color-faded)]">
                        Couldn&apos;t load projects. Something went wrong.
                    </p>
                    <button
                        type="button"
                        onClick={fetchProjects}
                        className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-[var(--font-color)] hover:bg-[var(--accent-color-faded)] hover:border-[var(--accent-color-faded)] transition-all"
                    >
                        Try again
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative min-h-[calc(100svh-100px)] px-4 sm:px-6 lg:px-[10%] pt-6 sm:pt-8 lg:pt-[6%] pb-24 overflow-hidden">
            <div
                className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full opacity-[0.05] blur-[90px] bg-[var(--accent-color)] -translate-y-1/2 translate-x-1/2 pointer-events-none"
                aria-hidden
            />

            <motion.div
                className="relative max-w-5xl mx-auto flex flex-col gap-10"
                initial="initial"
                animate="animate"
                variants={stagger}
            >
                <motion.header {...fadeInUp} className="mb-4 flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-color-faded)]/40 text-[var(--accent-color)]">
                        <FolderGit2 size={18} aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-semibold text-[var(--font-color)]">
                            Projects
                        </h2>
                        <p className="text-sm text-[var(--font-color-faded)] mt-2">
                            Open-source and side projects. Click any card to view details.
                        </p>
                        {projects.length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <span className="text-xs uppercase tracking-widest text-[var(--font-color-faded)]/80">
                                    {projects.length} {projects.length === 1 ? "project" : "projects"}
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search projects…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="rounded-lg border border-white/10 bg-[var(--card-background)]/40 px-3 py-2 text-sm text-[var(--font-color)] placeholder:text-[var(--font-color-faded)]/70 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color-faded)] transition-colors w-full max-w-xs"
                                    aria-label="Search projects"
                                />
                            </div>
                        )}
                    </div>
                </motion.header>

                {projects.length === 0 ? (
                    <motion.p
                        className="text-[var(--font-color-faded)]"
                        variants={itemVariants}
                    >
                        No projects yet.
                    </motion.p>
                ) : filteredProjects.length === 0 ? (
                    <motion.p
                        className="text-[var(--font-color-faded)]"
                        variants={itemVariants}
                    >
                        No projects match &quot;{search}&quot;.
                    </motion.p>
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
                        {filteredProjects.map((project, index) => (
                            <motion.li
                                key={project.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 140,
                                    damping: 22,
                                    delay: index * 0.04,
                                }}
                            >
                                <Link
                                    href={`/projects/${encodeURIComponent(project.name)}`}
                                    className="group block h-full"
                                >
                                    <motion.article
                                        className="relative h-full rounded-2xl border border-white/10 bg-[var(--card-background)]/30 p-5 sm:p-6 overflow-hidden hover:border-white/20 hover:bg-[var(--card-background)]/50 transition-colors duration-300 flex flex-col"
                                        whileHover={{ y: -4 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 24 }}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                                            style={{
                                                boxShadow:
                                                    "0 0 0 1px rgba(255,255,255,0.06), 0 16px 32px -8px rgba(0,0,0,0.3)",
                                            }}
                                        />
                                        <div className="relative flex items-start justify-between gap-3">
                                            <span className="rounded-lg bg-white/5 p-2 text-[var(--font-color-faded)] group-hover:text-[var(--accent-color)] transition-colors">
                                                <FolderGit2 size={20} strokeWidth={1.5} />
                                            </span>
                                            <span className="rounded-full bg-white/5 p-1.5 text-[var(--font-color-faded)] opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowUpRight size={16} strokeWidth={2} />
                                            </span>
                                        </div>
                                        <div className="relative mt-3 flex-1 min-w-0">
                                            <h2 className="text-lg font-semibold text-[var(--font-color)] group-hover:text-[var(--accent-color)] transition-colors line-clamp-1">
                                                {project.name}
                                            </h2>
                                            {project.description && (
                                                <p className="mt-1.5 text-sm text-[var(--font-color-faded)] line-clamp-2 leading-relaxed">
                                                    {project.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="relative mt-4 flex items-center gap-4 text-xs text-[var(--font-color-faded)]">
                                            <span className="inline-flex items-center gap-1">
                                                <Star size={14} strokeWidth={2} className="shrink-0" />
                                                {project.stargazersCount ?? 0}
                                            </span>
                                            {project.private && (
                                                <span className="rounded bg-white/10 px-1.5 py-0.5">
                                                    Private
                                                </span>
                                            )}
                                        </div>
                                    </motion.article>
                                </Link>
                            </motion.li>
                        ))}
                    </ul>
                )}
            </motion.div>
        </div>
    );
};

export default ProjectsPage;
