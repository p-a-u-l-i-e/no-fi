import { entries } from "../lib/changelog";
import { skillFiles } from "../lib/skill";
import { REPO, REPO_URL, SITE_URL } from "../site-config";

export const dynamic = "force-static";

export function GET() {
  const latest = entries[0];
  const files = skillFiles().map((file) => `- [${file}](${SITE_URL}/no-fi/${file})`);
  const body = [
    "# no-fi",
    "",
    "> no-fi is a free, open-source agent skill that draws low-fidelity UI wireframes and charts as plain monospaced text, so teams discuss layout, content, and flow instead of color and type.",
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
    "Q: How do I get an AI agent to draw a wireframe as text?",
    "A: Install the no-fi skill, then ask for a wireframe, layout sketch, screen flow, or dashboard. It answers with a text wireframe in a code block.",
    "",
    "Q: What does a no-fi wireframe look like?",
    "A: An 80-column drawing made of box-drawing characters. The outer frame uses double lines and every box inside uses single lines. Bars and charts use block characters. There is no emoji, color, or image.",
    "",
    "Q: How do I know a wireframe is drawn correctly?",
    "A: Run `npx no-fi-skill check wireframe.txt`, or `node no-fi/scripts/check_wireframe.mjs wireframe.txt` once installed (a Python version gives the same output). It fails on broken or misaligned boxes, unsupported characters, and bars that disagree with their values.",
    "",
    "Q: How is no-fi different from Figma, Balsamiq, or Excalidraw?",
    "A: Those are visual tools. no-fi is text, so an agent can write it, it fits in chat, docs, issues, and commit messages, and it diffs in git. It has no visual style for people to argue about.",
    "",
    "## Pages",
    "",
    `- [Home](${SITE_URL}/): rules, vocabulary, example screens, and install commands`,
    `- [Changelog](${SITE_URL}/changelog): what changed in the skill`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
