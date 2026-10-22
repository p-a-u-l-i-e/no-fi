#!/usr/bin/env python3
"""Regenerate the vocabulary tables in SKILL.md from vocabulary.json.

Replaces everything between the vocabulary:start and vocabulary:end markers.

Usage: sync_vocabulary.py [--check]
With --check, writes nothing and exits 1 if SKILL.md is out of date.
"""

import json
import sys
from pathlib import Path

# The skill lives in plugin/skills/no-fi/.
ROOT = Path(__file__).resolve().parent.parent / "plugin" / "skills" / "no-fi"
START = "<!-- vocabulary:start -->"
END = "<!-- vocabulary:end -->"


def render(data):
    blocks = []
    for group in data["groups"]:
        items = [i for i in data["items"] if i["group"] == group]
        if not items:
            continue
        rows = [f"### {group}", "", "| Element | Draw as | Notes |", "| --- | --- | --- |"]
        for item in items:
            rows.append(f"| {item['name']} | {item['draw']} | {item['note']} |")
        blocks.append("\n".join(rows))
    return "\n\n".join(blocks)


def main(argv):
    data = json.loads((ROOT / "vocabulary.json").read_text(encoding="utf-8"))
    skill_path = ROOT / "SKILL.md"
    skill = skill_path.read_text(encoding="utf-8")
    if START not in skill or END not in skill:
        print(f"SKILL.md is missing the {START} / {END} markers")
        return 1

    head, rest = skill.split(START, 1)
    _, tail = rest.split(END, 1)
    updated = f"{head}{START}\n\n{render(data)}\n\n{END}{tail}"

    if "--check" in argv:
        if updated != skill:
            print("SKILL.md is out of date. Run scripts/sync_vocabulary.py")
            return 1
        print("SKILL.md is up to date")
        return 0

    skill_path.write_text(updated, encoding="utf-8")
    print(f"Wrote {len(data['items'])} elements to SKILL.md")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
