import type { Metadata, Viewport } from "next";
import { Instrument_Sans, JetBrains_Mono, Syne } from "next/font/google";
import { content } from "@/content";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const body = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const { site, person } = content;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  authors: [{ name: `${person.firstName} ${person.lastName}` }],
  openGraph: {
    type: "website",
    url: "/",
    title: site.title,
    description: site.description,
    siteName: `${person.firstName} ${person.lastName}`,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} is-loading`}
    >
      <body>
        {/* Without JavaScript there is no intro to wait for. */}
        <noscript>
          <style>{`html.is-loading{overflow:auto}.preloader{display:none}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
