#!/usr/bin/env node
// Check that every vocabulary element appears in at least one example.
//
// Each element in vocabulary.json lists one or more regex patterns. An element
// is covered when every one of its patterns matches somewhere in the examples.
//
// This is a port of check_coverage.py. Keep the two in step.
//
// Usage: node check_coverage.mjs [VOCABULARY_JSON EXAMPLES_DIR]
// Exit status is 0 when everything is covered, 1 otherwise.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkText } from "./check_wireframe.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadExamples(directory) {
  return Object.fromEntries(
    fs
      .readdirSync(directory)
      .filter((name) => name.endsWith(".txt"))
      .sort()
      .map((name) => [name, fs.readFileSync(path.join(directory, name), "utf8")]),
  );
}

// Examples that match every pattern, or an empty list if any pattern is unmatched.
function usedIn(item, examples) {
  const found = new Set();
  for (const pattern of item.patterns) {
    const regex = new RegExp(pattern, "m");
    const hits = Object.keys(examples).filter((name) => regex.test(examples[name]));
    if (hits.length === 0) return [];
    hits.forEach((name) => found.add(name));
  }
  return [...found].sort();
}

function main(argv) {
  const vocabulary = argv[0] ?? path.join(ROOT, "vocabulary.json");
  const examplesDir = argv[1] ?? path.join(ROOT, "examples");
  const data = JSON.parse(fs.readFileSync(vocabulary, "utf8"));
  const examples = loadExamples(examplesDir);

  const missing = [];
  for (const item of data.items) {
    const hits = usedIn(item, examples);
    const status = hits.length ? "ok  " : "MISS";
    console.log(`${status} ${item.group.padEnd(10)} ${item.name.padEnd(13)} ${hits.join(", ")}`);
    if (hits.length === 0) missing.push(item.name);
  }

  const total = data.items.length;
  console.log(`\n${total - missing.length} of ${total} elements covered by ${Object.keys(examples).length} examples`);

  // The drawings in the vocabulary must pass the same checks as the screens.
  const badGlyphs = data.items.flatMap((item) =>
    checkText(item.glyph).map((error) => `${item.name}: ${error}`),
  );
  if (badGlyphs.length) {
    console.log("\nInvalid glyphs in vocabulary.json:");
    for (const line of badGlyphs) console.log(`  ${line}`);
  } else {
    console.log(`All ${total} vocabulary drawings pass the wireframe checks`);
  }

  if (missing.length) console.log("Not covered: " + missing.join(", "));
  return missing.length || badGlyphs.length ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
