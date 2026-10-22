"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FluidHoverHighlight } from "@/components/fluid-hover-highlight";
import { useFluidHover, useRegisterFluidHoverItem } from "@/hooks/use-fluid-hover";
import { spring } from "@/lib/springs";

const sections = [
  ["Rules", "rules"],
  ["Vocabulary", "vocabulary"],
  ["Examples", "examples"],
  ["Install", "get-started"],
];

// On the home page a section is active while it spans the line 35% down the
// viewport. On other pages the section links go back to the home page.
export default function NavLinks() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!home) return;
    const elements = sections
      .map(([, id]) => document.getElementById(id))
      .filter(Boolean);

    const update = () => {
      const line = window.innerHeight * 0.35;
      const current = elements.find((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top <= line && rect.bottom > line;
      });
      setActive(current ? current.id : null);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [home]);

  const listRef = useRef(null);
  const hover = useFluidHover(listRef, { axis: "x" });

  const link = (key, label, href, isActive, index) => (
    <NavLink
      key={key}
      index={index}
      registerItem={hover.registerItem}
      href={href}
      aria-current={isActive ? (key === "changelog" ? "page" : "true") : undefined}
      className={`relative inline-flex h-9 items-center whitespace-nowrap rounded-full px-3 text-sm transition-colors duration-80 ${
        isActive ? "text-ink" : "text-muted hover:text-ink"
      }`}
    >
      {/* One pill for the whole nav. It slides to the active link instead of
          blinking off one and on another. */}
      {isActive ? (
        <motion.span
          layoutId="nav-pill"
          transition={spring.moderate}
          className="absolute inset-0 rounded-full bg-chip"
        />
      ) : null}
      <span className="relative">{label}</span>
    </NavLink>
  );

  return (
    <div ref={listRef} className="relative flex items-center" {...hover.handlers}>
      <FluidHoverHighlight hover={hover} className="rounded-full bg-chip/50" />
      {sections.map(([label, id], index) =>
        link(id, label, home ? `#${id}` : `/#${id}`, home && active === id, index),
      )}
      {link(
        "changelog",
        "Changelog",
        "/changelog",
        pathname.startsWith("/changelog"),
        sections.length,
      )}
    </div>
  );
}

// A nav link that joins the nav's gliding hover.
function NavLink({ index, registerItem, ...props }) {
  const ref = useRef(null);
  useRegisterFluidHoverItem(registerItem, index, ref);
  return <Link ref={ref} {...props} />;
}
