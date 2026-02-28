"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import { motion } from "framer-motion";
import { CloudOff, MapPin, MousePointer2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

type LocationStatus = "idle" | "loading" | "granted" | "denied" | "error" | "unsupported";

const WeatherCard = () => {
    const [coordinates, setCoordinates] = useState<ComponentTypes.Coordinates>({
        latitude: null,
        longitude: null,
    });
    const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");

    const requestLocation = useCallback(() => {
        if (typeof window === "undefined" || !window.navigator?.geolocation) {
            setLocationStatus("unsupported");
            return;
        }

        setLocationStatus("loading");
        setCoordinates({ latitude: null, longitude: null });

        window.navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoordinates({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setLocationStatus("granted");
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setLocationStatus("denied");
                } else {
                    setLocationStatus("error");
                }
            },
        );
    }, []);

    useEffect(() => {
        requestLocation();
    }, [requestLocation]);

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
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState(false);

    const fetchWeather = useCallback(async () => {
        if (!coordinates.latitude || !coordinates.longitude) return;

        setWeatherLoading(true);
        setWeatherError(false);
        try {
            const response = await httpAdapter.getWeather({
                latitude: String(coordinates.latitude),
                longitude: String(coordinates.longitude),
            });

            const statusCode = response?.status?.code;
            if (statusCode !== 200) {
                setWeatherError(true);
                return;
            }

            const data = response?.data;
            if (!data || !Object.keys(data).length) {
                setWeatherError(true);
                return;
            }

            setWeather(data);
        } catch (error) {
            console.error(error);
            setWeatherError(true);
        } finally {
            setWeatherLoading(false);
        }
    }, [coordinates.latitude, coordinates.longitude]);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    const [temperature, setTemperature] = useState<"temp_c" | "temp_f">("temp_c");

    const isLoading =
        locationStatus === "loading" ||
        (locationStatus === "granted" && weatherLoading && !weather.location?.region);
    const isDenied = locationStatus === "denied";
    const isUnsupported = locationStatus === "unsupported";
    const showFallback = isDenied || isUnsupported;

    const cardClassName =
        "bg-[var(--card-background)] p-8 rounded-[10px] flex flex-col gap-2";

    if (showFallback) {
        return (
            <div className={cardClassName}>
                <div className="flex flex-col items-center justify-center gap-4 py-4 text-center">
                    <MapPin
                        size={40}
                        className="text-[var(--font-color-faded)]"
                        aria-hidden
                    />
                    <div className="space-y-1">
                        <p className="text-[var(--font-color)] font-medium">
                            {isDenied
                                ? "Location access was denied"
                                : "Location is not supported"}
                        </p>
                        <p className="text-sm text-[var(--font-color-faded)] max-w-xs">
                            {isDenied
                                ? "Weather is based on your location. You can allow access and try again."
                                : "Your browser doesn’t support geolocation."}
                        </p>
                    </div>
                    {isDenied && (
                        <button
                            type="button"
                            onClick={requestLocation}
                            className="mt-2 px-4 py-2 rounded-lg bg-[#85858555] text-white font-medium hover:opacity-90 transition-opacity"
                        >
                            Allow location and retry
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={cardClassName}>
                <div className="flex justify-between">
                    <div className="h-5 w-32 rounded bg-[#85858555] animate-pulse" />
                    <div className="h-5 w-5 rounded bg-[#85858555] animate-pulse" />
                </div>
                <div className="mb-4 flex items-baseline gap-2">
                    <div className="h-14 w-24 rounded bg-[#85858555] animate-pulse" />
                    <div className="flex gap-1">
                        <span className="text-[var(--font-color-faded)]">C</span>
                        <span className="text-[var(--font-color-faded)]">/</span>
                        <span className="text-[var(--font-color-faded)]">F</span>
                    </div>
                </div>
                <div className="h-5 w-40 rounded bg-[#85858555] animate-pulse" />
            </div>
        );
    }

    if (weatherError) {
        return (
            <motion.div
                className={cardClassName}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
            >
                <div className="flex flex-col items-center justify-center gap-4 py-4 text-center">
                    <CloudOff
                        size={36}
                        className="text-[var(--font-color-faded)]"
                        aria-hidden
                    />
                    <p className="text-sm text-[var(--font-color-faded)]">
                        Couldn&apos;t load the weather. Something went wrong on our end.
                    </p>
                    <button
                        type="button"
                        onClick={fetchWeather}
                        className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-[var(--font-color)] hover:bg-[var(--accent-color-faded)] transition-colors"
                    >
                        Try again
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={cardClassName}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
        >
            <motion.div
                className="flex justify-between"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 200, damping: 22 }}
            >
                <span className="text-[var(--font-color-faded)] font-semibold">
                    {weather.location?.region?.toUpperCase() ?? "..."},{" "}
                    {weather.location?.country?.toUpperCase() ?? "..."}
                </span>
                <MousePointer2 className="text-[var(--font-color-faded)]" />
            </motion.div>

            <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 22 }}
            >
                <span className="text-6xl">
                    {weather.current[temperature] ?? "—"}&deg;
                </span>
                <div className="flex gap-1">
                    <span
                        onClick={() => setTemperature("temp_c")}
                        className={`${
                            temperature === "temp_f"
                                ? "text-[var(--font-color-faded)]"
                                : ""
                        } cursor-pointer`}
                    >
                        C
                    </span>
                    <span className="text-[var(--font-color-faded)]">/</span>
                    <span
                        onClick={() => setTemperature("temp_f")}
                        className={`${
                            temperature === "temp_c"
                                ? "text-[var(--font-color-faded)]"
                                : ""
                        } cursor-pointer`}
                    >
                        F
                    </span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 22 }}
            >
                {weather.current?.condition?.text ?? "—"}
            </motion.div>
        </motion.div>
    );
};

export default WeatherCard;
