"use client";

import ContactForm from "@/components/contact-form";
import { constants } from "@/utils/constants";
import { Mail, Phone } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const Contact = () => {
    return (
        <div className="min-h-[calc(100svh-100px)] w-full lg:px-[10%] px-[10px] lg:py-[8vh] py-[10%] grid grid-cols-1 lg:gap-12 gap-[10px] lg:grid-cols-[1fr_1.5fr]">
            <motion.div
                className="flex flex-col justify-center gap-10 max-w-md lg:max-w-none"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 20 }}
            >
                <div>
                    <span className="text-[var(--font-color-faded)] text-3xl md:text-4xl">Get in touch</span>
                </div>
                <p className="text-sm text-[var(--font-color-faded)]">
                    Prefer email or a quick call? You can also reach me directly using the details below.
                </p>
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col">
                        <span className="text-[var(--font-color-faded)] font-semibold flex items-center gap-2">
                            <Mail size={18} /> Email
                        </span>
                        <span className="text-sm">{constants.EMAIL}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[var(--font-color-faded)] font-semibold flex items-center gap-2">
                            <Phone size={18} /> Phone number
                        </span>
                        <span className="text-sm">{constants.PHONE_NUMBER}</span>
                    </div>
                </div>
            </motion.div>

            <ContactForm />
        </div>
    );
};

export default Contact;
