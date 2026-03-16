"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { HttpTypes } from "@/adapters/http/http.types";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Copy, ExternalLink, FolderGit2, Github, Star, Eye } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

function formatDate(iso: string) {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return "";
    }
}

function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getCloneUrls(project: HttpTypes.GetProject): { https: string; ssh: string } {
    const base = project.cloneUrl ?? project.url;
    const https = base.endsWith(".git") ? base : `${base.replace(/\/$/, "")}.git`;
    if (project.sshUrl) {
        return { https, ssh: project.sshUrl };
    }
    const match = project.url.match(/github\.com[/:]([\w.-]+\/[\w.-]+?)(?:\.git)?\/?$/i);
    const ssh = match ? `git@github.com:${match[1]}.git` : https;
    return { https, ssh };
}

const stagger = {
    animate: {
        transition: { staggerChildren: 0.04, delayChildren: 0.05 },
    },
};

const itemVariants = {
    initial: { opacity: 0, y: 12 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 140, damping: 22 },
    },
};

const ProjectDetailPage = () => {
    const params = useParams();
    const slug = params?.slug as string | undefined;
    const [project, setProject] = useState<HttpTypes.GetProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [copiedClone, setCopiedClone] = useState<"https" | "ssh" | null>(null);

    const copyCloneUrl = useCallback(async (url: string, type: "https" | "ssh") => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedClone(type);
            setTimeout(() => setCopiedClone(null), 2000);
        } catch {
            setCopiedClone(null);
        }
    }, []);

    useEffect(() => {
        if (!slug) {
            setNotFound(true);
            setLoading(false);
            return;
        }
        async function load() {
            if (!slug) return;
            try {
                setLoading(true);
                setHasError(false);
                setNotFound(false);
                const res = await httpAdapter.getProject(slug);
                const statusCode = res?.status?.code;
                const data = res?.data ?? null;
                if (statusCode === 200 && data) {
                    setProject(data);
                    return;
                }
                const listRes = await httpAdapter.getProjects();
                const list = listRes?.data ?? [];
                const found = Array.isArray(list)
                    ? list.find(
                          (p) =>
                              p.name === slug ||
                              (p.fullName && p.fullName.toLowerCase() === slug.toLowerCase())
                      )
                    : null;
                if (found) {
                    try {
                        const detailRes = await httpAdapter.getProject(found.name);
                        if (detailRes?.status?.code === 200 && detailRes?.data) {
                            setProject(detailRes.data);
                            return;
                        }
                    } catch {
                        // use list item as fallback (no readme)
                    }
                    setProject({
                        ...found,
                        language: "",
                        createdAt: "",
                        updatedAt: "",
                        pushedAt: "",
                        readme: "",
                    } as HttpTypes.GetProject);
                } else {
                    setNotFound(true);
                }
            } catch {
                try {
                    const listRes = await httpAdapter.getProjects();
                    const list = listRes?.data ?? [];
                    const found = Array.isArray(list)
                        ? list.find(
                              (p) =>
                                  p.name === slug ||
                                  (p.fullName && p.fullName.toLowerCase() === slug.toLowerCase())
                          )
                        : null;
                    if (found) {
                        try {
                            const detailRes = await httpAdapter.getProject(found.name);
                            if (detailRes?.status?.code === 200 && detailRes?.data) {
                                setProject(detailRes.data);
                                return;
                            }
                        } catch {
                            // ignore
                        }
                        setProject({
                            ...found,
                            language: "",
                            createdAt: "",
                            updatedAt: "",
                            pushedAt: "",
                            readme: "",
                        } as HttpTypes.GetProject);
                    } else {
                        setHasError(true);
                    }
                } catch {
                    setHasError(true);
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [slug]);

    useEffect(() => {
        if (!project) return;
        const prev = document.title;
        document.title = `${project.name} | Projects`;
        return () => {
            document.title = prev;
        };
    }, [project]);

    if (loading) {
        return (
            <div className="relative min-h-[calc(100svh-100px)] px-4 sm:px-6 lg:px-[5%] pt-6 sm:pt-8 lg:pt-[6%] pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-[380px] h-[380px] rounded-full opacity-[0.04] blur-[80px] bg-[var(--accent-color)] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="relative max-w-3xl mx-auto flex flex-col gap-8">
                    <div className="h-5 w-20 rounded bg-[#85858555] animate-pulse" />
                    <div className="rounded-2xl border border-white/10 bg-[var(--card-background)]/30 p-6 space-y-4">
                        <div className="h-8 w-48 rounded-lg bg-[#85858555] animate-pulse" />
                        <div className="h-4 w-full max-w-md rounded bg-[#85858555] animate-pulse" />
                        <div className="flex flex-wrap gap-3">
                            <div className="h-6 w-16 rounded bg-[#85858555] animate-pulse" />
                            <div className="h-6 w-12 rounded bg-[#85858555] animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-4 w-full rounded bg-[#85858555] animate-pulse"
                                style={{ width: i === 4 ? "70%" : "100%" }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (notFound || hasError) {
        return (
            <div className="min-h-[calc(100svh-100px)] px-4 sm:px-6 lg:px-[5%] pt-6 sm:pt-8 pb-24 flex flex-col items-center justify-center gap-6">
                <div className="rounded-2xl border border-white/10 bg-[var(--card-background)]/40 p-8">
                    <FolderGit2 size={40} className="text-[var(--font-color-faded)]" />
                </div>
                <p className="text-[var(--font-color-faded)] text-center">
                    {notFound ? "Project not found." : "Something went wrong loading this project."}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {hasError && (
                        <button
                            type="button"
                            onClick={() => slug && window.location.reload()}
                            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[var(--font-color)] hover:bg-[var(--accent-color-faded)] transition-colors"
                        >
                            Try again
                        </button>
                    )}
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-sm text-[var(--accent-color)] hover:underline"
                    >
                        <ArrowLeft size={18} />
                        Back to projects
                    </Link>
                </div>
            </div>
        );
    }

    if (!project) return null;

    const createdStr = formatDate(project.createdAt);
    const updatedStr = formatDate(project.updatedAt);
    const pushedStr = formatDate(project.pushedAt);

    return (
        <div className="relative min-h-[calc(100svh-100px)] px-4 sm:px-6 lg:px-[5%] pt-6 sm:pt-8 lg:pt-[6%] pb-24 overflow-hidden">
            <div
                className="absolute top-0 right-0 w-[380px] h-[380px] rounded-full opacity-[0.05] blur-[80px] bg-[var(--accent-color)] -translate-y-1/2 translate-x-1/2 pointer-events-none"
                aria-hidden
            />

            <motion.article
                className="relative w-full max-w-5xl mx-auto flex flex-col gap-6 sm:gap-8"
                initial="initial"
                animate="animate"
                variants={stagger}
            >
                {/* Back link: full width, above columns so both columns start at same height */}
                <motion.div variants={itemVariants} className="order-1">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-sm text-[var(--font-color-faded)] hover:text-[var(--accent-color)] transition-colors w-fit"
                    >
                        <ArrowLeft size={18} />
                        Projects
                    </Link>
                </motion.div>

                {/* Two columns: README (left) and project card (right) start at same height. On mobile: project card first. */}
                <div className="order-2 flex flex-col gap-6 sm:gap-8 lg:grid lg:grid-cols-[1fr_minmax(260px,320px)] lg:gap-x-6 lg:items-start">
                    {/* Left column: README — order-2 on mobile so it stacks below project card */}
                    <div className="flex flex-col gap-6 min-w-0 order-2 lg:order-1 lg:col-start-1">
                        {project.readme ? (
                            <motion.section
                                variants={itemVariants}
                                className="rounded-2xl border border-white/10 bg-[var(--card-background)]/20 p-6 sm:p-8 min-w-0"
                            >
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--font-color-faded)] mb-4">
                                    README
                                </h2>
                                <div className="post-content readme-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                        {project.readme}
                                    </ReactMarkdown>
                                </div>
                            </motion.section>
                        ) : (
                            <motion.p
                                variants={itemVariants}
                                className="text-sm text-[var(--font-color-faded)]"
                            >
                                No README for this project.
                            </motion.p>
                        )}

                        <motion.div variants={itemVariants}>
                            <Link
                                href="/projects"
                                className="inline-flex items-center gap-2 text-sm text-[var(--accent-color)] hover:underline"
                            >
                                <ArrowLeft size={16} />
                                Back to projects
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right column: project info card — order-1 on mobile so it stacks at top */}
                    <motion.header
                        variants={itemVariants}
                        className="rounded-2xl border border-white/10 bg-[var(--card-background)]/30 p-5 sm:p-6 order-1 lg:order-2 lg:sticky lg:top-6 lg:col-start-2 lg:border-l-[var(--accent-color)]/20 lg:border-l-2"
                    >
                    <div className="flex flex-col gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-semibold text-[var(--font-color)] tracking-tight">
                                    {project.name}
                                </h1>
                                {project.private && (
                                    <span className="rounded bg-white/10 px-2 py-0.5 text-xs font-medium text-[var(--font-color-faded)]">
                                        Private
                                    </span>
                                )}
                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-lg p-1.5 text-[var(--font-color-faded)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color-faded)] transition-colors"
                                    title="Open on GitHub"
                                    aria-label="Open project on GitHub"
                                >
                                    <Github size={20} />
                                </a>
                            </div>
                            {project.description && (
                                <p className="mt-2 text-sm text-[var(--font-color-faded)] leading-relaxed">
                                    {project.description}
                                </p>
                            )}
                        </div>
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-[var(--font-color)] hover:bg-[var(--accent-color-faded)] hover:border-[var(--accent-color-faded)] transition-colors"
                        >
                            <ExternalLink size={16} />
                            Open repo
                        </a>

                        {(() => {
                            const { https, ssh } = getCloneUrls(project);
                            return (
                                <div className="space-y-2">
                                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--font-color-faded)]">
                                        Clone
                                    </span>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                                            <code className="flex-1 min-w-0 truncate text-xs text-[var(--font-color-faded)]">
                                                {https}
                                            </code>
                                            <button
                                                type="button"
                                                onClick={() => copyCloneUrl(https, "https")}
                                                className="shrink-0 rounded p-1.5 text-[var(--font-color-faded)] hover:bg-[var(--accent-color-faded)] hover:text-[var(--accent-color)] transition-colors"
                                                title="Copy HTTPS URL"
                                                aria-label="Copy HTTPS clone URL"
                                            >
                                                {copiedClone === "https" ? (
                                                    <span className="text-xs text-[var(--accent-color)]">Copied</span>
                                                ) : (
                                                    <Copy size={14} />
                                                )}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                                            <code className="flex-1 min-w-0 truncate text-xs text-[var(--font-color-faded)]">
                                                {ssh}
                                            </code>
                                            <button
                                                type="button"
                                                onClick={() => copyCloneUrl(ssh, "ssh")}
                                                className="shrink-0 rounded p-1.5 text-[var(--font-color-faded)] hover:bg-[var(--accent-color-faded)] hover:text-[var(--accent-color)] transition-colors"
                                                title="Copy SSH URL"
                                                aria-label="Copy SSH clone URL"
                                            >
                                                {copiedClone === "ssh" ? (
                                                    <span className="text-xs text-[var(--accent-color)]">Copied</span>
                                                ) : (
                                                    <Copy size={14} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    <dl className="mt-5 flex flex-col gap-2 text-sm text-[var(--font-color-faded)]">
                        {project.language && (
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent-color)]" />
                                <span>{project.language}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Star size={14} className="shrink-0" />
                            <span>{project.stargazersCount ?? 0} stars</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Eye size={14} className="shrink-0" />
                            <span>{project.watchersCount ?? 0} watchers</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span>{formatSize(project.size)}</span>
                        </div>
                        {createdStr && (
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="shrink-0" />
                                <span>Created {createdStr}</span>
                            </div>
                        )}
                        {updatedStr && (
                            <div className="flex items-center gap-1.5">
                                <span>Updated {updatedStr}</span>
                            </div>
                        )}
                        {pushedStr && (
                            <div className="flex items-center gap-1.5">
                                <span>Pushed {pushedStr}</span>
                            </div>
                        )}
                    </dl>
                </motion.header>
                </div>
            </motion.article>
        </div>
    );
};

export default ProjectDetailPage;
