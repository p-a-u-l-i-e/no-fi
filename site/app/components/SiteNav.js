import Link from "next/link";
import NavLinks from "./NavLinks";
import ThemeSwitch from "./ThemeSwitch";

export default function SiteNav() {
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 top-4 z-20 flex justify-center px-4">
      <div className="flex h-12 items-center gap-1 rounded-full border border-line bg-card/80 pl-4 pr-2 shadow-[var(--lift)] backdrop-blur-md">
        <Link href="/" className="mr-2 font-mono text-sm font-medium">
          [no-fi]
        </Link>
        <div className="hidden items-center sm:flex">
          <NavLinks />
        </div>
        <div className="ml-2">
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
