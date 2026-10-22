# Project Brief: no-fi site

## Focus
A one-page site that explains the no-fi wireframe skill and shows example outputs.

## Target user
Designers, product managers, and engineers who want to discuss layout before visuals.

## Core workflow
A visitor reads the rules and vocabulary, looks at the examples, and installs the skill.

## MVP scope
- In: rules, vocabulary table, two example wireframes, validator command, install command
- Out: copy buttons, search, accounts, analytics, a live editor, deployment

## Project type and stack
Static site. Next.js App Router, JavaScript, Tailwind CSS, static export (`output: "export"`).
No backend, so no Supabase. Deployment target not chosen.

## Integrations
None.

## Constraints
- No secrets or environment variables.
- Examples are copied from `plugin/skills/no-fi/examples/`. Re-copy them when the examples change.

## Definition of done
- [x] Dependencies install
- [x] Production build succeeds (static export to `out/`)
- [x] Lint passes on `app/`
- [x] Examples render from `content/examples/`
- [ ] Checked in a browser (not done yet)
- [ ] Deployed (not chosen yet)

## Assumptions
- Light-only design, monospace type.
- The site reads example files at build time, so it has no runtime file access.

## Open questions
- Where to host it.
- Whether the example files should be linked to `plugin/skills/no-fi/examples/` rather than copied.
