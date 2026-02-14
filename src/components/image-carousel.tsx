"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import { motion } from "framer-motion";
import { ArrowRightCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

const ImageCarousel = () => {
    const [images, setImages] = useState<ComponentTypes.Images[]>([]);
    const [index, setIndex] = useState(0);
    const [pageNumber, setPageNumber] = useState<number>(1);

    useEffect(() => {
        async function fetchImages() {
            const { data } = await httpAdapter.getImages({
                pageNumber: String(pageNumber),
                pageSize: String(5),
            });

            setImages(data);
            setIndex(0); // reset stack when page changes
        }
        fetchImages();
    }, [pageNumber]);

    const randomStyles = useMemo(() => {
        return images.map(() => ({
            rotate: (Math.random() - 0.5) * 12,
            x: (Math.random() - 0.5) * 30,
        }));
    }, [images]);

    if (!images.length) return null;

    const isLastImage = index === images.length - 1;

    const handleNext = () => {
        if (!isLastImage) {
            setIndex((prev) => prev + 1);
        }
    };

    const handleLoadMore = () => {
        setPageNumber((prev) => prev + 1);
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* LOAD MORE CARD */}
            {isLastImage && (
                <motion.div
                    onClick={handleLoadMore}
                    className="absolute w-[90%] h-[90%] rounded-xl bg-[var(--card-background)] shadow-2xl flex flex-col items-center justify-center gap-4 cursor-pointer"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 250, damping: 25 }}
                >
                    <ArrowRightCircle size={64} className="opacity-80" />
                    <span className="text-lg font-semibold">
                        Load More Photos
                    </span>
                </motion.div>
            )}

            {images.map((image, i) => {
                const position = (i - index + images.length) % images.length;

                if (position > 3) return null;

                const isTop = position === 0;
                const random = randomStyles[i];

                return (
                    <motion.div
                        key={image.id}
                        onClick={handleNext}
                        className="absolute w-[90%] h-[90%] rounded-xl overflow-hidden shadow-2xl cursor-pointer"
                        animate={{
                            scale: 1 - position * 0.07,
                            y: position * 25,
                            rotate: random.rotate,
                            x: random.x,
                            opacity: 1 - position * 0.1,
                            zIndex: images.length - position,
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
                                    opacity: 0.15 + position * 0.1,
                                }}
                            />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default ImageCarousel;
