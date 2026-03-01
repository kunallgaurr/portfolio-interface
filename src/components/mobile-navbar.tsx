"use client";

import { constants } from "@/utils/constants";
import ConnectItem from "./connect-item";
import NavbarItem from "./navbar-items";
import { ComponentTypes } from "@/types/components.type";
import { motion, AnimatePresence } from "framer-motion";
import { Hamburger, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const MobileNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleRef = useRef<HTMLButtonElement | null>(null);
    const sheetRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (toggleRef.current?.contains(target) || sheetRef.current?.contains(target)) {
                return;
            }

            setIsOpen(false);
        };

        window.addEventListener("mousedown", handleClickOutside);
        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center lg:hidden pointer-events-none">
            <div className="relative w-full max-w-xl px-4 pb-4 pointer-events-auto">
                {/* Toggle pill */}
                <motion.button
                    ref={toggleRef}
                    type="button"
                    className="relative z-20 mx-auto flex items-center justify-between gap-4 rounded-full bg-[var(--card-background)]/95 border border-white/10 px-4 py-2 text-xs text-[var(--font-color-faded)] shadow-lg w-full max-w-xs"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 22 }}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? "Close navigation" : "Open navigation"}
                >
                    <Link href="/" className="font-medium text-[var(--font-color)]">kunalgaur.in</Link>
                    <motion.span
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="flex items-center justify-center rounded-full bg-[#85858555] p-1"
                    >
                        {isOpen ? <X size={16} onClick={() => setIsOpen((prev) => !prev)}/> : <Hamburger size={16} onClick={() => setIsOpen((prev) => !prev)}/>}
                    </motion.span>
                </motion.button>

                {/* Bottom sheet */}
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Gradient blur backdrop behind the sheet */}
                            <motion.div
                                className="absolute inset-x-0 bottom-0 z-0 h-[260px] bg-gradient-to-t from-black/70 via-black/30 to-transparent backdrop-blur-sm rounded-t-2xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.22 }}
                                aria-hidden
                            />
                            <motion.div
                                ref={sheetRef}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: -10 }}
                                exit={{ opacity: 0, y: 24 }}
                                transition={{ type: "spring", stiffness: 220, damping: 24 }}
                                className="absolute left-[10px] right-[10px] bottom-14 z-10 rounded-2xl bg-[var(--card-background)]/98 border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.75)] backdrop-blur-md p-3 flex flex-col gap-3 w-[calc(100%-20px)]"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1 text-sm">
                                        {constants.NAVBAR_ITEMS.map(({ icon, key, name, route }) => (
                                            <NavbarItem
                                                key={key}
                                                icon={icon}
                                                name={name}
                                                route={route}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-1 text-sm">
                                        {constants.CONNECT_ITEMS.map(({ icon, key, name, route, action }) => (
                                            <ConnectItem
                                                key={key}
                                                icon={icon}
                                                name={name}
                                                route={route}
                                                action={action as ComponentTypes.ConnectItemProps["action"]}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default MobileNavbar;

