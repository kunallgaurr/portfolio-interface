"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
        <div className="grid place-items-center px-[10%]">
            <div className="flex flex-col gap-8 w-full max-w-xl">
                {/* Heading */}
                <div className="flex flex-col gap-1">
                    <span className="text-[var(--font-color-faded)] text-4xl font-semibold">Send me a message!</span>
                    <span>Got an idea, a question, or a slightly chaotic plan?</span>
                    <span>Send it over. Let’s build something.</span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 bg-[var(--card-background)] p-8 rounded-xl">
                    <Input label="Name" placeholder="Your name" error={errors.name?.message} {...register("name")} />
                    <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
                    <Textarea label="Message" placeholder="Tell me what you're thinking..." error={errors.message?.message} {...register("message")} />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 px-4 py-2 rounded-md bg-[var(--font-color)] text-[var(--base-background)] cursor-pointer font-medium transition hover:opacity-90 disabled:opacity-50"
                    >
                        {isSubmitting ? "Sending..." : "Send Message"}
                    </button>

                    {isSubmitSuccessful && <span className="text-sm text-green-500">Message sent successfully.</span>}
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
