import { GlobalTypes } from "@/types/global.type";
import React from "react";
import { Fira_Sans } from "next/font/google";
import "./globals.css";
import NavbarLayout from "@/components/navbar-layout";
import Navbar from "@/components/navbar";
import MobileNavbar from "@/components/mobile-navbar";
import Footer from "@/components/footer";
import { Metadata } from "next";
import ConnectLinks from "@/components/connect-links";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kunalgaur.in";

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${baseUrl}/#website`,
            url: baseUrl,
            name: "Kunal Gaur | Software Engineer",
            description:
                "Full Stack Developer specializing in scalable backend systems, distributed architectures, and AI-powered applications.",
            publisher: { "@id": `${baseUrl}/#person` },
        },
        {
            "@type": "Person",
            "@id": `${baseUrl}/#person`,
            name: "Kunal Gaur",
            url: baseUrl,
            jobTitle: "Software Engineer",
            description:
                "Full Stack Developer specializing in Node.js, NestJS, React, PostgreSQL, Redis, Kafka, and cloud-native systems.",
        },
    ],
};

const firaSans = Fira_Sans({
    style: ["normal", "italic"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--fira-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Kunal Gaur | Software Engineer",
  description:
    "Kunal Gaur is a Full Stack Developer specializing in scalable backend systems, distributed architectures, event-driven microservices, and AI-powered applications. Explore projects, experience, and technical expertise in Node.js, NestJS, React, PostgreSQL, Redis, Kafka, and cloud-native systems.",
  keywords: [
    "Kunal Gaur",
    "Full Stack Developer",
    "Backend Engineer",
    "Node.js Developer",
    "NestJS Developer",
    "React Developer",
    "Microservices Architecture",
    "Distributed Systems",
    "PostgreSQL",
    "Redis",
    "Kafka",
    "Cloud Computing",
    "AI Integration",
    "Portfolio"
  ],
  authors: [{ name: "Kunal Gaur" }],
  creator: "Kunal Gaur",
  alternates: { canonical: baseUrl },
  openGraph: {
    title: "Kunal Gaur | Full Stack Developer & Backend Engineer",
    description:
      "Building scalable systems, event-driven architectures, and intelligent applications. Explore projects and experience.",
    url: baseUrl,
    siteName: "Kunal Gaur Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kunal Gaur | Full Stack Developer",
    description:
      "Scalable backend systems, microservices, and AI-powered products.",
  },
};


const RootLayout: React.FC<GlobalTypes.BaseLayout> = ({ children }) => {
    return (
        <html lang="en">
            <body className={firaSans.className + ` lg:grid lg:grid-cols-[1fr_4fr]`}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <NavbarLayout>
                    <Navbar />
                    <ConnectLinks />
                    <MobileNavbar />
                </NavbarLayout>
                <div>
                    {children}
                    <Footer />
                </div>
            </body>
        </html>
    );
};

export default RootLayout;
