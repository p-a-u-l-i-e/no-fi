#!/usr/bin/env python3
"""Check that every vocabulary element appears in at least one example.

Each element in vocabulary.json lists one or more regex patterns. An element
is covered when every one of its patterns matches somewhere in the examples.

Usage: check_coverage.py [VOCABULARY_JSON EXAMPLES_DIR]
Exit status is 0 when everything is covered, 1 otherwise.
"""

import json
import re
import sys
from pathlib import Path

from check_wireframe import check_text

ROOT = Path(__file__).resolve().parent.parent


def load_examples(directory):
    return {
        path.name: path.read_text(encoding="utf-8")
        for path in sorted(Path(directory).glob("*.txt"))
    }


def used_in(item, examples):
    """Examples that match every pattern, or an empty list if any pattern is unmatched."""
    found = set()
    for pattern in item["patterns"]:
        regex = re.compile(pattern, re.MULTILINE)
        hits = {name for name, text in examples.items() if regex.search(text)}
        if not hits:
            return []
        found |= hits
    return sorted(found)


def main(argv):
    vocabulary = Path(argv[0]) if argv else ROOT / "vocabulary.json"
    examples_dir = Path(argv[1]) if len(argv) > 1 else ROOT / "examples"
    data = json.loads(vocabulary.read_text(encoding="utf-8"))
    examples = load_examples(examples_dir)

    missing = []
    for item in data["items"]:
        hits = used_in(item, examples)
        status = "ok  " if hits else "MISS"
        print(f"{status} {item['group']:<10} {item['name']:<13} {', '.join(hits)}")
        if not hits:
            missing.append(item["name"])

    total = len(data["items"])
    print(f"\n{total - len(missing)} of {total} elements covered by {len(examples)} examples")

    # The drawings in the vocabulary must pass the same checks as the screens.
    bad_glyphs = []
    for item in data["items"]:
        for error in check_text(item["glyph"]):
            bad_glyphs.append(f"{item['name']}: {error}")
    if bad_glyphs:
        print("\nInvalid glyphs in vocabulary.json:")
        for line in bad_glyphs:
            print(f"  {line}")
    else:
        print(f"All {total} vocabulary drawings pass the wireframe checks")

    if missing:
        print("Not covered: " + ", ".join(missing))
    return 1 if missing or bad_glyphs else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
