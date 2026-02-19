"use client";

import React from "react";

type TextareaProps = {
    label?: string;
    name: string;
    placeholder?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    required?: boolean;
    error?: string;
    disabled?: boolean;
    rows?: number;
};

const Textarea: React.FC<TextareaProps> = ({ label, name, placeholder, value, onChange, required, error, disabled, rows = 4 }) => {
    const textareaId = `textarea-${name}`;

    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label htmlFor={textareaId} className="text-sm font-medium text-[var(--font-color-faded)]">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <textarea
                id={textareaId}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                rows={rows}
                className={`
          px-3 py-2 rounded-md
          bg-[var(--card-background)]
          border
          outline-none
          resize-none
          transition
          text-sm
          ${error ? "border-red-500 focus:border-red-500" : "border-[#2a2f3a] focus:border-[var(--accent-color)]"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
            />

            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default Textarea;
