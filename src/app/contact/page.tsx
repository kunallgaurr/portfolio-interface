import ContactForm from "@/components/contact-form";
import { constants } from "@/utils/constants";
import { Mail, Phone } from "lucide-react";
import React from "react";

const Contact = () => {
    return (
        <div className="h-screen w-full grid grid-cols-[1fr_2fr] px-[10%]">
            <div className="flex flex-col justify-center gap-6">
                <div>
                    <span className="text-[var(--font-color-faded)] text-4xl">Get in touch</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[var(--font-color-faded)] font-semibold flex items-center gap-2">
                        <Mail /> Email
                    </span>
                    <span>{constants.EMAIL}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[var(--font-color-faded)] font-semibold flex items-center gap-2">
                        <Phone /> Phone number
                    </span>
                    <span>{constants.PHONE_NUMBER}</span>
                </div>
            </div>

            <ContactForm />
        </div>
    );
};

export default Contact;
