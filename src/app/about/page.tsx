import AboutContent from "@/components/about-content";
import ExperienceContent from "@/components/experience-content";
import React from "react";

const About = () => {
    return (
        <div className="min-h-[calc(100svh-100px)] px-4 sm:px-6 lg:px-[10%] pt-4 sm:pt-6 lg:pt-[5%] pb-24 lg:pb-[5%] flex flex-col gap-16">
            <div className="flex flex-col gap-20">
                <AboutContent />
                <ExperienceContent />
            </div>
        </div>
    );
};

export default About