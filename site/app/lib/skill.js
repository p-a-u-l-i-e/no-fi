import fs from "node:fs";
import path from "node:path";

export const SKILL_DIR = path.join(process.cwd(), "..", "no-fi");

const skip = new Set(["__pycache__", ".DS_Store"]);

// Relative paths of every file in the skill folder, sorted, SKILL.md first.
export function skillFiles(dir = SKILL_DIR, prefix = "") {
  const files = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !skip.has(entry.name))
    .flatMap((entry) =>
      entry.isDirectory()
        ? skillFiles(path.join(dir, entry.name), `${prefix}${entry.name}/`)
        : [`${prefix}${entry.name}`],
    );
  return files.sort((a, b) => (a === "SKILL.md" ? -1 : b === "SKILL.md" ? 1 : a.localeCompare(b)));
}
