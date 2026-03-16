"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import { motion } from "framer-motion";
import { ArrowRight, FolderX } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

const FeatureProjectCard = () => {
    const [featuredProject, setFeaturedProject] = useState<ComponentTypes.Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const fetchFeaturedProject = useCallback(async () => {
        try {
            setIsLoading(true);
            setHasError(false);
            const response = await httpAdapter.getFeaturedProject();
            const statusCode = response?.status?.code;
            if (statusCode !== 200) {
                setFeaturedProject(null);
                setHasError(true);
                return;
            }
            const data = response?.data ?? null;
            if (!data) {
                setFeaturedProject(null);
                return;
            }
            setFeaturedProject(data);
        } catch {
            setFeaturedProject(null);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFeaturedProject();
    }, [fetchFeaturedProject]);

    if (isLoading) {
        return (
            <article className="flex flex-col gap-4" aria-busy="true" aria-label="Loading featured project">
                <span className="text-sm font-medium text-[var(--font-color-faded)] uppercase tracking-wider">
                    Featured Project
                </span>
                <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-[var(--card-background)]">
                    <div className="skeleton absolute inset-0 rounded-2xl" />
                </div>
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--font-color-faded)] hover:text-[var(--accent-color)] transition-colors w-fit"
                >
                    <span>Browse all projects</span>
                    <ArrowRight size={14} />
                </Link>
            </article>
        );
    }

    if (hasError) {
        return (
            <motion.article
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[var(--card-background)]/60 p-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
            >
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <FolderX
                        size={36}
                        className="text-[var(--font-color-faded)] shrink-0"
                        aria-hidden
                    />
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-[var(--font-color)]">
                            Couldn&apos;t load the featured project
                        </p>
                        <p className="text-xs text-[var(--font-color-faded)]">
                            Something went wrong. You can try again or browse all projects.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={fetchFeaturedProject}
                            className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-[var(--font-color)] hover:bg-[var(--accent-color-faded)] transition-colors"
                        >
                            Try again
                        </button>
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-[var(--font-color-faded)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color-faded)] transition-colors"
                        >
                            All projects
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </motion.article>
        );
    }

    if (!featuredProject) {
        return (
            <motion.article
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[var(--card-background)]/60 p-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
            >
                <span className="text-sm font-medium text-[var(--font-color-faded)] uppercase tracking-wider">
                    FEATURED PROJECT
                </span>
                <p className="text-sm text-[var(--font-color-faded)]">
                    I&apos;m not highlighting a project right now, but you can still explore everything I&apos;ve built.
                </p>
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--font-color-faded)] hover:text-[var(--accent-color)] transition-colors w-fit"
                >
                    <span>Browse all projects</span>
                    <ArrowRight size={14} />
                </Link>
            </motion.article>
        );
    }

    return (
        <article className="flex flex-col gap-4">
            <span className="text-sm font-medium text-[var(--font-color-faded)] uppercase tracking-wider">
                FEATURED PROJECT
            </span>
            <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-[var(--card-background)]">
                <img
                    src={featuredProject.image}
                    alt={featuredProject.title}
                    className="w-full h-full object-cover"
                />
            </div>
            <Link
                    href="/projects"
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--font-color-faded)] hover:text-[var(--accent-color)] transition-colors w-fit"
                >
                    <span>Browse all projects</span>
                    <ArrowRight size={14} />
                </Link>
        </article>
    );
};

export default FeatureProjectCard;
