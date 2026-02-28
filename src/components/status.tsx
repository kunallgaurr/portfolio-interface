"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const Status = () => {
    const [status, setStatus] = useState<ComponentTypes.Status>({
        status: null,
        reason: null,
    });

    useEffect(() => {
        async function fetchStatus() {
            const { data } = await httpAdapter.getStatus();
            setStatus(data);
        }
        fetchStatus();
    }, []);

    const isOffline = status.status === "Offline";
    const isLoading = status.status == null;

    const statusStyles = isOffline
        ? "bg-[#026beb22] text-[#026beb] border-[#026beb]"
        : "bg-[#2bc70022] text-[#2bc700] border-[#2bc700]";

    const dotColor = isOffline ? "bg-[#026beb]" : "bg-[#2bc700]";

    return (
        <motion.div
            className={`rounded-[50px] px-3 py-1.5 w-fit flex items-center gap-2 border ${statusStyles}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            title={status.reason ?? undefined}
        >
            <motion.div
                className={`h-2 w-2 rounded-full shrink-0 ${dotColor}`}
                animate={
                    isLoading
                        ? { opacity: [0.5, 1, 0.5] }
                        : !isOffline
                          ? { scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }
                          : {}
                }
                transition={{
                    duration: isLoading ? 1.2 : 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <span className="text-sm font-medium">
                {status.status ?? "Checking…"}
            </span>
        </motion.div>
    );
};

export default Status;