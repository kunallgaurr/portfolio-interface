export const siteConfig = {
	url: "https://kunalgaur.in",
	name: "Kunal Gaur",
	locale: "en",
} as const;

export function absoluteUrl(path: string = "/"): string {
	return new URL(path, siteConfig.url).toString();
}
