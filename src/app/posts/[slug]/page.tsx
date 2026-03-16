"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { HttpTypes } from "@/adapters/http/http.types";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function formatPostDate(iso: string) {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return "";
    }
}

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

const PostDetailPage = () => {
    const params = useParams();
    const slug = params?.slug as string | undefined;
    const [post, setPost] = useState<HttpTypes.GetPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [hasError, setHasError] = useState(false);

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
                const res = await httpAdapter.getPost(slug);
                const statusCode = res?.status?.code;
                const data = res?.data ?? null;
                if (statusCode === 200 && data) {
                    setPost(data);
                    return;
                }
                const listRes = await httpAdapter.getPosts();
                const list = listRes?.data ?? [];
                const found = Array.isArray(list) ? list.find((p) => p.slug === slug) : null;
                if (found) {
                    setPost({
                        ...found,
                        content: (found as HttpTypes.GetPost).content ?? "",
                    });
                } else {
                    setNotFound(true);
                }
            } catch {
                try {
                    const listRes = await httpAdapter.getPosts();
                    const list = listRes?.data ?? [];
                    const found = Array.isArray(list) ? list.find((p) => p.slug === slug) : null;
                    if (found) {
                        setPost({
                            ...found,
                            content: (found as HttpTypes.GetPost).content ?? "",
                        });
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
        if (!post) return;
        const prev = document.title;
        document.title = `${post.title} | Kunal Gaur`;
        return () => {
            document.title = prev;
        };
    }, [post]);

    if (loading) {
        return (
            <div className="relative min-h-[calc(100svh-100px)] px-4 sm:px-6 lg:px-[10%] pt-6 sm:pt-8 lg:pt-[6%] pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[80px] bg-[var(--accent-color)] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="relative max-w-3xl mx-auto flex flex-col gap-8">
                    <div className="h-5 w-24 rounded bg-[#85858555] animate-pulse" />
                    <div className="rounded-2xl overflow-hidden bg-[var(--card-background)]/30 border border-white/10">
                        <div className="aspect-[2.4/1] sm:aspect-[3/1] bg-[#85858555] animate-pulse" />
                        <div className="p-6 sm:p-8 space-y-4">
                            <div className="h-4 w-32 rounded bg-[#85858555] animate-pulse" />
                            <div className="h-10 w-full max-w-xl rounded-lg bg-[#85858555] animate-pulse" />
                            <div className="h-5 w-48 rounded bg-[#85858555] animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-4 w-full rounded bg-[#85858555] animate-pulse" style={{ width: i === 4 ? "75%" : "100%" }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (notFound || hasError) {
        return (
            <div className="min-h-[calc(100svh-100px)] px-4 sm:px-6 lg:px-[10%] pt-6 sm:pt-8 pb-24 flex flex-col items-center justify-center gap-6">
                <div className="rounded-2xl border border-white/10 bg-[var(--card-background)]/40 p-8">
                    <FileText size={40} className="text-[var(--font-color-faded)]" />
                </div>
                <p className="text-[var(--font-color-faded)] text-center">
                    {notFound ? "Post not found." : "Something went wrong loading this post."}
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
                        href="/posts"
                        className="inline-flex items-center gap-2 text-sm text-[var(--accent-color)] hover:underline"
                    >
                        <ArrowLeft size={18} />
                        Back to posts
                    </Link>
                </div>
            </div>
        );
    }

    if (!post) return null;

    const formattedDate = formatPostDate(post.publishedAt);

    return (
        <div className="relative min-h-[calc(100svh-100px)] px-4 sm:px-6 lg:px-[10%] pt-6 sm:pt-8 lg:pt-[6%] pb-24 overflow-hidden">
            <div
                className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[80px] bg-[var(--accent-color)] -translate-y-1/2 translate-x-1/2 pointer-events-none"
                aria-hidden
            />

            <motion.article
                className="relative max-w-3xl mx-auto flex flex-col gap-10"
                initial="initial"
                animate="animate"
                variants={stagger}
            >
                <motion.div variants={itemVariants} className="flex items-center gap-4">
                    <Link
                        href="/posts"
                        className="inline-flex items-center gap-2 text-sm text-[var(--font-color-faded)] hover:text-[var(--accent-color)] transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Posts
                    </Link>
                </motion.div>

                <header className="rounded-2xl overflow-hidden border border-white/10 bg-[var(--card-background)]/30">
                    {post.imageUrl && (
                        <div className="relative aspect-[2.4/1] sm:aspect-[3/1] overflow-hidden">
                            <img
                                src={post.imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                    )}
                    <div className="p-6 sm:p-8 flex flex-col gap-3">
                        {formattedDate && (
                            <time
                                dateTime={post.publishedAt}
                                className="text-sm text-[var(--font-color-faded)]"
                            >
                                {formattedDate}
                            </time>
                        )}
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--font-color)] tracking-tight leading-tight">
                            {post.title}
                        </h1>
                        {post.brief && (
                            <p className="text-[var(--font-color-faded)] text-lg leading-relaxed max-w-2xl">
                                {post.brief}
                            </p>
                        )}
                    </div>
                </header>

                {post.content ? (
                    <motion.section
                        variants={itemVariants}
                        className="post-content"
                    >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content}
                        </ReactMarkdown>
                    </motion.section>
                ) : (
                    <motion.p
                        variants={itemVariants}
                        className="text-[var(--font-color-faded)]"
                    >
                        No content yet.
                    </motion.p>
                )}

                <motion.div variants={itemVariants}>
                    <Link
                        href="/posts"
                        className="inline-flex items-center gap-2 text-sm text-[var(--accent-color)] hover:underline"
                    >
                        <ArrowLeft size={16} />
                        Back to posts
                    </Link>
                </motion.div>
            </motion.article>
        </div>
    );
};

export default PostDetailPage;
