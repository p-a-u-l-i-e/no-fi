"use client";

import { useEffect, useRef } from "react";

const FONT = 'ui-monospace, "SF Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace';
const STEP_X = 8; // lattice spacing in cells
const STEP_Y = 4;
const FADE_FROM = 0.45; // fraction of the height where the lattice starts fading out

// Dotted guides that grow into box-drawing lines near the cursor, fading out
// toward the bottom of the hero. Decorative, so it is hidden from assistive tech.
export default function LatticeBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0, y: 0, active: false };
    let fs, cw, lh, cols, rows, dpr, width, height, heat, rowFade, raf;
    let ink = "#888";
    let visible = true;

    const readColor = () => {
      ink = getComputedStyle(canvas).color;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      fs = width < 600 ? 11 : 13;
      ctx.font = `${fs}px ${FONT}`;
      cw = ctx.measureText("M").width;
      lh = Math.round(fs * 1.25);
      cols = Math.ceil(width / cw) + 1;
      rows = Math.ceil(height / lh) + 1;
      heat = new Float32Array(cols * rows);
      rowFade = new Float32Array(rows);
      for (let y = 0; y < rows; y++) {
        const t = Math.min(1, Math.max(0, (y / rows - FADE_FROM) / (1 - FADE_FROM)));
        rowFade[y] = 1 - t * t * (3 - 2 * t);
      }
    };

    // Radius is in cells. Rows count double because a cell is about twice as tall as wide.
    const stamp = (cx, cy, radius) => {
      const r2 = radius * radius;
      const x0 = Math.max(0, Math.floor(cx - radius));
      const x1 = Math.min(cols - 1, Math.ceil(cx + radius));
      const y0 = Math.max(0, Math.floor(cy - radius / 2));
      const y1 = Math.min(rows - 1, Math.ceil(cy + radius / 2));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const dx = x - cx;
          const dy = (y - cy) * 2;
          const d2 = dx * dx + dy * dy;
          if (d2 > r2) continue;
          const v = 1 - Math.sqrt(d2) / radius;
          const i = y * cols + x;
          if (v > heat[i]) heat[i] = v;
        }
      }
    };

    const draw = (time) => {
      let mx = mouse.x;
      let my = mouse.y;
      let live = mouse.active;
      if (!live && !reduced) {
        // Idle drift for touch screens and before the first pointer move.
        const t = time / 1000;
        mx = width * (0.5 + 0.4 * Math.sin(t * 0.45));
        my = height * (0.4 + 0.2 * Math.sin(t * 0.31 + 1));
        live = true;
      }
      if (live) stamp(mx / cw, my / lh, 16);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${fs}px ${FONT}`;
      ctx.textBaseline = "top";
      ctx.fillStyle = ink;

      for (let y = 0; y < rows; y++) {
        const fade = rowFade[y];
        if (fade < 0.02) continue;
        const onRow = y % STEP_Y === 0;
        for (let x = 0; x < cols; x++) {
          const onCol = x % STEP_X === 0;
          if (!onCol && !onRow) continue;
          const k = heat[y * cols + x];
          let ch;
          let alpha;
          if (onCol && onRow) {
            ch = k > 0.55 ? "┼" : k > 0.05 ? "+" : "·";
            alpha = 0.2 + k * 0.6;
          } else if (k < 0.06) {
            if (onCol ? y % 2 : x % 2) continue;
            ch = "·";
            alpha = 0.14;
          } else {
            ch = onCol ? "│" : "─";
            alpha = 0.14 + k * 0.7;
          }
          ctx.globalAlpha = alpha * fade;
          ctx.fillText(ch, x * cw, y * lh);
        }
      }
      ctx.globalAlpha = 1;
      for (let i = 0; i < heat.length; i++) heat[i] *= 0.93;
    };

    const loop = (time) => {
      if (visible) draw(time);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      if (e.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      mouse.x = x;
      mouse.y = y;
    };
    const onResize = () => {
      resize();
      if (reduced) draw(0);
    };
    const onTheme = () => {
      readColor();
      if (reduced) draw(0);
    };

    readColor();
    resize();
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(canvas);
    const themeWatch = new MutationObserver(onTheme);
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const scheme = matchMedia("(prefers-color-scheme: dark)");

    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", onResize);
    scheme.addEventListener("change", onTheme);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      themeWatch.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      scheme.removeEventListener("change", onTheme);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem] w-full text-ink"
    />
  );
}
