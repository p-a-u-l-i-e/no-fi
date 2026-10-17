import SiteNav from "../components/SiteNav";

export const metadata = {
  title: "Changelog: no-fi",
  description: "What changed in the no-fi skill, newest first.",
};

// Newest first. Add a new entry at the top. Skill changes only: no site changes.
const entries = [
  {
    version: "0.2.0",
    date: "2026-10-17",
    title: "Block-character charts",
    changes: [
      "Charts now use block characters. Bar charts use █ with the eighths ▏▎▍▌▋▊▉, column charts and sparklines use ▁▂▃▄▅▆▇ for the remainder, and heatmaps use ░▒▓█. The ASCII versions stay as fallbacks.",
      "Rule 1 now allows block characters in progress bars and charts, not only progress bars.",
      "The checkers compare each bar chart row with its value and stated unit, require a legend for shaded heatmaps, and require column charts to say what a row is worth. The Node and Python checkers still give identical output.",
      "The dashboard, spending report, and activity patterns screens are redrawn with the new charts.",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-10-17",
    title: "First release",
    changes: [
      "The no-fi skill: six rules and a 44-element vocabulary for drawing UI as plain text, with box-drawing borders and block characters in progress bars.",
      "Seven example screens, built to use the vocabulary.",
      "Checkers in both Node and Python, with identical output: check_wireframe validates characters, boxes, tables and progress bars. check_coverage confirms every element appears in an example.",
    ],
  },
];

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
