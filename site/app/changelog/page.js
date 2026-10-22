import SiteNav from "../components/SiteNav";
import { entries } from "../lib/changelog";

const title = "Changelog";
const description = "What changed in the no-fi skill, newest first: new vocabulary, chart types, and checker rules.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/changelog" },
  openGraph: { title: "Changelog | no-fi", description, type: "website", url: "/changelog", siteName: "no-fi" },
  twitter: { card: "summary_large_image", title: "Changelog | no-fi", description },
};

export default function ChangelogPage() {
  return (
    <>
      <SiteNav />

      <main className="mx-auto max-w-[720px] px-4 pb-24 pt-32 sm:px-6 sm:pt-40">
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em]">
          Changelog
        </h1>
        <p className="mt-4 text-muted">What changed in the skill, newest first.</p>

        <div className="mt-12 border-t border-line">
          {entries.map((entry) => (
            <article key={entry.version} className="grid gap-4 border-b border-line py-8 sm:grid-cols-[9rem_1fr] sm:gap-8">
              <div className="font-mono text-sm text-muted">
                <p className="text-ink">{entry.version}</p>
                <time dateTime={entry.date}>{entry.date}</time>
              </div>
              <div>
                <h2 className="text-lg font-medium tracking-[-0.01em]">{entry.title}</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-muted marker:text-line">
                  {entry.changes.map((change) => (
                    <li key={change}>{change}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
