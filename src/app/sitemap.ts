import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kunalgaur.in";

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        "",
        "/about",
        "/contact",
        "/photos",
        "/picks",
        "/readme",
        "/privacy-policy",
    ] as const;

    return routes.map((path) => ({
        url: `${baseUrl}${path || "/"}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : ("monthly" as const),
        priority: path === "" ? 1 : 0.8,
    }));
}
