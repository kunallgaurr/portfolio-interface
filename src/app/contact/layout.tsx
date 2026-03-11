import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kunalgaur.in";

export const metadata: Metadata = {
    title: "Contact | Kunal Gaur",
    description:
        "Get in touch with Kunal Gaur. Email, phone, or use the contact form for inquiries and collaboration.",
    openGraph: {
        title: "Contact | Kunal Gaur",
        description: "Get in touch — email, phone, or contact form.",
        url: `${baseUrl}/contact`,
    },
    alternates: { canonical: `${baseUrl}/contact` },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
