import React, { forwardRef } from "react";

type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
  };

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const hasError = Boolean(error);

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
          aria-invalid={hasError || undefined}
          className={`px-3 py-2 rounded-md bg-[#151515] border ${
            hasError ? "border-red-500/70" : "border-[#2a2f3a]"
          } text-sm text-[var(--font-color)] placeholder:text-[#666] shadow-sm focus:outline-none focus:border-[var(--accent-color)] focus:shadow-[0_0_0_1px_rgba(0,0,0,0.8)] resize-none transition-colors transition-shadow ${className}`}
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
