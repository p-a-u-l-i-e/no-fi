"use client";

import { useState } from "react";

// Column counts at each breakpoint. Keep in step with the grid classes below.
const COLUMNS = { sm: 2, lg: 4 };

// Tailwind only emits classes it can see whole, so the spans are spelled out.
const SPAN = {
  sm: { 1: "sm:col-span-1" },
  lg: { 1: "lg:col-span-1", 2: "lg:col-span-2", 3: "lg:col-span-3" },
};

// How many cells are missing from the last row at a breakpoint.
const leftover = (count, columns) => (columns - (count % columns)) % columns;

// Widest line of a drawing, in characters. The stage scales the text to fit it.
const widest = (text) => Math.max(...text.split("\n").map((line) => [...line].length));

// The filler shows only at breakpoints where the last row is short, and spans
// exactly the cells left over there. The single-column layout is never short.
function fillerClasses(count) {
  const sm = leftover(count, COLUMNS.sm);
  const lg = leftover(count, COLUMNS.lg);
  return [
    "hidden",
    sm > 0 ? `sm:flex ${SPAN.sm[sm]}` : "sm:hidden",
    lg > 0 ? `lg:flex ${SPAN.lg[lg]}` : "lg:hidden",
  ].join(" ");
}

export default function VocabularyGrid({ groups, items }) {
  const [group, setGroup] = useState("All");
  const visible = group === "All" ? items : items.filter((item) => item.group === group);
  const count = (name) =>
    name === "All" ? items.length : items.filter((item) => item.group === name).length;

  return (
    <>
      <div role="group" aria-label="Filter by group" className="mt-8 flex flex-wrap gap-2">
        {["All", ...groups].map((name) => {
          const active = group === name;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={active}
              onClick={() => setGroup(name)}
              className={`inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[13px] font-medium transition-colors duration-150 ${
                active
                  ? "bg-ink text-page"
                  : "bg-chip text-ink hover:bg-chip-hover"
              }`}
            >
              {name}
              <span className={active ? "opacity-60" : "text-muted"}>{count(name)}</span>
            </button>
          );
        })}
      </div>

      {/*
        One container, hairline dividers. Every cell draws a right and bottom
        border; the negative margins push the last column's and last row's
        borders outside the clipped container, so an incomplete last row
        needs no filler cells for the lines to look right.
      */}
      <div className="mt-6 overflow-hidden rounded-[28px] border border-line bg-card shadow-[var(--lift)]">
        <ul className="-mb-px -mr-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((item) => (
            <li
              key={item.name}
              className="flex min-w-0 flex-col border-b border-r border-line p-1.5 sm:p-2"
            >
              <div className="dots fit-stage grid h-40 place-items-center overflow-x-auto rounded-[16px] bg-stage px-4">
                <pre className="wire fit" style={{ "--cols": widest(item.glyph) }}>
                  {item.glyph}
                </pre>
              </div>
              <div className="flex-1 px-3 pb-2 pt-3">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-sm text-muted">{item.note}</p>
              </div>
            </li>
          ))}
          <li
            aria-hidden="true"
            className={`min-w-0 border-b border-r border-line p-1.5 sm:p-2 ${fillerClasses(visible.length)}`}
          >
            <div className="dots flex flex-1 items-center justify-center rounded-[16px] bg-stage px-4 py-10 text-sm text-muted">
              + more to come
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
