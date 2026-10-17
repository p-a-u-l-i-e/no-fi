"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

  const link = (key, label, href, isActive) => (
    <Link
      key={key}
      href={href}
      aria-current={isActive ? (key === "changelog" ? "page" : "true") : undefined}
      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors duration-150 ${
        isActive ? "bg-chip text-ink" : "text-muted hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      {sections.map(([label, id]) =>
        link(id, label, home ? `#${id}` : `/#${id}`, home && active === id),
      )}
      {link("changelog", "Changelog", "/changelog", pathname.startsWith("/changelog"))}
    </>
  );
}
