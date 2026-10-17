// Copies ../no-fi into public/no-fi so every skill file is served as a raw,
// readable URL. Runs before dev and build.
import fs from "node:fs";
import path from "node:path";
import { skillFiles, SKILL_DIR } from "../app/lib/skill.js";

const dest = path.join(process.cwd(), "public", "no-fi");
fs.rmSync(dest, { recursive: true, force: true });
for (const file of skillFiles()) {
  const target = path.join(dest, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(SKILL_DIR, file), target);
}
