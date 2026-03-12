"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastContextValue = {
    showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 4500;

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [message, setMessage] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);

    const showToast = useCallback((msg: string) => {
        setMessage(msg);
        setVisible(true);
    }, []);

    useEffect(() => {
        if (!visible || !message) return;
        const t = setTimeout(() => {
            setVisible(false);
            setMessage(null);
        }, TOAST_DURATION_MS);
        return () => clearTimeout(t);
    }, [visible, message]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <AnimatePresence>
                {visible && message && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 px-4 py-3 rounded-xl border border-white/10 bg-[var(--card-background)] shadow-lg text-sm text-[var(--font-color)] text-center max-w-[min(90vw,360px)]"
                        role="status"
                        aria-live="polite"
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>
        </ToastContext.Provider>
    );
}
