import Status from "@/components/status";
import TimeCard from "@/components/timecard";
import Image from "next/image";
import React from "react";

const Home = () => {
    return (
        <div className="px-[10%] py-[5%] min-h-screen flex flex-col gap-2">
            <div className="flex justify-between">
                <TimeCard />
                <Status />
            </div>

            <div className="flex items-center flex-1">
                <div className="flex w-[60%] text-4xl">
                    <span className="text-[var(--font-color-faded)]">
                        Hi I am Kunal, I hit random keys, summon 
                        <span className="text-[var(--font-color)]"> microservices</span>, 
                        and call it <span className="text-[var(--font-color)]">architecture</span>.
                        Somehow it compiles, scales, and survives 
                        <span className="text-[var(--font-color)]"> production</span>.
                        Occasionally, I even pretend it was planned.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Home;
