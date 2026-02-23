"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

const ImageCarousel = () => {
    const [images, setImages] = useState<ComponentTypes.Images[]>([]);
    const [index, setIndex] = useState(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [hasMorePages, setHasMorePages] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchImages() {
            setIsLoading(true);
            try {
                const { data } = await httpAdapter.getImages({
                    pageNumber: String(pageNumber),
                    pageSize: String(5),
                });

                if (!data || data.length === 0) {
                    // No more images from the API: loop over the current set
                    setHasMorePages(false);
                    setIndex(0);
                    return;
                }

                setImages(data);
                setIndex(0); // reset stack when page changes
                setHasMorePages(true);
            } finally {
                setIsLoading(false);
            }
        }
        fetchImages();
    }, [pageNumber]);

    const randomStyles = useMemo(
        () =>
            images.map(() => ({
                rotate: (Math.random() - 0.5) * 6, // subtle rotation
                x: (Math.random() - 0.5) * 18, // small horizontal offset
            })),
        [images.length],
    );

    if (!images.length && !isLoading) return null;

    const showLoadMoreCard = hasMorePages && index >= images.length;

    const handleNext = () => {
        if (!images.length) return;

        // If there are no more pages, loop within the current image set
        if (!hasMorePages) {
            setIndex((prev) => (prev + 1) % images.length);
            return;
        }

        // Otherwise, advance until we hit the load-more card state
        setIndex((prev) => Math.min(prev + 1, images.length));
    };

    const handleLoadMore = () => {
        setPageNumber((prev) => prev + 1);
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {isLoading ? (
                <div className="w-[90%] h-[90%] rounded-xl overflow-hidden shadow-2xl bg-[var(--card-background)]/60 flex items-center justify-center">
                    <div className="w-[70%] h-[70%] rounded-lg animate-pulse" />
                </div>
            ) : !showLoadMoreCard ? (
                images.map((image, i) => {
                    const position = i - index; // 0 = top card, 1 = next, etc.
                    const maxVisible = 3;

                    if (position < 0 || position > maxVisible) return null;

                    const isTop = position === 0;
                    const random = randomStyles[i];

                    return (
                        <motion.div
                            key={image.id}
                            onClick={isTop ? handleNext : undefined}
                            className={`absolute w-[90%] h-[90%] rounded-xl overflow-hidden shadow-2xl bg-[var(--card-background)]/95 ${
                                isTop
                                    ? "cursor-pointer hover:shadow-[0_0_30px_rgba(0,0,0,0.75)]"
                                    : "pointer-events-none"
                            }`}
                            animate={{
                                scale: 1 - position * 0.06,
                                y: position * 20,
                                rotate: isTop ? 0 : random.rotate,
                                x: isTop ? 0 : random.x,
                                opacity: 1 - position * 0.12,
                                zIndex: maxVisible - position,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 25,
                            }}
                        >
                            <img
                                src={image.variants.lg}
                                alt={image.description}
                                className="w-full h-full object-cover"
                            />

                            {!isTop && (
                                <div
                                    className="absolute inset-0 bg-black"
                                    style={{
                                        opacity: 0.18 + position * 0.08,
                                    }}
                                />
                            )}
                        </motion.div>
                    );
                })
            ) : (
                <motion.div
                    onClick={handleLoadMore}
                    className="group relative w-[90%] 
                        h-[90%] rounded-xl bg-[var(--card-background)]/95 
                        shadow-2xl flex flex-col items-center justify-center 
                        gap-4 cursor-pointer border border-white/5 hover:border-white/15 
                        transition-colors p-2"
                    initial={{ scale: 0.9, opacity: 0, y: 16 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 250, damping: 24 }}
                >
                    <RotateCcw
                        size={56}
                        className="text-[var(--font-color)] opacity-90 transition-transform duration-300 group-hover:rotate-180 group-hover:scale-110"
                    />
                    <span className="text-lg font-semibold tracking-wide">
                        Load more photos
                    </span>
                    <span className="text-sm text-[var(--font-color-faded)] text-center max-w-xs">
                        You&apos;ve reached the end of this stack. Tap to fetch a fresh set of images.
                    </span>
                </motion.div>
            )}
        </div>
    );
};

export default ImageCarousel;
