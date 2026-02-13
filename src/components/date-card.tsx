"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import React, { useEffect, useState } from "react";

const DateCard = () => {
    const [dateInfo, setDateInfo] = useState<ComponentTypes.DateInfo>({
        date: null,
        month: null,
        year: null,
        day: null,
        remainingDays: null,
        totalDays: null,
    });

    useEffect(() => {
        async function fetchDateInfo() {
            const { data } = await httpAdapter.getDateInfo();
            setDateInfo(data);
        }

        fetchDateInfo();
    }, []);

    const [percentage, setPercentage] = useState<number>(0)
    useEffect(() => {
        if(!dateInfo.remainingDays || !dateInfo.totalDays) return;

        const remainingDays = dateInfo.remainingDays;
        const totalDays = dateInfo.totalDays
        const elapsedDays = totalDays - remainingDays;
        const percentageValue = (elapsedDays / totalDays) * 100; 

        setPercentage(percentageValue);

    }, [dateInfo.remainingDays, dateInfo.totalDays])

    return (
        <div className="flex flex-col p-8 bg-[var(--card-background)] rounded-[10px] gap-2">
            <span className="text-[var(--font-color-faded)] font-semibold">{dateInfo.month?.toUpperCase()}</span>

            <div className="flex flex-col mb-2">
                <span className="text-6xl">{dateInfo.date}</span>
                <span>{dateInfo.day}</span>
            </div>

            <div className="flex gap-2 flex-col">
                <div className="h-10 bg-[#373535] rounded-[5px] p-2">
                    <div
                        className="h-full bg-[var(--card-background)] rounded-[3px]"
                        style={{
                            width: `${percentage}%`,
                        }}
                    ></div>{" "}
                </div>

                <span>
                    {dateInfo.remainingDays} days left in {dateInfo.year}
                </span>
            </div>
        </div>
    );
};

export default DateCard;
