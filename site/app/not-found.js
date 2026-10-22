import Link from "next/link";
import SiteNav from "./components/SiteNav";

export const metadata = {
  title: "Page not found",
};

// Each digit is five rows of block characters, eight columns wide.
const font = {
  4: ["██    ██", "██    ██", "████████", "      ██", "      ██"],
  0: ["████████", "██    ██", "██    ██", "██    ██", "████████"],
};

const digits = [0, 1, 2, 3, 4]
  .map((row) => ["4", "0", "4"].map((d) => font[d][row]).join("   "))
  .join("\n");

export default function NotFound() {
  return (
    <>
      <SiteNav />

      <main className="mx-auto flex min-h-svh max-w-[1120px] flex-col items-center justify-center px-4 pb-24 pt-32 text-center sm:px-6">
        <pre
          aria-hidden="true"
          className="wire text-[clamp(14px,4.5vw,28px)] leading-none text-ink"
        >
          {digits}
        </pre>
        <h1 className="mt-10 text-[clamp(1.5rem,3.2vw,2.125rem)] font-medium leading-[1.15] tracking-[-0.01em]">
          Page not found
        </h1>
        <p className="mt-3 text-muted">Nothing is drawn at this address yet.</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-10 items-center whitespace-nowrap rounded-full bg-ink px-5 text-sm font-medium text-page transition-opacity duration-150 hover:opacity-85"
        >
          Back to home
        </Link>
      </main>
    </>
  );
}
