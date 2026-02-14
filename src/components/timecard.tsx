"use client";

import React, { useEffect, useState } from "react";
import { Coffee, Sun, Sunset, Moon } from "lucide-react";

const TimeCard = () => {
  const [greeting, setGreeting] = useState<{
    text: string;
    Icon: React.ElementType;
  } | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting({ text: "Good Morning", Icon: Coffee });
    } else if (hour >= 12 && hour < 17) {
      setGreeting({ text: "Good Afternoon", Icon: Sun });
    } else if (hour >= 17 && hour < 21) {
      setGreeting({ text: "Good Evening", Icon: Sunset });
    } else {
      setGreeting({ text: "Good Night", Icon: Moon });
    }
  }, []);

  if (!greeting) return null;

  const { text, Icon } = greeting;

  return (
    <div className="rounded-[10px] flex items-center gap-2 text-lg">
      <Icon size={22} strokeWidth={1.8} />
      <span>{text}</span>
    </div>
  );
};

export default TimeCard;
