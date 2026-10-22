"use client";

import { motion } from "motion/react";
import { useSyncExternalStore } from "react";
import { spring } from "@/lib/springs";

const KEY = "no-fi-theme";

// The theme lives in data-theme on <html>, so the DOM is the source of truth.
function subscribe(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.dataset.theme || "system";
const getServerSnapshot = () => "system";

const icons = {
  system: (
    <path d="M3 4.5h10v6H3zM6 13h4M8 10.5V13" />
  ),
  light: (
    <>
      <circle cx="8" cy="8" r="2.75" />
      <path d="M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.6 3.6l1.05 1.05M11.35 11.35l1.05 1.05M3.6 12.4l1.05-1.05M11.35 4.65l1.05-1.05" />
    </>
  ),
  dark: <path d="M13.25 9.4A5.5 5.5 0 0 1 6.6 2.75a5.5 5.5 0 1 0 6.65 6.65Z" />,
};

const options = [
  { value: "system", label: "System theme" },
  { value: "light", label: "Light theme" },
  { value: "dark", label: "Dark theme" },
];

// Writes the choice to <html> and to storage. Lives outside the component so
// the DOM mutation is not part of rendering.
function applyTheme(value) {
  const root = document.documentElement;
  if (value === "system") delete root.dataset.theme;
  else root.dataset.theme = value;
  try {
    if (value === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, value);
  } catch {
    // Storage can be blocked. The theme still applies for this visit.
  }
}

export default function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div
      role="group"
      aria-label="Theme"
      className="flex items-center gap-0.5 rounded-full bg-chip p-1"
    >
      {options.map((option) => {
        const active = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-label={option.label}
            aria-pressed={active}
            onClick={() => applyTheme(option.value)}
            className={`relative grid size-7 place-items-center rounded-full transition-colors duration-80 ${
              active ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {active ? (
              <motion.span
                layoutId="theme-thumb"
                transition={spring.moderate}
                className="absolute inset-0 rounded-full bg-card shadow-[0_1px_2px_rgb(0_0_0/0.12)]"
              />
            ) : null}
            <svg
              viewBox="0 0 16 16"
              className="relative size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {icons[option.value]}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
