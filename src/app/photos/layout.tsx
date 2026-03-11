import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kunalgaur.in";

export const metadata: Metadata = {
    title: "Photos | Kunal Gaur",
    description:
        "A few moments from the journey — photos and snapshots from Kunal Gaur's work and travels.",
    openGraph: {
        title: "Photos | Kunal Gaur",
        description: "Photos and moments from the journey.",
        url: `${baseUrl}/photos`,
    },
    alternates: { canonical: `${baseUrl}/photos` },
};

export default function PhotosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
