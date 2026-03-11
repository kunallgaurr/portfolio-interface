import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kunalgaur.in";

export const metadata: Metadata = {
    title: "Privacy Policy | Kunal Gaur",
    description:
        "How Kunal Gaur's portfolio handles your data. No hidden trackers, no selling data — your privacy matters.",
    openGraph: {
        title: "Privacy Policy | Kunal Gaur",
        description: "How this site handles your data. No trackers, no data sales.",
        url: `${baseUrl}/privacy-policy`,
    },
    alternates: { canonical: `${baseUrl}/privacy-policy` },
};

export default function PrivacyPolicyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
