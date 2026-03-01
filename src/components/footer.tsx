import { MousePointer2 } from "lucide-react";
import Link from "next/link";
import WeatherCard from "./weather-card";
import ProverbCard from "./proverb-card";
import DateCard from "./date-card";
import ImageCarousel from "./image-carousel";

const Footer = () => {
    return (
        <footer className="flex flex-col lg:gap-12 gap-[10px] lg:px-[10%] px-[10px] lg:py-[5%] py-[10px]">
            {/* Top Grid */}
            <div className="grid lg:grid-cols-[2fr_1fr] lg:gap-8 gap-[10px]">
                {/* Left Column */}
                <div className="flex flex-col lg:gap-8 gap-[10px]">
                    <div className="grid sm:grid-cols-2 lg:gap-8 gap-[10px]">
                        <WeatherCard />
                        <DateCard />
                    </div>

                    <ProverbCard />
                </div>

                {/* Right Column */}
                <div className="w-full">
                    <ImageCarousel />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 border-t border-[var(--accent-color-faded)] text-sm lg:mb-0 mb-[80px]">
                <div className="flex items-center gap-2 text-[var(--font-color-faded)]">
                    <MousePointer2 size={16} />
                    <span>Designed & Built in New Delhi</span>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/privacy-policy" className="hover:text-[var(--accent-color)] transition-colors">
                        Privacy Policy
                    </Link>

                    <span className="text-[var(--font-color-faded)]">© {new Date().getFullYear()} Kunal Gaur</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
