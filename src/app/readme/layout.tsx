import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kunalgaur.in";

export const metadata: Metadata = {
    title: "Readme | Kunal Gaur",
    description:
        "How I work, communicate, and learn. My approach to building software, collaboration, and continuous learning.",
    openGraph: {
        title: "Readme | Kunal Gaur",
        description: "How I work, communicate, and learn — approach and values.",
        url: `${baseUrl}/readme`,
    },
    alternates: { canonical: `${baseUrl}/readme` },
};

export default function ReadmeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
