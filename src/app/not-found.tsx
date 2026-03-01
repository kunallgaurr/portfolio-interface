import { MousePointer2 } from "lucide-react";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen w-full lg:px-[10%] px-[10px] lg:py-[5%] py-[10%] flex items-center justify-center">
      <section className="relative flex flex-col p-8 bg-[var(--card-background)] rounded-[10px] gap-6 max-w-xl w-full overflow-hidden">
        <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[var(--accent-color-faded)] blur-2xl opacity-60 animate-pulse" />
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[var(--font-color-faded)] text-xs font-semibold tracking-[0.2em] uppercase">
              Error 404
            </span>
            <h1 className="text-2xl font-semibold">
              This route never shipped to prod.
            </h1>
          </div>

          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-md bg-[#85858555]">
            <MousePointer2
              size={18}
              className="text-[var(--font-color-faded)] animate-bounce"
              aria-hidden
            />
          </div>
        </header>

        <div className="space-y-1 text-sm text-[var(--font-color-faded)]">
          <p>Looks like you branched off into a path that never got merged.</p>
          <p>Let&apos;s jump back to a stable release of this site.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#85858555] px-4 py-2 text-sm font-medium text-[var(--font-color)] transition duration-200 hover:bg-[var(--accent-color-faded)] hover:text-[var(--accent-color)] hover:scale-[1.03] active:scale-[0.98]"
          >
            <MousePointer2 size={16} />
            Back to homepage
          </Link>

          <div className="text-xs text-[var(--font-color-faded)] flex flex-col sm:items-end gap-1">
            <span>Pro tip: press the H key anywhere to go home.</span>
            <span className="opacity-70">
              (Or use the navigation panel on the left.)
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;