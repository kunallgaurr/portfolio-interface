"use client";

import { useRef, useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be refused; the mailto link still works.
    }
  };

  return (
    <button type="button" className="copy mono" onClick={copy} data-cursor="link">
      <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
    </button>
  );
}
