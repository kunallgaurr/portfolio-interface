import React, { forwardRef } from "react";

type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
  };

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-sm text-[var(--font-color-faded)]">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          {...props}
          className="px-3 py-2 rounded-md bg-[var(--card-background)] border border-[#2a2f3a] focus:border-[var(--accent-color)] outline-none resize-none text-sm"
        />

        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
