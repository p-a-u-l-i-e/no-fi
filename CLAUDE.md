# no-fi

- After changing anything under `no-fi/`, use the `update-changelog` skill. The changelog covers the skill only.
- `site/` is a demo. Never add site changes to the changelog.

## Fluid Functionalism
- No shadcn in `site/` (decided 2026-10-22). Registry items are vendored by hand as JS in `site/lib`, `site/hooks`, `site/components`; never run `shadcn init` or `shadcn add`.
