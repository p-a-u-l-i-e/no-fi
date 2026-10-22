#!/usr/bin/env python3
"""Validate a no-fi wireframe.

Characters: printable ASCII, box-drawing characters for borders, and block
characters for progress bars and charts (see BLOCKS below), and rounded corners
where a line chart turns. Nothing else.

Boxes: the outermost container uses double lines (╔═╗ ║ ╚═╝). Every box nested
inside it uses single lines (┌─┐ │ └─┘). Each box must close, its sides must line
up, and its table dividers (┬ ├ ┼ ┤ ┴) must land in the same columns.

Bars and charts:
- A progress bar's fill must match its percentage.
- A bar chart row's length must match its value, using the stated unit
  ("one █ is $100"). Without a stated unit the length is not checked.
- A chart drawn with shade blocks needs a legend: "Low ... High" for a
  heatmap, or one naming every shade ("█ Food  ▓ Home") for stacked columns.
- A column chart needs a stated row value ("one row is $25"), unless its
  legend names its shades (stacked columns).

Usage: check_wireframe.py FILE [FILE ...]
Exit status is 0 when every file passes, 1 otherwise.
"""

import re
import sys

# Box styles. Single lines for inner boxes, double lines for the outer frame.
STYLES = {
    "single": dict(
        tl="┌", tr="┐", bl="└", br="┘", h="─", v="│",
        ltee="├", rtee="┤", ttee="┬", btee="┴", cross="┼",
    ),
    "double": dict(
        tl="╔", tr="╗", bl="╚", br="╝", h="═", v="║",
        ltee="╠", rtee="╣", ttee="╦", btee="╩", cross="╬",
    ),
}
BOX_CHARS = {c for style in STYLES.values() for c in style.values()}

# Block characters, allowed in progress bars and charts.
EIGHTHS = "▏▎▍▌▋▊▉"  # horizontal partials, 1/8 to 7/8 of a cell, left to right
VERTICAL = "▁▂▃▄▅▆▇"  # vertical partials, 1/8 to 7/8 of a cell, bottom to top
SHADES = "░▒▓"  # heatmap intensity and stacked segments, with █ as the darkest
BLOCKS = set(EIGHTHS + VERTICAL + SHADES + "█▮▯")

# Rounded corners, allowed where a line chart turns.
CURVES = set("╭╮╰╯")

# Progress bars: (filled, empty) pairs. A bar uses one pair, filled first.
UNICODE_BARS = (("▮", "▯"), ("█", "▒"))
BAR_CHARS = "".join(filled + empty for filled, empty in UNICODE_BARS)
UNICODE_BAR = re.compile(r"\[ ?([" + BAR_CHARS + r"]+) ?\]")
ASCII_BAR = re.compile(r"\[ ?(=+)(-*) ?\]")
ASCII_BORDER = re.compile(r"\+-{3,}\+")

# Bar chart rows: a bar, then a value. The bar is full blocks and at most one
# partial. Requiring whitespace on both sides keeps progress bars out of it.
VALUE = r"\$?([\d,]+(?:\.\d+)?)"
BLOCK_ROW = re.compile(r"(?<=\s)(█*[" + EIGHTHS + r"]?)\s+" + VALUE + r"(?=\s|[│║]|$)")
HASH_ROW = re.compile(r"(?<=\s)(#+)\s+" + VALUE + r"(?=\s|[│║]|$)")
BLOCK_UNIT = re.compile(r"one █ is \$?([\d,]+(?:\.\d+)?)")
HASH_UNIT = re.compile(r"one # is \$?([\d,]+(?:\.\d+)?)")
SHADE_KEY = re.compile(r"([█░▒▓]) [A-Z]")


def number(text):
    return float(text.replace(",", ""))


def check_characters(lines):
    errors = []
    for number_, line in enumerate(lines, 1):
        match = ASCII_BORDER.search(line)
        if match:
            errors.append(
                f"line {number_} col {match.start() + 1}: ASCII box border, "
                "use ╔═╗ for the outer frame and ┌─┐ for inner boxes"
            )
        for index, ch in enumerate(line):
            col = index + 1
            if ch == "\t":
                errors.append(f"line {number_} col {col}: tab character, use spaces")
            elif ch in BOX_CHARS or ch in BLOCKS or ch in CURVES:
                continue
            elif not (" " <= ch <= "~"):
                errors.append(f"line {number_} col {col}: unsupported character {ch!r}")
    return errors


def check_percent(line_number, line, match, filled, total):
    """If a percentage follows the bar, it must match the fill within half a step."""
    after = re.match(r"\s*(\d+)%", line[match.end():])
    if not after or total == 0:
        return []
    stated = int(after.group(1))
    actual = 100 * filled / total
    if abs(stated - actual) > 50 / total:
        return [
            f"line {line_number} col {match.start() + 1}: bar shows {actual:.0f}% "
            f"({filled} of {total}) but the label says {stated}%"
        ]
    return []


def check_bars(lines):
    """Progress bars."""
    errors = []
    for line_number, line in enumerate(lines, 1):
        for match in UNICODE_BAR.finditer(line):
            run = match.group(1)
            styles = [pair for pair in UNICODE_BARS if any(c in run for c in pair)]
            if len(styles) > 1:
                errors.append(
                    f"line {line_number} col {match.start() + 1}: progress bar mixes styles"
                )
                continue
            filled, empty = styles[0]
            if not re.fullmatch(f"{filled}+{empty}*", run):
                errors.append(
                    f"line {line_number} col {match.start() + 1}: "
                    f"progress bar must put {filled} before {empty}"
                )
                continue
            errors += check_percent(line_number, line, match, run.count(filled), len(run))
        for match in ASCII_BAR.finditer(line):
            filled, empty = len(match.group(1)), len(match.group(2))
            errors += check_percent(line_number, line, match, filled, filled + empty)
    return errors


def check_charts(lines):
    """Bar charts, heatmaps, column charts, and stacked columns."""
    errors = []
    text = "\n".join(lines)

    block_unit = BLOCK_UNIT.search(text)
    hash_unit = HASH_UNIT.search(text)
    for line_number, line in enumerate(lines, 1):
        if block_unit:
            unit = number(block_unit.group(1))
            for match in BLOCK_ROW.finditer(line):
                bar, value = match.group(1), number(match.group(2))
                if not bar:
                    continue
                partial = bar[-1] if bar[-1] in EIGHTHS else ""
                eighths = 8 * bar.count("█") + (EIGHTHS.index(partial) + 1 if partial else 0)
                expected = round(value / unit * 8)
                if abs(eighths - expected) > 1:
                    errors.append(
                        f"line {line_number} col {match.start() + 1}: bar is {eighths / 8:g} "
                        f"units but the value {match.group(2)} is {expected / 8:g} units "
                        f"(one █ is {block_unit.group(1)})"
                    )
        if hash_unit:
            unit = number(hash_unit.group(1))
            for match in HASH_ROW.finditer(line):
                count = len(match.group(1))
                value = number(match.group(2))
                expected = round(value / unit)
                if abs(count - expected) > 1:
                    errors.append(
                        f"line {line_number} col {match.start() + 1}: bar has {count} "
                        f"# but the value {match.group(2)} is {expected} units "
                        f"(one # is {hash_unit.group(1)})"
                    )

    # A chart drawn with shades needs its legend. Progress bars use ▒ too, so
    # leave them out.
    charted = UNICODE_BAR.sub("", text)
    if ("░" in charted or "▓" in charted) and not re.search(r"Low [░▒▓█ ]+ High", text):
        named = set(SHADE_KEY.findall(text))
        missing = [c for c in SHADES if c in charted and c not in named]
        if not named:
            errors.append(
                "shaded chart: draw a legend, 'Low ░ ▒ ▓ █ High' for a heatmap "
                "or '█ Food  ▓ Home' for stacked columns"
            )
        elif missing:
            errors.append(f"stacked columns: the legend is missing {' '.join(missing)}")

    # A column chart needs to say what a row is worth.
    # Stacked columns name their shades instead.
    if re.search(r"─{3}  ─{3}", text) and "one row is" not in text and not SHADE_KEY.search(text):
        errors.append("column chart: state what one row is worth, e.g. '(one row is $25)'")
    return errors


def char_at(grid, row, col):
    if row < 0 or row >= len(grid) or col < 0 or col >= len(grid[row]):
        return " "
    return grid[row][col]


def other_style_chars(name):
    other = "single" if name == "double" else "double"
    return set(STYLES[other].values())


def find_boxes(grid):
    """Find every box. A box starts at a top-left corner, runs right along a
    top border to a top-right corner, then down both sides to a bottom border.
    Returns (boxes, errors). Each box is (row, col, bottom, right, style)."""
    boxes, errors = [], []
    for row, line in enumerate(grid):
        for col, ch in enumerate(line):
            for name, s in STYLES.items():
                if ch != s["tl"]:
                    continue
                where = f"line {row + 1} col {col + 1}"
                foreign = other_style_chars(name)

                # Top border.
                right = col + 1
                while char_at(grid, row, right) in (s["h"], s["ttee"]):
                    right += 1
                if char_at(grid, row, right) != s["tr"]:
                    if char_at(grid, row, right) in foreign:
                        errors.append(f"{where}: top border mixes double and single lines")
                    else:
                        errors.append(f"{where}: top border is not closed")
                    continue

                divider_cols = [
                    c for c in range(col + 1, right) if char_at(grid, row, c) == s["ttee"]
                ]

                # Sides and bottom border.
                bottom, failed = None, False
                for r in range(row + 1, len(grid)):
                    left_ch = char_at(grid, r, col)
                    right_ch = char_at(grid, r, right)

                    if left_ch == s["bl"] and right_ch == s["br"]:
                        segment = [char_at(grid, r, c) for c in range(col + 1, right)]
                        if any(c not in (s["h"], s["btee"]) for c in segment):
                            errors.append(f"{where}: bottom border is broken at line {r + 1}")
                            failed = True
                        else:
                            bottom_cols = [
                                c for c in range(col + 1, right)
                                if char_at(grid, r, c) == s["btee"]
                            ]
                            if bottom_cols != divider_cols:
                                errors.append(
                                    f"{where}: column dividers at the top and bottom "
                                    "do not line up"
                                )
                                failed = True
                        bottom = r
                        break

                    if left_ch in foreign or right_ch in foreign:
                        errors.append(f"{where}: sides mix double and single lines at line {r + 1}")
                        failed = True
                        break
                    if left_ch not in (s["v"], s["ltee"]) or right_ch not in (s["v"], s["rtee"]):
                        errors.append(f"{where}: box side broken at line {r + 1}")
                        failed = True
                        break
                    for c in divider_cols:
                        if char_at(grid, r, c) not in (s["v"], s["cross"]):
                            errors.append(
                                f"{where}: column divider broken at line {r + 1}"
                            )
                            failed = True
                            break
                    if failed:
                        break

                if failed:
                    continue
                if bottom is None:
                    errors.append(f"{where}: box is never closed")
                    continue
                boxes.append((row, col, bottom, right, name))
    return boxes, errors


def check_boxes(lines):
    boxes, errors = find_boxes(lines)
    # Only the outermost container is double-line.
    for row, col, bottom, right, style in boxes:
        if style != "double":
            continue
        for orow, ocol, obottom, oright, _ in boxes:
            if orow < row and ocol < col and obottom > bottom and oright > right:
                errors.append(
                    f"line {row + 1} col {col + 1}: double-line box is nested inside "
                    "another box. Only the outermost container uses ╔═╗."
                )
                break
    return errors


def check_text(text):
    lines = text.split("\n")
    if lines and lines[-1] == "":
        lines = lines[:-1]
    return (
        check_characters(lines)
        + check_bars(lines)
        + check_charts(lines)
        + check_boxes(lines)
    )


def check_file(path):
    with open(path, encoding="utf-8") as handle:
        return check_text(handle.read())


def main(paths):
    if not paths:
        print(__doc__.strip())
        return 2
    failed = False
    for path in paths:
        errors = check_file(path)
        if errors:
            failed = True
            print(f"FAIL {path}")
            for error in errors:
                print(f"  {error}")
        else:
            print(f"OK   {path}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
