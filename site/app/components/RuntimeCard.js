"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";
import { spring } from "@/lib/springs";
import CopyButton from "./CopyButton";

// A command card that can show the same command for Node or Python.
export default function RuntimeCard({ title, note, commands }) {
  const [runtime, setRuntime] = useState("node");
  const command = commands[runtime];
  // Each card has its own thumb, so the layout id has to be unique per card.
  const thumbId = useId();

  return (
    <article className="flex min-w-0 flex-col rounded-[28px] border border-line bg-card p-2 shadow-[var(--lift)]">
      <div className="flex h-28 flex-none items-center overflow-x-auto rounded-[20px] bg-stage p-6">
        <pre className="overflow-x-auto font-mono text-[13px] leading-6">
          <span className="select-none text-muted">$ </span>
          {command}
        </pre>
      </div>
      <div className="px-3 pb-2 pt-4 sm:px-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-sm text-muted">{note}</p>
          </div>
          <div className="flex flex-none items-center gap-2">
            <div role="group" aria-label="Runtime" className="inline-flex rounded-full bg-chip p-0.5 text-[13px] font-medium">
              {[
                ["node", "Node"],
                ["python", "Python"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={runtime === key}
                  onClick={() => setRuntime(key)}
                  className={`relative h-6 rounded-full px-2.5 transition-colors duration-80 ${
                    runtime === key ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {runtime === key ? (
                    <motion.span
                      layoutId={thumbId}
                      transition={spring.moderate}
                      className="absolute inset-0 rounded-full bg-card shadow-sm"
                    />
                  ) : null}
                  <span className="relative">{label}</span>
                </button>
              ))}
            </div>
            <CopyButton text={command} />
          </div>
        </div>
      </div>
    </article>
  );
}
