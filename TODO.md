# Publishing to-do

Order matters: later steps change URLs that earlier steps depend on.

## Done
- [x] Skill, examples, and checkers (Node and Python, identical output)
- [x] MIT license
- [x] Changelog covers the skill only; `update-changelog` skill and `CLAUDE.md` enforce it
- [x] Site deployed at `https://no-fi-woad.vercel.app`
- [x] `site-config.js` has the real `REPO` and `SITE_URL`
- [x] Icons, manifest, and OG/Twitter images

## To do
1. [ ] **Make `p-a-u-l-i-e/no-fi` public.** It is private now, and `npx skills add` cannot install from a private repo.
   `gh repo edit p-a-u-l-i-e/no-fi --visibility public --accept-visibility-change-consequences`
2. [ ] **Test `npx skills add p-a-u-l-i-e/no-fi --list`** on a clean machine. Not yet confirmed that the CLI finds the skill in the `no-fi/` subfolder. If it does not, move the skill to `skills/no-fi/` (or the repo root), then update the folder paths in `site/scripts/sync-skill.mjs`, `site/app/lib/skill.js`, and the README layout. Do this before the domain, so URLs change once.
3. [ ] **Test the other install paths on the live site.** Run the install prompt in a fresh Claude Code session. Open `/no-fi/SKILL.md`. Click both GitHub links.
4. [ ] **Domain.** Buy it, add it in the Vercel project, set `SITE_URL` in `site/app/site-config.js`, push, and confirm the redeploy.
5. [ ] **Check social previews** on the final URL (X, Slack, iMessage, or their validators). They cache hard, so only do this once the URL is final.
6. [ ] **Repo polish.** Description and topics, banner as the social preview image, a `v0.2.0` tag matching the changelog.
7. [ ] **Site polish.** `sitemap` and `robots` files, a `themeColor` viewport entry.
8. [ ] **Announce.**

## Optional
- [ ] `npx no-fi` as its own command: needs an npm package with a `bin` and `npm publish`. The name `no-fi` is free on npm (checked 2026-10-17).
