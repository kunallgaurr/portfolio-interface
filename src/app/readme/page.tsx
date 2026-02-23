import React from "react";

const ReadMe = () => {
    return (
        <div className="min-h-screen px-[10%] py-[5%]">
            <div className="flex flex-col gap-4 w-[60%]">
                <span>Welcome to my little experiment on the internet.</span>

                <span>
                    This repository powers my personal corner of the web, a place where ideas get tested, systems get stress-tested, and curiosity gets deployed to production. Most of what lives here
                    started as a question, a late-night thought, or a “what if I try this?” moment.
                </span>

                <span>If something breaks, that’s part of the research.</span>

                <span>How I like to work</span>
                <ul className="flex flex-col gap-2 list-disc pl-5">
                    <li>
                        Move fast, but build it right. I believe in getting things done efficiently, without cutting corners. If it’s worth building, it’s worth building well.
                    </li>

                    <li>
                        Work with intention. I like understanding the why behind decisions, trade-offs, constraints, and long-term impact, before committing to a direction.
                    </li>

                    <li>
                        Own the outcome. I care about how things behave in production, not just how they look in development. Ship, refine, improve, repeat.
                    </li>
                </ul>

                <span>How I Communicate</span>
                <ul className="flex flex-col gap-2 list-disc pl-5">
                    <li>
                        Clarity over everything. I prefer precise requirements, defined goals, and clear next steps. Ambiguity slows momentum.
                    </li>

                    <li>
                        Direct and honest. If something is unclear, I’ll say so. If I’m confused, I ask questions early rather than assume.
                    </li>

                    <li>
                        Decisive collaboration. I value thoughtful discussion, but once a direction is chosen, I prefer committing and moving forward.
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ReadMe;
