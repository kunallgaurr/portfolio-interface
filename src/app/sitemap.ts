import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Every public route belongs here. Update `lastModified` by hand when a
 * route's content changes. A fixed date keeps this route static.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: absoluteUrl("/"),
			lastModified: "2026-11-09",
			changeFrequency: "monthly",
			priority: 1,
		},
	];
}
