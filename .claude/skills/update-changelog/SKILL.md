---
name: update-changelog
description: Record a change to the no-fi skill in the changelog. Use after any change to files under no-fi/ (SKILL.md, vocabulary.json, examples, scripts), and before finishing such work. Never log changes to site/, which is only a demo.
---

# Update the changelog

The changelog is the `entries` array in `site/app/lib/changelog.js`, newest
first. It describes the **skill**. The site is a demo, so it never appears in it.

## What counts
Log changes under `plugin/` (the skill is `plugin/skills/no-fi/`):
- rules or wording in `SKILL.md`
- vocabulary elements and how they are drawn (`vocabulary.json`)
- example screens in `plugin/skills/no-fi/examples/`
- the checkers in `plugin/skills/no-fi/scripts/`
- how the skill is installed or used

Do **not** log anything under `site/`, or changes to the README, the banner, the
license, or repo setup. If a change touches both, log only the skill part. If
nothing under `plugin/` changed, do not touch the changelog.

## Steps
1. Run `git diff` (and `git status`) for `plugin/` to see what actually changed.
2. Pick the version: patch for fixes and wording, minor for new or changed
   vocabulary, rules, or checks, major for changes that make existing
   wireframes or checker results invalid.
3. Add an entry at the top of `entries`, or add bullets to the newest entry when
   it is the same unreleased piece of work:
   `{ version, date (YYYY-MM-DD, today), title, changes: [...] }`.
4. Write each bullet as one sentence about what is different for someone using
   the skill. Name the elements or checks, not the files. No mention of the site.
5. Keep the example's counts accurate (for example "44-element vocabulary"). If
   a count in an older entry is now wrong, leave history alone and state the
   new count in the new entry.
6. If `vocabulary.json` changed, run `python3 scripts/sync_vocabulary.py`
   first, so the changelog describes what shipped.
7. Run `npm run lint` in `site/` to confirm the page still parses.

## Don't
- Don't add an entry for a site-only change, even a visible one.
- Don't invent changes the diff does not show.
- Don't rewrite existing entries, except to remove site references.
