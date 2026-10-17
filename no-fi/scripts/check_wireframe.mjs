#!/usr/bin/env node
// Validate a no-fi wireframe.
//
// Characters: printable ASCII, box-drawing characters for borders, and block
// characters for progress bars and charts (see BLOCKS below). Nothing else.
//
// Boxes: the outermost container uses double lines (╔═╗ ║ ╚═╝). Every box nested
// inside it uses single lines (┌─┐ │ └─┘). Each box must close, its sides must line
// up, and its table dividers (┬ ├ ┼ ┤ ┴) must land in the same columns.
//
// Bars and charts:
// - A progress bar's fill must match its percentage.
// - A bar chart row's length must match its value, using the stated unit
//   ("one █ is $100"). Without a stated unit the length is not checked.
// - A heatmap drawn with shade blocks needs a "Low ... High" legend.
// - A column chart needs a stated row value ("one row is $25").
//
// This is a port of check_wireframe.py. Keep the two in step.
//
// Usage: node check_wireframe.mjs FILE [FILE ...]
// Exit status is 0 when every file passes, 1 otherwise.

import fs from "node:fs";
import { fileURLToPath } from "node:url";

// Box styles. Single lines for inner boxes, double lines for the outer frame.
const STYLES = {
  single: { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│", ltee: "├", rtee: "┤", ttee: "┬", btee: "┴", cross: "┼" },
  double: { tl: "╔", tr: "╗", bl: "╚", br: "╝", h: "═", v: "║", ltee: "╠", rtee: "╣", ttee: "╦", btee: "╩", cross: "╬" },
};
const BOX_CHARS = new Set(Object.values(STYLES).flatMap((style) => Object.values(style)));

// Block characters, allowed in progress bars and charts.
const EIGHTHS = "▏▎▍▌▋▊▉"; // horizontal partials, 1/8 to 7/8 of a cell, left to right
const VERTICAL = "▁▂▃▄▅▆▇"; // vertical partials, 1/8 to 7/8 of a cell, bottom to top
const SHADES = "░▒▓"; // heatmap intensity, with █ as the darkest
const BLOCKS = new Set([...(EIGHTHS + VERTICAL + SHADES + "█▮▯")]);

// Progress bars: (filled, empty) pairs. A bar uses one pair, filled first.
const UNICODE_BARS = [["▮", "▯"], ["█", "▒"]];
const BAR_CHARS = UNICODE_BARS.flat().join("");
const UNICODE_BAR = new RegExp(`\\[ ?([${BAR_CHARS}]+) ?\\]`, "g");
const ASCII_BAR = /\[ ?(=+)(-*) ?\]/g;
const ASCII_BORDER = /\+-{3,}\+/;

// Bar chart rows: a bar, then a value. The bar is full blocks and at most one
// partial. Requiring whitespace on both sides keeps progress bars out of it.
const VALUE = "\\$?([\\d,]+(?:\\.\\d+)?)";
const BLOCK_ROW = new RegExp(`(?<=\\s)(█*[${EIGHTHS}]?)\\s+${VALUE}(?=\\s|[│║]|$)`, "g");
const HASH_ROW = new RegExp(`(?<=\\s)(#+)\\s+${VALUE}(?=\\s|[│║]|$)`, "g");
const BLOCK_UNIT = /one █ is \$?([\d,]+(?:\.\d+)?)/;
const HASH_UNIT = /one # is \$?([\d,]+(?:\.\d+)?)/;

const number = (text) => Number(text.replace(/,/g, ""));

// Python's round() sends halves to the even neighbor. Match it so both
// checkers agree on every value.
function pyRound(x) {
  const floor = Math.floor(x);
  const diff = x - floor;
  if (diff < 0.5) return floor;
  if (diff > 0.5) return floor + 1;
  return floor % 2 === 0 ? floor : floor + 1;
}

// Python's {:g}: six significant digits, no trailing zeros.
const fmt = (x) => String(Number(x.toPrecision(6)));

function checkCharacters(lines) {
  const errors = [];
  lines.forEach((line, i) => {
    const lineNo = i + 1;
    const match = ASCII_BORDER.exec(line);
    if (match) {
      errors.push(
        `line ${lineNo} col ${match.index + 1}: ASCII box border, ` +
          "use ╔═╗ for the outer frame and ┌─┐ for inner boxes",
      );
    }
    [...line].forEach((ch, index) => {
      const col = index + 1;
      if (ch === "\t") errors.push(`line ${lineNo} col ${col}: tab character, use spaces`);
      else if (BOX_CHARS.has(ch) || BLOCKS.has(ch)) return;
      else if (!(ch >= " " && ch <= "~")) {
        errors.push(`line ${lineNo} col ${col}: unsupported character '${ch}'`);
      }
    });
  });
  return errors;
}

// If a percentage follows the bar, it must match the fill within half a step.
function checkPercent(lineNo, line, match, filled, total) {
  const after = /^\s*(\d+)%/.exec(line.slice(match.index + match[0].length));
  if (!after || total === 0) return [];
  const stated = Number(after[1]);
  const actual = (100 * filled) / total;
  if (Math.abs(stated - actual) > 50 / total) {
    return [
      `line ${lineNo} col ${match.index + 1}: bar shows ${pyRound(actual)}% ` +
        `(${filled} of ${total}) but the label says ${stated}%`,
    ];
  }
  return [];
}

const count = (text, ch) => [...text].filter((c) => c === ch).length;

function checkBars(lines) {
  const errors = [];
  lines.forEach((line, i) => {
    const lineNo = i + 1;
    for (const match of line.matchAll(UNICODE_BAR)) {
      const run = match[1];
      const styles = UNICODE_BARS.filter((pair) => pair.some((c) => run.includes(c)));
      if (styles.length > 1) {
        errors.push(`line ${lineNo} col ${match.index + 1}: progress bar mixes styles`);
        continue;
      }
      const [filled, empty] = styles[0];
      if (!new RegExp(`^${filled}+${empty}*$`).test(run)) {
        errors.push(
          `line ${lineNo} col ${match.index + 1}: progress bar must put ${filled} before ${empty}`,
        );
        continue;
      }
      errors.push(...checkPercent(lineNo, line, match, count(run, filled), [...run].length));
    }
    for (const match of line.matchAll(ASCII_BAR)) {
      const filled = match[1].length;
      const empty = match[2].length;
      errors.push(...checkPercent(lineNo, line, match, filled, filled + empty));
    }
  });
  return errors;
}

// Bar charts, heatmaps, and column charts.
function checkCharts(lines) {
  const errors = [];
  const text = lines.join("\n");

  const blockUnit = BLOCK_UNIT.exec(text);
  const hashUnit = HASH_UNIT.exec(text);
  lines.forEach((line, i) => {
    const lineNo = i + 1;
    if (blockUnit) {
      const unit = number(blockUnit[1]);
      for (const match of line.matchAll(BLOCK_ROW)) {
        const bar = match[1];
        const value = number(match[2]);
        if (!bar) continue;
        const last = [...bar].at(-1);
        const partial = EIGHTHS.includes(last) ? last : "";
        const eighths = 8 * count(bar, "█") + (partial ? EIGHTHS.indexOf(partial) + 1 : 0);
        const expected = pyRound((value / unit) * 8);
        if (Math.abs(eighths - expected) > 1) {
          errors.push(
            `line ${lineNo} col ${match.index + 1}: bar is ${fmt(eighths / 8)} ` +
              `units but the value ${match[2]} is ${fmt(expected / 8)} units ` +
              `(one █ is ${blockUnit[1]})`,
          );
        }
      }
    }
    if (hashUnit) {
      const unit = number(hashUnit[1]);
      for (const match of line.matchAll(HASH_ROW)) {
        const hashes = match[1].length;
        const value = number(match[2]);
        const expected = pyRound(value / unit);
        if (Math.abs(hashes - expected) > 1) {
          errors.push(
            `line ${lineNo} col ${match.index + 1}: bar has ${hashes} ` +
              `# but the value ${match[2]} is ${expected} units ` +
              `(one # is ${hashUnit[1]})`,
          );
        }
      }
    }
  });

  // A heatmap drawn with shades needs its legend.
  if ((text.includes("░") || text.includes("▓")) && !/Low [░▒▓█ ]+ High/.test(text)) {
    errors.push("heatmap: draw a legend like 'Low ░ ▒ ▓ █ High'");
  }

  // A column chart needs to say what a row is worth.
  if (/─{3}  ─{3}/.test(text) && !text.includes("one row is")) {
    errors.push("column chart: state what one row is worth, e.g. '(one row is $25)'");
  }
  return errors;
}

function charAt(grid, row, col) {
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[row].length) return " ";
  return grid[row][col];
}

function otherStyleChars(name) {
  return new Set(Object.values(STYLES[name === "double" ? "single" : "double"]));
}

// Find every box. A box starts at a top-left corner, runs right along a top
// border to a top-right corner, then down both sides to a bottom border.
// Returns { boxes, errors }. Each box is [row, col, bottom, right, style].
function findBoxes(lines) {
  const grid = lines.map((line) => [...line]);
  const boxes = [];
  const errors = [];
  grid.forEach((line, row) => {
    line.forEach((ch, col) => {
      for (const [name, s] of Object.entries(STYLES)) {
        if (ch !== s.tl) continue;
        const where = `line ${row + 1} col ${col + 1}`;
        const foreign = otherStyleChars(name);

        // Top border.
        let right = col + 1;
        while ([s.h, s.ttee].includes(charAt(grid, row, right))) right++;
        if (charAt(grid, row, right) !== s.tr) {
          if (foreign.has(charAt(grid, row, right))) {
            errors.push(`${where}: top border mixes double and single lines`);
          } else {
            errors.push(`${where}: top border is not closed`);
          }
          continue;
        }

        const dividerCols = [];
        for (let c = col + 1; c < right; c++) if (charAt(grid, row, c) === s.ttee) dividerCols.push(c);

        // Sides and bottom border.
        let bottom = null;
        let failed = false;
        for (let r = row + 1; r < grid.length; r++) {
          const leftCh = charAt(grid, r, col);
          const rightCh = charAt(grid, r, right);

          if (leftCh === s.bl && rightCh === s.br) {
            const segment = [];
            for (let c = col + 1; c < right; c++) segment.push(charAt(grid, r, c));
            if (segment.some((c) => c !== s.h && c !== s.btee)) {
              errors.push(`${where}: bottom border is broken at line ${r + 1}`);
              failed = true;
            } else {
              const bottomCols = [];
              for (let c = col + 1; c < right; c++) if (charAt(grid, r, c) === s.btee) bottomCols.push(c);
              if (bottomCols.join() !== dividerCols.join()) {
                errors.push(`${where}: column dividers at the top and bottom do not line up`);
                failed = true;
              }
            }
            bottom = r;
            break;
          }

          if (foreign.has(leftCh) || foreign.has(rightCh)) {
            errors.push(`${where}: sides mix double and single lines at line ${r + 1}`);
            failed = true;
            break;
          }
          if (![s.v, s.ltee].includes(leftCh) || ![s.v, s.rtee].includes(rightCh)) {
            errors.push(`${where}: box side broken at line ${r + 1}`);
            failed = true;
            break;
          }
          for (const c of dividerCols) {
            if (![s.v, s.cross].includes(charAt(grid, r, c))) {
              errors.push(`${where}: column divider broken at line ${r + 1}`);
              failed = true;
              break;
            }
          }
          if (failed) break;
        }

        if (failed) continue;
        if (bottom === null) {
          errors.push(`${where}: box is never closed`);
          continue;
        }
        boxes.push([row, col, bottom, right, name]);
      }
    });
  });
  return { boxes, errors };
}

function checkBoxes(lines) {
  const { boxes, errors } = findBoxes(lines);
  // Only the outermost container is double-line.
  for (const [row, col, bottom, right, style] of boxes) {
    if (style !== "double") continue;
    for (const [orow, ocol, obottom, oright] of boxes) {
      if (orow < row && ocol < col && obottom > bottom && oright > right) {
        errors.push(
          `line ${row + 1} col ${col + 1}: double-line box is nested inside ` +
            "another box. Only the outermost container uses ╔═╗.",
        );
        break;
      }
    }
  }
  return errors;
}

export function checkText(text) {
  const lines = text.split("\n");
  if (lines.length && lines.at(-1) === "") lines.pop();
  return [
    ...checkCharacters(lines),
    ...checkBars(lines),
    ...checkCharts(lines),
    ...checkBoxes(lines),
  ];
}

export function checkFile(path) {
  return checkText(fs.readFileSync(path, "utf8"));
}

function main(paths) {
  if (paths.length === 0) {
    console.log("Usage: node check_wireframe.mjs FILE [FILE ...]");
    return 2;
  }
  let failed = false;
  for (const path of paths) {
    const errors = checkFile(path);
    if (errors.length) {
      failed = true;
      console.log(`FAIL ${path}`);
      for (const error of errors) console.log(`  ${error}`);
    } else {
      console.log(`OK   ${path}`);
    }
  }
  return failed ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
