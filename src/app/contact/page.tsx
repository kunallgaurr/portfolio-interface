"use client";

import ContactForm from "@/components/contact-form";
import { constants } from "@/utils/constants";
import { Mail, Phone, MessageCircle, Copy, Check } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";

const TEMPLATES = [
    "Hey Kunal, I’d love to talk about collaborating on a project.",
    "Quick question about your experience with distributed systems…",
    "Can we schedule a short call to discuss an opportunity?",
] as const;

const Contact = () => {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleTemplateClick = async (template: string, index: number) => {
        try {
            await navigator.clipboard.writeText(template);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex((current) => (current === index ? null : current)), 1400);
        } catch {
            // ignore clipboard errors
        }
    };

    return (
        <div className="min-h-[calc(100svh-100px)] w-full px-4 sm:px-6 lg:px-[10%] pt-4 sm:pt-6 lg:pt-[5%] pb-24 lg:pb-[5%] grid grid-cols-1 gap-6 lg:gap-12 lg:grid-cols-[1fr_1.5fr]">
            <motion.div
                className="flex flex-col justify-center gap-8 max-w-md lg:max-w-none"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 20 }}
            >
                <header className="mb-4 pl-4 border-l-2 border-[var(--accent-color-faded)]">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-color-faded)]/40 text-[var(--accent-color)]">
                            <MessageCircle size={18} aria-hidden />
                        </span>
                        <h1 className="text-2xl font-semibold text-[var(--font-color)]">Get in touch</h1>
                    </div>
                    <p className="text-sm text-[var(--font-color-faded)] mt-2">
                        Prefer email or a quick call? You can also reach me directly using the details below.
                    </p>
                </header>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-[var(--font-color)] flex items-center gap-2">
                            <Mail size={18} aria-hidden /> Email
                        </h2>
                        <p className="text-sm text-[var(--font-color-faded)] leading-relaxed">{constants.EMAIL}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-[var(--font-color)] flex items-center gap-2">
                            <Phone size={18} aria-hidden /> Phone number
                        </h2>
                        <p className="text-sm text-[var(--font-color-faded)] leading-relaxed">{constants.PHONE_NUMBER}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <p className="text-xs text-[var(--font-color-faded)]">
                        Not sure how to start? Steal a line:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {TEMPLATES.map((template, index) => (
                            <button
                                key={template}
                                type="button"
                                onClick={() => handleTemplateClick(template, index)}
                                className="group inline-flex items-center gap-1 rounded-full border border-white/10 bg-[var(--card-background)]/70 px-3 py-1.5 text-[11px] text-[var(--font-color-faded)] hover:border-[var(--accent-color-faded)] hover:text-[var(--accent-color)] transition-colors"
                            >
                                <span className="truncate max-w-[180px] sm:max-w-[220px]">
                                    {template}
                                </span>
                                {copiedIndex === index ? (
                                    <Check size={12} className="text-[var(--accent-color)]" aria-hidden />
                                ) : (
                                    <Copy size={12} className="text-[var(--font-color-faded)] group-hover:text-[var(--accent-color)]" aria-hidden />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            <ContactForm />
        </div>
    );
};

export default Contact;
