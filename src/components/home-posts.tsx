"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

function formatPostDate(iso: string) {
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

const HomePostsItem = ({
    post,
    onHoverChange,
}: {
    post: ComponentTypes.LatestPosts;
    onHoverChange: (p: ComponentTypes.LatestPosts | null) => void;
}) => {
    const formattedDate = formatPostDate(post.publishedAt);
    const href = post.slug ? `/posts/${post.slug}` : "/posts";

    return (
        <Link
            href={href}
            className="group flex items-center gap-3 py-2 text-left rounded-md -mx-2 px-2 hover:bg-[var(--card-background)]/50 transition-colors relative"
            onMouseEnter={() => onHoverChange(post)}
            onMouseLeave={() => onHoverChange(null)}
        >
            <div className="shrink-0 w-10 h-10 rounded-md overflow-hidden bg-[var(--card-background)]/60 flex items-center justify-center text-[var(--font-color-faded)]">
                <FileText size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <span className="text-sm text-[var(--font-color-faded)] group-hover:text-[var(--font-color)] transition-colors line-clamp-1">
                    {post.title}
                </span>
                {formattedDate && (
                    <span className="text-xs text-[var(--font-color-faded)]/80">
                        {formattedDate}
                    </span>
                )}
            </div>
            <ArrowRight
                size={14}
                className="shrink-0 text-[var(--font-color-faded)] group-hover:text-[var(--accent-color)] group-hover:translate-x-0.5 transition-all"
            />
        </Link>
    );
};

const HomePostsSidebar = () => {
    const [latestPosts, setLatestPosts] = useState<ComponentTypes.LatestPosts[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [hoveredPost, setHoveredPost] = useState<ComponentTypes.LatestPosts | null>(null);

    const fetchLatestPosts = useCallback(async () => {
        try {
            setLoading(true);
            setHasError(false);
            const response = await httpAdapter.getPosts();
            const statusCode = response?.status?.code;
            if (statusCode !== 200) {
                setLatestPosts([]);
                setHasError(true);
                return;
            }
            const data = response?.data ?? [];
            setLatestPosts(Array.isArray(data) ? data.slice(0, 10) : []);
        } catch {
            setLatestPosts([]);
            setHasError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLatestPosts();
    }, [fetchLatestPosts]);

    const label = (
        <span className="text-sm font-medium text-[var(--font-color-faded)] uppercase tracking-wider">
            Latest Posts
        </span>
    );

    const allPostsLink = (
        <Link
            href="/posts"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--font-color-faded)] hover:text-[var(--accent-color)] transition-colors w-fit mt-1"
        >
            <span>Browse all posts</span>
            <ArrowRight size={14} />
        </Link>
    );

    if (loading) {
        return (
            <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading latest posts">
                {label}
                <div className="flex flex-col gap-0">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-3 py-2 rounded-md -mx-2 px-2">
                            <div className="skeleton shrink-0 w-10 h-10 rounded-md" />
                            <div className="flex-1 space-y-1 min-w-0">
                                <div className="skeleton h-3.5 w-3/4 rounded" />
                                <div className="skeleton h-3 w-16 rounded" />
                            </div>
                            <div className="skeleton shrink-0 w-[14px] h-[14px] rounded" />
                        </div>
                    ))}
                </div>
                {allPostsLink}
            </div>
        );
    }

    if (hasError) {
        return (
            <motion.div
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[var(--card-background)]/60 p-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
            >
                {label}
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <FileText
                        size={32}
                        className="text-[var(--font-color-faded)] shrink-0"
                        aria-hidden
                    />
                    <p className="text-sm text-[var(--font-color-faded)]">
                        Couldn&apos;t load latest posts.
                    </p>
                    <button
                        type="button"
                        onClick={fetchLatestPosts}
                        className="rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-[var(--font-color)] hover:bg-[var(--accent-color-faded)] transition-colors"
                    >
                        Try again
                    </button>
                </div>
                {allPostsLink}
            </motion.div>
        );
    }

    return (
        <div className="relative flex flex-col gap-4">
            {label}
            {latestPosts.length === 0 ? (
                <p className="text-sm text-[var(--font-color-faded)] py-2">
                    No posts yet.
                </p>
            ) : (
                <ul className="flex flex-col gap-0 list-none p-0 m-0">
                    {latestPosts.map((post) => (
                        <li key={post.id}>
                            <HomePostsItem post={post} onHoverChange={setHoveredPost} />
                        </li>
                    ))}
                </ul>
            )}
            {allPostsLink}

            {/* Pop-out image preview on hover (Paul Hanaoka–style) */}
            <AnimatePresence>
                {hoveredPost?.imageUrl && (
                    <motion.div
                        className="absolute right-full top-0 mr-4 w-48 rounded-xl overflow-hidden border border-white/10 bg-[var(--card-background)] shadow-xl z-10 pointer-events-none hidden sm:block"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <div className="aspect-video w-full">
                            <img
                                src={hoveredPost.imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-2.5 border-t border-white/5">
                            <p className="text-xs font-medium text-[var(--font-color)] line-clamp-2">
                                {hoveredPost.title}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HomePostsSidebar;
