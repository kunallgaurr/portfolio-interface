"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import React, { useEffect, useRef, useState } from "react";

const PAGE_SIZE = 9;

// Bento sizes: "sm" (1x1), "md" (2x1), "lg" (1x2)
const getBentoSize = (i: number) => {
    const pattern = ["md", "sm", "sm", "lg", "sm", "md", "sm", "sm", "lg"] as const;
    return pattern[i % pattern.length];
};

const PhotoTile = ({
    image,
    size,
}: {
    image: ComponentTypes.Images;
    size: "sm" | "md" | "lg";
}) => {
    const sizeClasses = {
        sm: "col-span-1 row-span-1",
        md: "col-span-2 row-span-1",
        lg: "col-span-1 row-span-2",
    };

    return (
        <div className={`${sizeClasses[size]} min-h-[200px]`}> 
            <article className="h-full flex flex-col rounded-2xl overflow-hidden bg-[var(--card-background)] border border-white/5 hover:border-white/10 transition-colors group">
                <div className="relative flex-1 min-h-[180px] overflow-hidden">
                    <img
                        src={image.variants.lg}
                        alt={image.description}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {image.description && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                            <p className="text-sm text-white/95 leading-relaxed line-clamp-2">
                                {image.description}
                            </p>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
};

const PhotosPage = () => {
    const [images, setImages] = useState<ComponentTypes.Images[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchImages() {
            setLoading(true);
            try {
                const { data } = await httpAdapter.getImages({
                    pageNumber: String(page),
                    pageSize: String(PAGE_SIZE),
                });
                setImages(prev => page === 1 ? (data ?? []) : [...prev, ...(data ?? [])]);
                setHasMore((data?.length ?? 0) >= PAGE_SIZE);
            } finally {
                setLoading(false);
            }
        }
        fetchImages();
    }, [page]);

    // infinite scroll observer
    useEffect(() => {
        if (loading || !hasMore) return;
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    setPage(p => p + 1);
                }
            },
            { rootMargin: "200px" }
        );
        const current = loaderRef.current;
        if (current) observer.observe(current);
        return () => {
            if (current) observer.unobserve(current);
        };
    }, [loading, hasMore]);

    return (
        <div className="min-h-screen px-[10%] py-[5%]">
            <div className="flex flex-col gap-12 w-full max-w-6xl">
                <header className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-[var(--font-color)]">Photos</h1>
                    <p className="text-sm text-[var(--font-color-faded)]">
                        A few moments from the journey.
                    </p>
                </header>

                {images.length === 0 && loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] grid-flow-dense">
                        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-2xl bg-[#85858555] animate-pulse ${
                                    getBentoSize(i) === "md"
                                        ? "col-span-2"
                                        : getBentoSize(i) === "lg"
                                          ? "row-span-2"
                                          : ""
                                }`}
                            />
                        ))}
                    </div>
                ) : images.length === 0 ? (
                    <p className="text-[var(--font-color-faded)]">No photos yet.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] grid-flow-dense">
                            {images.map((image, i) => (
                                <PhotoTile
                                    key={image.id}
                                    image={image}
                                    size={getBentoSize(i)}
                                />
                            ))}
                        </div>
                        <div ref={loaderRef} className="h-1" />
                        {loading && (
                            <p className="text-center text-[var(--font-color-faded)] py-4">
                                Loading more…
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PhotosPage;
