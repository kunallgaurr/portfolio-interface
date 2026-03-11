"use client";

import ContactForm from "@/components/contact-form";
import { constants } from "@/utils/constants";
import { Mail, Phone } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const Contact = () => {
    return (
        <div className="min-h-[calc(100svh-100px)] w-full px-4 sm:px-6 lg:px-[10%] pt-4 sm:pt-6 lg:pt-[5%] pb-24 lg:pb-[5%] grid grid-cols-1 gap-6 lg:gap-12 lg:grid-cols-[1fr_1.5fr]">
            <motion.div
                className="flex flex-col justify-center gap-10 max-w-md lg:max-w-none"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 20 }}
            >
                <header className="mb-4 pl-4 border-l-2 border-[var(--accent-color-faded)]">
                    <h1 className="text-2xl font-semibold text-[var(--font-color)]">Get in touch</h1>
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
            </motion.div>

            <ContactForm />
        </div>
    );
};

export default Contact;
