"use client";

import { useRef, useState } from "react";

export default function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-8 min-w-[4.5rem] shrink-0 items-center whitespace-nowrap justify-center rounded-full bg-chip px-3 text-[13px] font-medium text-ink transition-colors duration-150 hover:bg-chip-hover"
    >
      <span key={copied ? "done" : "idle"} className="swap">
        {copied ? "Copied" : label}
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
