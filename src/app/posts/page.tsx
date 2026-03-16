"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import { motion } from "framer-motion";
import { ArrowUpRight, FileText, Pen } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { type: "spring" as const, stiffness: 120, damping: 22 },
};

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

const stagger = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 140, damping: 22 },
  },
};

const PostsPage = () => {
  const [posts, setPosts] = useState<ComponentTypes.LatestPosts[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setHasError(false);
      const response = await httpAdapter.getPosts();
      const statusCode = response?.status?.code;
      if (statusCode !== 200) {
        setPosts([]);
        setHasError(true);
        return;
      }
      const data = response?.data ?? [];
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setPosts([]);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) {
    return (
      <div className="relative min-h-[calc(100svh-100px)] px-4 sm:px-6 lg:px-[10%] pt-6 sm:pt-8 lg:pt-[6%] pb-24 lg:pb-[6%] overflow-hidden">
        <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full opacity-[0.04] blur-[100px] bg-[var(--accent-color)] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative flex flex-col gap-12 w-full max-w-4xl mx-auto">
          <header className="flex flex-col gap-4">
            <div className="h-9 w-40 rounded-lg bg-[#85858555] animate-pulse" />
            <div className="h-px w-16 rounded-full bg-[var(--accent-color)]/50" />
            <div className="h-4 w-72 rounded bg-[#85858555] animate-pulse" />
          </header>
          <div className="grid gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-[var(--card-background)]/30 overflow-hidden"
              >
                <div className="h-44 sm:h-56 bg-[#85858555] animate-pulse" />
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="h-6 w-4/5 rounded-lg bg-[#85858555] animate-pulse" />
                  <div className="h-4 w-full rounded bg-[#85858555] animate-pulse" />
                  <div className="h-3 w-28 rounded bg-[#85858555] animate-pulse" />
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
            <FileText size={40} className="text-[var(--font-color-faded)]" />
          </div>
          <p className="text-sm text-[var(--font-color-faded)]">
            Couldn&apos;t load posts. Something went wrong.
          </p>
          <button
            type="button"
            onClick={fetchPosts}
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-[var(--font-color)] hover:bg-[var(--accent-color-faded)] hover:border-[var(--accent-color-faded)] transition-all"
          >
            Try again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100svh-100px)] px-4 sm:px-6 lg:px-[10%] pt-6 sm:pt-8 lg:pt-[6%] pb-24 lg:pb-[6%] overflow-hidden">
      {/* Ambient */}
      <div
        className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full opacity-[0.05] blur-[100px] bg-[var(--accent-color)] -translate-y-1/2 translate-x-1/2 pointer-events-none"
        aria-hidden
      />

      <motion.div
        className="relative flex flex-col gap-12 w-full max-w-4xl mx-auto"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <motion.header {...fadeInUp} className="mb-4 flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-color-faded)]/40 text-[var(--accent-color)]">
            <Pen size={18} aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--font-color)] cursor-pointer">
              Picks & preferences
            </h2>
            <p className="text-sm text-[var(--font-color-faded)] mt-2">
              Writing and notes. Pick one to read.
            </p>
          </div>
        </motion.header>

        {posts.length === 0 ? (
          <motion.p
            className="text-[var(--font-color-faded)]"
            variants={itemVariants}
          >
            No posts yet.
          </motion.p>
        ) : (
          <ul className="grid gap-6 sm:gap-8 list-none p-0 m-0">
            {posts.map((post, index) => {
              const href = post.slug ? `/posts/${post.slug}` : "/posts";
              const formattedDate = formatPostDate(post.publishedAt);
              const hasImage = Boolean(post.imageUrl);
              return (
                <motion.li key={post.id} variants={itemVariants}>
                  <Link href={href} className="group block">
                    <motion.article
                      className="relative rounded-2xl border border-white/10 bg-[var(--card-background)]/30 overflow-hidden hover:border-white/20 hover:bg-[var(--card-background)]/50 transition-colors duration-300"
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    >
                      {/* Hover glow */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                        style={{
                          boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 20px 40px -12px rgba(0,0,0,0.35)",
                        }}
                      />

                      {hasImage ? (
                        <div className="relative w-full aspect-[2.4/1] sm:aspect-[3/1] overflow-hidden">
                          <img
                            src={post.imageUrl!}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex flex-col gap-1">
                            <h2 className="text-xl sm:text-2xl font-semibold text-white line-clamp-2 group-hover:text-white/95">
                              {post.title}
                            </h2>
                            {formattedDate && (
                              <span className="text-xs text-white/70">
                                {formattedDate}
                              </span>
                            )}
                          </div>
                          <div className="absolute top-4 right-4 rounded-full bg-white/10 backdrop-blur-sm p-2 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ArrowUpRight size={18} strokeWidth={2} />
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-semibold text-[var(--font-color)] group-hover:text-[var(--accent-color)] transition-colors line-clamp-2">
                              {post.title}
                            </h2>
                            {post.brief && (
                              <p className="mt-1.5 text-sm text-[var(--font-color-faded)] line-clamp-2">
                                {post.brief}
                              </p>
                            )}
                            {formattedDate && (
                              <span className="mt-2 inline-block text-xs text-[var(--font-color-faded)]/80">
                                {formattedDate}
                              </span>
                            )}
                          </div>
                          <div className="shrink-0 rounded-full border border-white/10 bg-[var(--card-background)]/50 p-2.5 text-[var(--font-color-faded)] group-hover:text-[var(--accent-color)] group-hover:border-[var(--accent-color-faded)] transition-colors">
                            <ArrowUpRight size={20} strokeWidth={2} />
                          </div>
                        </div>
                      )}

                      {hasImage && post.brief && (
                        <div className="p-4 sm:p-5 border-t border-white/5">
                          <p className="text-sm text-[var(--font-color-faded)] line-clamp-2">
                            {post.brief}
                          </p>
                        </div>
                      )}
                    </motion.article>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default PostsPage;
