"use client";

import { constants } from "@/utils/constants";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import NavbarItem from "./navbar-items";
import { motion } from "framer-motion";

const NavbarButton = ({ char }: { char: string }) => {
    return (
        <span className="bg-[#85858555] rounded-md min-w-[18px] h-[18px] text-[10px] flex items-center justify-center text-[var(--font-color-faded)]" aria-hidden>
            {char}
        </span>
    );
};

const linkBaseClasses = "p-2 flex items-center justify-between rounded-md transition-colors hover:bg-[var(--accent-color-faded)] hover:text-[var(--accent-color)]";

const Navbar = () => {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignore if typing inside input/textarea
            const target = event.target as HTMLElement;
            const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

            if (isTyping) return;

            // Ignore key repeat
            if (event.repeat) return;

            // Let browser handle Cmd/Ctrl+R (refresh) and other modifier shortcuts
            if (event.metaKey || event.ctrlKey) return;

            const pressedKey = event.key.toLowerCase();

            const matchedItem = constants.NAVBAR_ITEMS.find((item) => item.key.toLowerCase() === pressedKey);

            if (matchedItem) {
                router.push(matchedItem.route);
            }

            // Optional: Home shortcut
            if (pressedKey === "h") {
                router.push("/");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router]);

    return (
        <motion.nav
            className="bg-[var(--card-background)] w-full rounded-[10px] p-3 hidden lg:flex flex-col text-sm"
            aria-label="Primary Navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
        >
            {/* Brand */}
            <motion.div
                whileHover={{ scale: 1.02, x: 2 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <Link href="/" className={`${linkBaseClasses} mb-6 font-semibold text-[var(--font-color-faded)]`}>
                    <span>kunalgaur.in</span>
                    <NavbarButton char="H" />
                </Link>
            </motion.div>

            {/* Section Label */}
            <span className="px-2 mb-2 text-xs tracking-wide uppercase font-semibold text-[var(--font-color-faded)]">
                Browse
            </span>

            {/* Navigation Items */}
            <motion.div
                className="flex flex-col gap-1"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: {},
                    show: {
                        transition: {
                            staggerChildren: 0.035,
                            delayChildren: 0.04,
                        },
                    },
                }}
            >
                {constants.NAVBAR_ITEMS.map(({ icon, key, name, route }) => (
                    <motion.div
                        key={key}
                        variants={{
                            hidden: { opacity: 0, x: -10 },
                            show: {
                                opacity: 1,
                                x: 0,
                                transition: { type: "spring", stiffness: 260, damping: 22 },
                            },
                        }}
                        whileHover={{
                            x: 4,
                            scale: 1.01,
                            transition: { type: "spring", stiffness: 360, damping: 22 },
                        }}
                    >
                        <NavbarItem icon={icon} name={name} route={route} shortcut={key} />
                    </motion.div>
                ))}
            </motion.div>
        </motion.nav>
    );
};

export default Navbar;
