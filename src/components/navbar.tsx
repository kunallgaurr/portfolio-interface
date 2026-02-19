"use client";

import { constants } from "@/utils/constants";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import NavbarItem from "./navbar-items";

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
        <nav className="bg-[var(--card-background)] w-full rounded-[10px] p-3 flex flex-col text-sm" aria-label="Primary Navigation">
            {/* Brand */}
            <Link href="/" className={`${linkBaseClasses} mb-6 font-semibold text-[var(--font-color-faded)]`}>
                <span>kunalgaur.in</span>
                <NavbarButton char="H" />
            </Link>

            {/* Section Label */}
            <span className="px-2 mb-2 text-xs tracking-wide uppercase font-semibold text-[var(--font-color-faded)]">Browse</span>

            {/* Navigation Items */}
            <div className="flex flex-col gap-1">
                {constants.NAVBAR_ITEMS.map(({ icon, key, name, route }) => (
                    <NavbarItem key={key} icon={icon} name={name} route={route} shortcut={key} />
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
