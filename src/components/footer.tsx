import { MousePointer2 } from "lucide-react";
import Link from "next/link";
import WeatherCard from "./weather-card";
import ProverbCard from "./proverb-card";
import DateCard from "./date-card";
import ImageCarousel from "./image-carousel";

const Footer = () => {
    return <footer className="flex flex-col gap-2 px-[10%] py-[5%]">
        <div className="grid grid-cols-[2fr_1fr] gap-8">
            <div className="flex flex-col gap-8">
                <div className="grid grid-cols-[1fr_1fr] gap-8">
                    <WeatherCard/>
                    <DateCard/>
                </div>

                <ProverbCard/>
            </div>
            <ImageCarousel/>
        </div>

        <div className="flex justify-between py-[10%]">
            <div className="flex gap-2">
                <MousePointer2 />
                <span>Designed & Built in New Delhi</span>
            </div>

            <div className="flex gap-4">
                <Link href={'/privacy-policy'} className="hover:text-[var(--font-color-faded)]">Privacy Policy</Link>
                <span>Kunal Gaur &copy; 2026</span>
            </div>
        </div>
    </footer>;
};

export default Footer;
