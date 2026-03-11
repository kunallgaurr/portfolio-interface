import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kunalgaur.in";

export const metadata: Metadata = {
    title: "Picks & Preferences | Kunal Gaur",
    description:
        "Things I enjoy — shows, sports, food, live comedy, cafes, and mountains. A peek at what keeps me curious.",
    openGraph: {
        title: "Picks & Preferences | Kunal Gaur",
        description: "Shows, sports, food, comedy, cafes — what I enjoy beyond the terminal.",
        url: `${baseUrl}/picks`,
    },
    alternates: { canonical: `${baseUrl}/picks` },
};

export default function PicksLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
