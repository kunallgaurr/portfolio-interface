"use client";

import { constants } from "@/utils/constants";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";
import { ComponentTypes } from "@/types/components.type";
import ConnectItem from "./connect-item";

const ConnectLinks = () => {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;

            const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

            if (isTyping) return;
            if (event.repeat) return;

            const pressedKey = event.key.toLowerCase();

            const matchedItem = constants.CONNECT_ITEMS.find((item) => item.key.toLowerCase() === pressedKey);

            if (!matchedItem) return;

            if (matchedItem.action === "copy-email") {
                await navigator.clipboard.writeText(constants.EMAIL);
                return;
            }

            if (matchedItem.action === "external") {
                window.open(matchedItem.route, "_blank", "noopener,noreferrer");
                return;
            }

            if (matchedItem.action === "navigate") {
                router.push(matchedItem.route);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router]);

    return (
        <nav className="bg-[var(--card-background)] w-full rounded-[10px] p-3 flex flex-col text-sm" aria-label="Connect Links">
            <span className="px-2 mb-3 text-xs tracking-wide uppercase font-semibold text-[var(--font-color-faded)]">Connect</span>

            <div className="flex flex-col gap-1">
                {constants.CONNECT_ITEMS.map(({ icon, key, name, route, action }) => (
                    <ConnectItem key={key} icon={icon} name={name} route={route} shortcut={key} action={action as any} />
                ))}
            </div>
        </nav>
    );
};

export default ConnectLinks;
