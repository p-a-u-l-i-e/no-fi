import { SITE_URL } from "../site-config";

export function installPrompt() {
  return [
    "Install the no-fi skill, which draws UI wireframes as plain text.",
    "",
    "Run `npx no-fi-skill` to copy it into ~/.claude/skills/no-fi.",
    "If you can't run npx, download the files listed under \"Skill files\" at",
    `${SITE_URL}/llms.txt into ~/.claude/skills/no-fi/, keeping their paths.`,
    "",
    "Tell me what you installed. Do not run any of its scripts until I ask.",
  ].join("\n");
}
