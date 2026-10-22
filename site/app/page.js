import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import CopyButton from "./components/CopyButton";
import LatticeBackground from "./components/LatticeBackground";
import RuntimeCard from "./components/RuntimeCard";
import SiteNav from "./components/SiteNav";
import VocabularyGrid from "./components/VocabularyGrid";
import { entries } from "./lib/changelog";
import { installPrompt } from "./lib/install-prompt";
import { REPO_URL, SITE_URL } from "./site-config";

const content = (...parts) => path.join(process.cwd(), "content", ...parts);
const readExample = (file) => fs.readFileSync(content("examples", file), "utf8");
const vocabulary = JSON.parse(fs.readFileSync(content("vocabulary.json"), "utf8"));

const hero = {
  title: "Fintech dashboard",
  note: "Overview screen with KPI cards, trends, a category chart, and an alert.",
  file: "fintech-dashboard.txt",
};

// Narrow screens pair up. Wide ones take a full row.
const examples = [
  {
    title: "Send money",
    note: "A form with a field error, a disabled action, and the tooltip that explains why.",
    file: "send-money-form.txt",
  },
  {
    title: "Notification settings",
    note: "Toggles, checkboxes, radios, a slider, accordions, and a progress bar.",
    file: "settings-notifications.txt",
  },
  {
    title: "Transactions",
    note: "Search, an open filter menu, tags, a sortable table with badges and avatars, and pagination.",
    file: "transactions-table.txt",
    wide: true,
  },
  {
    title: "Spending report",
    note: "A line chart, a bar chart, a stacked bar, a delta, and budget progress.",
    file: "spending-report.txt",
    wide: true,
  },
  {
    title: "Activity patterns",
    note: "A column chart, a heatmap, sparkline trends, and an annotation.",
    file: "activity-patterns.txt",
    wide: true,
  },
  {
    title: "Card details",
    note: "A placeholder, accordions, skeleton loading, a modal, and a toast.",
    file: "card-details.txt",
    wide: true,
  },
];

const screens = [hero, ...examples].map((screen) => ({ ...screen, text: readExample(screen.file) }));

// An element is used by a screen when any of its patterns match that screen.
// The coverage script in no-fi/scripts applies the same patterns.
const matches = (item, text) =>
  item.patterns.some((pattern) => new RegExp(pattern, "m").test(text));

const items = vocabulary.items;
const uncovered = items.filter(
  (item) => !screens.some((screen) => matches(item, screen.text)),
).length;

const rules = [
  [
    "Plain characters",
    "Letters, digits, and punctuation, plus box-drawing for borders and block characters for progress bars and charts. No emoji, no tabs.",
  ],
  [
    "Double outside, single inside",
    "The outer container is ╔═╗ and every box inside it is ┌─┐.",
  ],
  ["Fixed width", "80 characters or fewer, and every box the same width on every row."],
  ["Describe, don't decorate", "No color, fonts, or icons. Name visuals in words below the drawing."],
  [
    "Draw it like the UI",
    "An input is one line, a textarea has a grip, a badge is a pill. Use the vocabulary, don't invent symbols.",
  ],
  [
    "Validate before sharing",
    "The checker fails on broken borders, unsupported characters, nested double lines, and bars that disagree with their percentage or value.",
  ],
];

const prompt = installPrompt();

// Three ways in. The prompt is shown as plain text so it can be read before pasting.
const installOptions = [
  {
    id: "prompt",
    title: "Copy install prompt",
    note: "Paste it into Claude Code or any agent. It lists every file as a readable URL.",
    command: prompt,
    prompt: true,
  },
  {
    id: "npx",
    title: "Install with npx",
    note: "Copies the skill into ~/.claude/skills. Add --project for this repo only.",
    command: "npx no-fi-skill",
  },
  {
    id: "manual",
    title: "Copy it yourself",
    note: "Copy the folder into your Claude skills directory.",
    command: "cp -R no-fi ~/.claude/skills/",
  },
];

const commands = [
  {
    title: "Check a wireframe",
    note: "Fails on unsupported characters, broken or misaligned boxes, and wrong progress bars.",
    commands: {
      node: "node no-fi/scripts/check_wireframe.mjs wireframe.txt",
      python: "python3 no-fi/scripts/check_wireframe.py wireframe.txt",
    },
    id: "check",
  },
  {
    title: "Check vocabulary coverage",
    note: "Confirms every element appears in at least one example screen.",
    commands: {
      node: "node no-fi/scripts/check_coverage.mjs",
      python: "python3 no-fi/scripts/check_coverage.py",
    },
    id: "coverage",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "no-fi",
  description:
    "An agent skill that draws low-fidelity UI wireframes and charts as plain text, so teams discuss layout, content, and flow instead of color and type.",
  url: SITE_URL,
  applicationCategory: "DesignApplication",
  operatingSystem: "Any",
  softwareVersion: entries[0].version,
  dateModified: entries[0].date,
  license: "https://opensource.org/licenses/MIT",
  codeRepository: REPO_URL,
  sameAs: [REPO_URL],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "Incomparable", url: "https://incomparable.design" },
};

function CommandCard({ item }) {
  return (
    <article className="flex min-w-0 flex-col rounded-[28px] border border-line bg-card p-2 shadow-[var(--lift)]">
      <div
        className={`flex h-28 flex-none items-center rounded-[20px] bg-stage p-6 ${item.prompt ? "overflow-hidden" : "overflow-x-auto"}`}
      >
        {item.prompt ? (
          <pre className="line-clamp-3 min-w-0 whitespace-pre-wrap font-mono text-[13px] leading-6 [overflow-wrap:anywhere]">
            {item.command}
          </pre>
        ) : (
          <pre className="overflow-x-auto font-mono text-[13px] leading-6">
            <span className="select-none text-muted">$ </span>
            {item.command}
          </pre>
        )}
      </div>
      <CardFooter
        title={item.title}
        note={item.note}
        copyText={item.command}
        copyLabel={item.prompt ? "Copy prompt" : undefined}
      />
    </article>
  );
}

function Heading({ lead, children, id }) {
  return (
    <h2
      id={id}
      className="max-w-[26ch] text-[clamp(1.5rem,3.2vw,2.125rem)] font-medium leading-[1.15] tracking-[-0.01em] text-muted"
    >
      <span className="text-ink">{lead}</span> {children}
    </h2>
  );
}

function Stage({ children, dotted = true }) {
  return (
    <div
      className={`fit-stage flex flex-1 flex-col justify-center overflow-x-auto rounded-[20px] bg-stage p-3 sm:p-10 ${dotted ? "dots" : ""}`}
    >
      {children}
    </div>
  );
}

const widest = (text) => Math.max(...text.split("\n").map((line) => [...line].length));

function Wireframe({ text, label }) {
  return (
    <pre
      aria-label={label}
      style={{ "--cols": widest(text) }}
      className="wire fit mx-auto w-max text-ink"
    >
      {text}
    </pre>
  );
}

function CardFooter({ title, note, copyText, copyLabel, uses }) {
  return (
    <div className="px-3 pb-2 pt-4 sm:px-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-sm text-muted">{note}</p>
        </div>
        {copyText ? <CopyButton text={copyText} label={copyLabel} /> : null}
      </div>
      {uses && uses.length > 0 ? (
        <details className="group mt-3 text-sm">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-muted transition-colors duration-80 hover:text-ink">
            <span aria-hidden="true" className="inline-block transition-transform duration-160 group-open:rotate-90">
              &gt;
            </span>
            Uses {uses.length} elements
          </summary>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {uses.map((name) => (
              <li
                key={name}
                className="rounded-full bg-chip px-2.5 py-1 text-xs text-ink"
              >
                {name}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

function usesOf(text) {
  return items.filter((item) => matches(item, text)).map((item) => item.name);
}

export default function Page() {
  const heroScreen = screens[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-30 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-page"
      >
        Skip to content
      </a>

      <SiteNav />
      <LatticeBackground />

      <main id="main" className="mx-auto max-w-[1120px] px-3 pb-24 pt-32 sm:px-6 sm:pt-40">
        <header id="top" className="text-center">
          <h1 className="mx-auto max-w-[16ch] text-balance text-[clamp(2.25rem,6vw,3.75rem)] font-medium leading-[1.04] tracking-[-0.015em]">
            Wireframes without the distraction.
          </h1>
          <p className="mx-auto mt-5 max-w-[50ch] text-pretty text-base leading-6 text-muted sm:text-[17px] sm:leading-7">
            no-fi is an agent skill that draws UI as plain text, so a team argues
            about layout and flow instead of color and type.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#get-started"
              className="inline-flex h-9 items-center whitespace-nowrap btn btn-primary rounded-full px-5 text-sm font-medium text-page"
            >
              Install the skill
            </a>
            <a
              href="#examples"
              className="inline-flex h-9 items-center whitespace-nowrap btn btn-secondary rounded-full px-5 text-sm font-medium"
            >
              See examples
            </a>
          </div>
        </header>

        <section
          aria-label={hero.title}
          className="mt-16 flex flex-col rounded-[28px] border border-line bg-card p-1.5 shadow-[var(--lift)] sm:p-2 sm:mt-20"
        >
          <Stage>
            <Wireframe text={heroScreen.text} label={`${hero.title} wireframe`} />
          </Stage>
          <CardFooter
            title={hero.title}
            note={hero.note}
            copyText={heroScreen.text}
            uses={usesOf(heroScreen.text)}
          />
        </section>

        <section id="rules" className="mt-28 sm:mt-36">
          <Heading lead="Six rules" id="rules-heading">
            that keep every wireframe readable.
          </Heading>
          <ol className="mt-10 border-t border-line">
            {rules.map(([title, body], index) => (
              <li
                key={title}
                className="grid gap-1 border-b border-line py-6 sm:grid-cols-[6rem_minmax(0,18rem)_1fr] sm:gap-6"
              >
                <span
                  aria-hidden="true"
                  className="whitespace-pre font-mono text-sm leading-none tracking-[-0.1em] text-muted/60"
                >
                  {"┌────┐\n│ "}
                  <span className="text-ink">{String(index + 1).padStart(2, "0")}</span>
                  {" │\n└────┘"}
                </span>
                <h3 className="text-lg font-medium tracking-[-0.01em]">{title}</h3>
                <p className="text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="vocabulary" className="mt-28 sm:mt-36">
          <Heading lead="One vocabulary" id="vocabulary-heading">
            that looks like the interface it describes.
          </Heading>
          <p className="mt-4 max-w-[60ch] text-muted">
            {items.length} elements in {vocabulary.groups.length} groups. Inputs and
            textareas are different shapes. A badge is a pill. An alert is a box with
            an icon, not a stray character.
          </p>
          <VocabularyGrid groups={vocabulary.groups} items={items} />
        </section>

        <section id="examples" className="mt-28 sm:mt-36">
          <Heading lead="Real screens," id="examples-heading">
            drawn in text before anything else.
          </Heading>
          <p className="mt-4 max-w-[60ch] text-muted">
            {screens.length} screens, built to use the whole vocabulary.{" "}
            {uncovered === 0
              ? `All ${items.length} elements appear in at least one.`
              : `${uncovered} elements are not used yet.`}{" "}
            Open a card to see which elements it uses.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {examples.map((example, index) => {
              const text = screens[index + 1].text;
              return (
                <article
                  key={example.file}
                  className={`flex min-w-0 flex-col rounded-[28px] border border-line bg-card p-1.5 shadow-[var(--lift)] sm:p-2 ${
                    example.wide ? "lg:col-span-2" : ""
                  }`}
                >
                  <Stage>
                    <Wireframe text={text} label={`${example.title} wireframe`} />
                  </Stage>
                  <CardFooter
                    title={example.title}
                    note={example.note}
                    copyText={text}
                    uses={usesOf(text)}
                  />
                </article>
              );
            })}
          </div>
        </section>

        <section id="get-started" className="mt-28 sm:mt-36">
          <Heading lead="A few commands" id="get-started-heading">
            to start drawing.
          </Heading>
          <p className="mt-4 max-w-[60ch] text-muted">
            Every file is plain text you can read first. The source is on{" "}
            <a className="underline underline-offset-4 hover:text-ink" href={REPO_URL}>
              GitHub
            </a>
            . On claude.ai, use the repository&apos;s Download ZIP and upload it under
            Settings, Capabilities, Skills.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {installOptions.map((item) => (
              <CommandCard key={item.id} item={item} />
            ))}
          </div>
          <h3 className="mt-12 text-lg font-medium tracking-[-0.01em]">Then check your work</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {commands.map((item) => (
              <RuntimeCard key={item.id} title={item.title} note={item.note} commands={item.commands} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-muted sm:px-6">
          <p>
            <span className="font-mono text-ink">[no-fi]</span> Draw it in text first.
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link className="hover:text-ink" href="/changelog">
              Changelog
            </Link>
            <a className="hover:text-ink" href={REPO_URL}>
              Source
            </a>
            <a
              className="inline-flex items-center gap-2 hover:text-ink"
              href="https://incomparable.design"
            >
              Built by
              <span
                aria-hidden="true"
                className="h-5 w-[13px] bg-ink"
                style={{
                  maskImage: "url(/incomparable.svg)",
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskImage: "url(/incomparable.svg)",
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                }}
              />
              <span className="text-ink">Incomparable</span>
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
