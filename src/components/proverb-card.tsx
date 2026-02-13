"use client";

import httpAdapter from "@/adapters/http/http.adapter";
import { ComponentTypes } from "@/types/components.type";
import React, { useEffect, useState } from "react";

const ProverbCard = () => {
  const lengthOfArr = 6;
  const [index, setIndex] = useState<number>(0);

  const [proverb, setProverb] = useState<ComponentTypes.Proverb>({
    author: null,
    quote: null,
  });

  const [loading, setLoading] = useState(false);

  function changeIndex() {
    if (loading) return;

    let newIndex = index + 1;
    if (newIndex >= lengthOfArr) newIndex = 0; // fixed condition
    setIndex(newIndex);
  }

  useEffect(() => {
    async function fetchProverb() {
      try {
        setLoading(true);
        const { data } = await httpAdapter.getProverb();
        setProverb(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // only here
      }
    }

    fetchProverb();
  }, [index]);

  return (
    <div onClick={changeIndex} className="flex flex-col p-8 bg-[var(--card-background)] rounded-[10px] gap-2">
        <span className="text-[var(--font-color-faded)] font-semibold">PROVERB OF THE DAY</span>
        <span>{proverb.quote ?? ""}</span>
        <span>{proverb.author ? ` - ${proverb.author}` : ""}</span>
    </div>
  );
};

export default ProverbCard;
