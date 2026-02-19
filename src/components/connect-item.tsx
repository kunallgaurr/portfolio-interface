"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";
import { constants } from "@/utils/constants";
import { ComponentTypes } from "@/types/components.type";
import ShortcutBadge from "./shortcut-badge";


const ConnectItem: React.FC<ComponentTypes.ConnectItemProps> = ({ icon: Icon, name, route, shortcut, action }) => {
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(constants.EMAIL);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleClick = async () => {
        if (action === "copy-email") {
            await handleCopy();
            return;
        }

        if (action === "external") {
            window.open(route, "_blank", "noopener,noreferrer");
            return;
        }

        if (action === "navigate") {
            router.push(route);
        }
    };

    return (
        <button onClick={handleClick} className="p-2 cursor-pointer flex items-center justify-between rounded-md transition-colors hover:bg-[var(--accent-color-faded)] hover:text-[var(--accent-color)]">
            <div className="flex items-center gap-2">
                <Icon size={16} />
                <span>{name}</span>

                {action === "copy-email" && <span className="ml-1 text-[var(--font-color-faded)]">{copied ? <Check size={14} /> : <Copy size={14} />}</span>}
            </div>

            <ShortcutBadge char={shortcut} />
        </button>
    );
};

export default ConnectItem;