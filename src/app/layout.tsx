import { GlobalTypes } from "@/types/global.type";
import React from "react";
import { Fira_Sans } from "next/font/google";
import "./globals.css";
import NavbarLayout from "@/components/navbar-layout";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const firaSans = Fira_Sans({
    style: ["normal", "italic"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--fira-sans",
});

const RootLayout: React.FC<GlobalTypes.BaseLayout> = ({ children }) => {
    return (
        <html>
            <body className={firaSans.className + ` grid grid-cols-[1fr_4fr]`}>
                <NavbarLayout>
                    <Navbar />
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
