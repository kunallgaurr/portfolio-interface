"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Input from "./input";
import Textarea from "./textarea";
import httpAdapter from "@/adapters/http/http.adapter";

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email"),
    message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
        reset,
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormValues) => {
        await httpAdapter.sendMesssage(data);
        reset();
    };

    return (
        <div className="px-[10%] py-[8vh] flex justify-center">
            <motion.div
                className="relative flex flex-col gap-8 w-full max-w-xl"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
            >
                <div className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-[var(--accent-color-faded)] blur-3xl opacity-70" />

                {/* Heading */}
                <motion.div
                    className="flex flex-col gap-1"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06, duration: 0.4 }}
                >
                    <span className="text-[var(--font-color-faded)] text-3xl md:text-4xl">
                        Send me a message
                    </span>
                    <span className="text-sm text-[var(--font-color-faded)]">
                        Got an idea, a question, or a slightly chaotic plan?
                    </span>
                    <span className="text-sm text-[var(--font-color-faded)]">
                        Send it over. Let&apos;s build something.
                    </span>
                </motion.div>

                {/* Form */}
                <motion.form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6 bg-[var(--card-background)]/95 p-8 rounded-xl border border-white/5 shadow-[0_18px_45px_rgba(0,0,0,0.75)]"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, type: "spring", stiffness: 160, damping: 20 }}
                >
                    <Input label="Name" placeholder="Your name" error={errors.name?.message} {...register("name")} />
                    <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
                    <Textarea
                        label="Message"
                        placeholder="Tell me what you're thinking..."
                        rows={5}
                        error={errors.message?.message}
                        {...register("message")}
                    />

                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={!isSubmitting ? { scale: 1.02, y: -1 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98, y: 0 } : {}}
                        className="mt-2 px-4 py-2 rounded-md bg-[var(--font-color)] text-[var(--base-background)] cursor-pointer font-medium transition hover:opacity-90 disabled:opacity-50"
                    >
                        {isSubmitting ? "Sending..." : "Send Message"}
                    </motion.button>

                    {isSubmitSuccessful && (
                        <motion.span
                            className="text-sm text-green-500"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            Message sent successfully.
                        </motion.span>
                    )}
                </motion.form>
            </motion.div>
        </div>
    );
};

export default ContactForm;
