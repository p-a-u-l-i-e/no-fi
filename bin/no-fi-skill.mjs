#!/usr/bin/env node
// npx no-fi-skill            Install the skill into ~/.claude/skills/no-fi.
// npx no-fi-skill --project  Install it into ./.claude/skills/no-fi instead.
// npx no-fi-skill check FILE Run the wireframe checker.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const skill = path.join(root, "plugin", "skills", "no-fi");
const { version } = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const usage = `no-fi ${version}: wireframes without the distraction.

Usage:
  npx no-fi-skill                     Install the skill into ~/.claude/skills/no-fi
  npx no-fi-skill --project           Install it into ./.claude/skills/no-fi
  npx no-fi-skill --force             Replace an existing install
  npx no-fi-skill check FILE [FILE]   Check wireframes

More: https://no-fi.dev`;

const skip = new Set(["__pycache__", ".DS_Store"]);

function install(flags) {
  const project = flags.has("--project");
  const target = path.join(project ? process.cwd() : os.homedir(), ".claude", "skills", "no-fi");
  const shown = project ? "./.claude/skills/no-fi" : "~/.claude/skills/no-fi";
  const exists = fs.existsSync(target);
  if (exists && !flags.has("--force")) {
    console.error(`${shown} already exists. Run again with --force to replace it.`);
    return 1;
  }
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(skill, target, { recursive: true, filter: (src) => !skip.has(path.basename(src)) });
  console.log(`${exists ? "Updated" : "Installed"} no-fi ${version} in ${shown}`);
  return 0;
}

function check(files) {
  const script = path.join(skill, "scripts", "check_wireframe.mjs");
  return spawnSync(process.execPath, [script, ...files], { stdio: "inherit" }).status ?? 1;
}

function main(args) {
  if (args.includes("-h") || args.includes("--help")) {
    console.log(usage);
    return 0;
  }
  if (args.includes("-v") || args.includes("--version")) {
    console.log(version);
    return 0;
  }
  if (args[0] === "check") return check(args.slice(1));

  const flags = new Set(args);
  const unknown = args.filter((arg) => !["--project", "--force"].includes(arg));
  if (unknown.length) {
    console.error(`Unknown argument: ${unknown[0]}\n\n${usage}`);
    return 2;
  }
  return install(flags);
}

process.exit(main(process.argv.slice(2)));
