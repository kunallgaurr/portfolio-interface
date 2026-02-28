"use client";

import React, { useEffect, useState } from "react";
import { Coffee, Sun, Sunset, Moon } from "lucide-react";
import { motion } from "framer-motion";

const getGreeting = (hour: number) => {
  if (hour >= 5 && hour < 12) return { text: "Good Morning", Icon: Coffee };
  if (hour >= 12 && hour < 17) return { text: "Good Afternoon", Icon: Sun };
  if (hour >= 17 && hour < 21) return { text: "Good Evening", Icon: Sunset };
  return { text: "Good Night", Icon: Moon };
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

const TimeCard = () => {
  const [greeting, setGreeting] = useState<{
    text: string;
    Icon: React.ElementType;
  } | null>(null);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setGreeting(getGreeting(now.getHours()));
      setTime(formatTime(now));
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!greeting) return null;

  const { text, Icon } = greeting;

  return (
    <motion.div
      className="flex items-center gap-3 rounded-[10px]"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      whileHover={{ x: 2 }}
    >
      <motion.div
        className="flex items-center justify-center text-[var(--font-color-faded)]"
        animate={{
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut",
        }}
      >
        <Icon size={22} strokeWidth={1.8} />
      </motion.div>
      <div className="flex flex-col">
        <span className="text-lg">{text}</span>
        {time && (
          <span className="text-xs text-[var(--font-color-faded)]">{time}</span>
        )}
      </div>
    </motion.div>
  );
};

export default TimeCard;
