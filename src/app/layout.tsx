import type { Metadata } from "next";
import { MotionProvider } from "@/components/shared/MotionProvider";
import { basics } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const title = `${basics.name} | ${basics.headline}`;

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: title,
		template: `%s | ${basics.name}`,
	},
	description: basics.summary,
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		url: "/",
		siteName: siteConfig.name,
		title,
		description: basics.summary,
	},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang={siteConfig.locale}>
			<body className="bg-background text-foreground">
				<MotionProvider>
					<main>{children}</main>
				</MotionProvider>
			</body>
		</html>
	);
}
