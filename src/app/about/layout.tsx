import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kunalgaur.in";

export const metadata: Metadata = {
    title: "About | Kunal Gaur",
    description:
        "About Kunal Gaur — Software Engineer and Full Stack Developer. Background, experience, and how I approach building scalable systems.",
    openGraph: {
        title: "About | Kunal Gaur",
        description:
            "About Kunal Gaur — Software Engineer. Background, experience, and approach to building scalable systems.",
        url: `${baseUrl}/about`,
    },
    alternates: { canonical: `${baseUrl}/about` },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
