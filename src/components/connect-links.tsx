"use client";

import { constants } from "@/utils/constants";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ComponentTypes } from "@/types/components.type";
import ConnectItem from "./connect-item";
import { motion } from "framer-motion";

const ConnectLinks = () => {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;

            const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

            if (isTyping) return;
            if (event.repeat) return;
            if (event.metaKey || event.ctrlKey) return;

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
        <motion.nav
            className="bg-[var(--card-background)] w-full rounded-[10px] p-3 hidden lg:flex flex-col text-sm"
            aria-label="Connect Links"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.04 }}
        >
            <span className="px-2 mb-3 text-xs tracking-wide uppercase font-semibold text-[var(--font-color-faded)]">
                Connect
            </span>

            <motion.div
                className="flex flex-col gap-1"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: {},
                    show: {
                        transition: {
                            staggerChildren: 0.035,
                            delayChildren: 0.06,
                        },
                    },
                }}
            >
                {constants.CONNECT_ITEMS.map(({ icon, key, name, route, action }) => (
                    <motion.div
                        key={key}
                        variants={{
                            hidden: { opacity: 0, x: 10 },
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
                        <ConnectItem
                            icon={icon}
                            name={name}
                            route={route}
                            shortcut={key}
                            action={action as ComponentTypes.ConnectItemProps["action"]}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </motion.nav>
    );
};

export default ConnectLinks;
