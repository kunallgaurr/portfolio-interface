"use client";

import React from "react";
import { ComponentTypes } from "@/types/components.type";

const Input: React.FC<ComponentTypes.Input> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  error,
  disabled,
}) => {
  const inputId = `input-${name}`;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--font-color-faded)]"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          px-3 py-2 rounded-md
          bg-[var(--card-background)]
          border
          outline-none
          transition
          text-sm
          ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-[#2a2f3a] focus:border-[var(--accent-color)]"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      />

      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default Input;
