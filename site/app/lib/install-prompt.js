import { SITE_URL } from "../site-config";
import { skillFiles } from "./skill";

export function installPrompt() {
  const files = skillFiles().map((file) => `- ${SITE_URL}/no-fi/${file}`);
  return [
    "Install the no-fi skill, which draws UI wireframes as plain text.",
    "",
    "1. Download each file below and read it before saving anything.",
    "2. Save them under ~/.claude/skills/no-fi/, keeping the same relative paths after /no-fi/.",
    "3. Tell me what you installed. Do not run any script until I ask.",
    "",
    ...files,
  ].join("\n");
}
