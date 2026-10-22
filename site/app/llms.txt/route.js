import { entries } from "../lib/changelog";
import { faq } from "../lib/faq";
import { skillFiles } from "../lib/skill";
import { REPO, REPO_URL, SITE_URL } from "../site-config";

export const dynamic = "force-static";

export function GET() {
  const latest = entries[0];
  const files = skillFiles().map((file) => `- [${file}](${SITE_URL}/no-fi/${file})`);
  const body = [
    "# no-fi",
    "",
    "> no-fi is a free, open-source agent skill that draws low-fidelity, ASCII-style UI wireframes and charts as plain monospaced text, so teams discuss layout, content, and flow instead of color and type.",
    "",
    `Latest version: ${latest.version} (${latest.date}). License: MIT. Source: ${REPO_URL}`,
    "",
    "## Install",
    "",
    "- With npx: `npx no-fi-skill` (add `--project` to install into the current project)",
    `- With the skills CLI: \`npx skills add ${REPO} --skill no-fi\``,
    "- By hand: copy the `no-fi` folder into `~/.claude/skills/`",
    "- In claude.ai: download the repository as a ZIP and upload it under Settings, Capabilities, Skills",
    "",
    "## Skill files",
    "",
    ...files,
    "",
    "## Questions and answers",
    "",
    ...faq.flatMap(({ question, answer }) => [`Q: ${question}`, `A: ${answer}`, ""]),
    "## Pages",
    "",
    `- [Home](${SITE_URL}/): rules, vocabulary, example screens, install commands, and questions`,
    `- [Changelog](${SITE_URL}/changelog): what changed in the skill`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
