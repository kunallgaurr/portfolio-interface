"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import { MousePointer2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const WeatherCard = () => {
    const [coordinates, setCoordinates] = useState<ComponentTypes.Coordinates>({
        latitude: null,
        longitude: null,
    });

    useEffect(() => {
        if (window) {
            window.navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setCoordinates({ latitude, longitude });
            });
        }
    }, []);

    const [weather, setWeather] = useState<ComponentTypes.Weather>({
        location: {
            name: null,
            region: null,
            country: null,
        },
        current: {
            temp_c: null,
            temp_f: null,
            condition: {
                text: null,
            },
        },
    });

    useEffect(() => {
        async function fetchWeather() {
            if (!coordinates.latitude || !coordinates.longitude) return;

            try {
                const { data } = await httpAdapter.getWeather({
                    latitude: String(coordinates.latitude),
                    longitude: String(coordinates.longitude),
                });

                if (!data || !Object.keys(data).length) {
                    throw Error("Invalid data recieved from HTTP Adapter");
                }

                setWeather(data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchWeather();
    }, [coordinates.latitude, coordinates.longitude]);

    const [temperature, setTempratrue] = useState<"temp_c" | "temp_f">("temp_c");

    return (
        <div 
            className="bg-[var(--card-background)] 
            p-8 rounded-[10px] flex flex-col gap-2"
        >
            <div className="flex justify-between">
                <span 
                    className="text-[var(--font-color-faded)] 
                    font-semibold"
                >
                    {weather.location?.region?.toUpperCase() ?? '... '}, 
                    {weather.location?.country?.toUpperCase() ?? '...'}
                </span>
                <MousePointer2 className="text-[var(--font-color-faded)]"/>
            </div>

            <div className="mb-4">
                <span 
                    className="text-6xl">
                        {weather.current[temperature]}&deg;
                </span>
                <div className="flex gap-1">
                    <span 
                        onClick={() => setTempratrue("temp_c")} 
                        className={`${temperature === 'temp_f' ? 
                            'text-[var(--font-color-faded)]' : ''} cursor-pointer`
                        }
                    >
                        C
                    </span> 
                    <span className="text-[var(--font-color-faded)]">/</span>
                    <span 
                        onClick={() => setTempratrue("temp_f")} 
                        className={`${temperature === 'temp_c' ? 
                            'text-[var(--font-color-faded)]' : ''} cursor-pointer`
                        }
                    >
                        F
                    </span>
                </div>
            </div>

            <div>{weather.current?.condition?.text}</div>
        </div>
    );
};

export default WeatherCard;
