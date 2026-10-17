# no-fi site

A static page that explains the no-fi wireframe skill. See `docs/project-brief.md`.

## Commands

```sh
npm install
npm run dev     # local dev server
npm run build   # static export to out/
npm run lint
```

## Updating examples and vocabulary

`content/examples/` and `content/vocabulary.json` are copies of `../no-fi/examples/` and `../no-fi/vocabulary.json`. The page reads both at build time, and works out which screen uses which element from the same patterns the coverage check uses. After changing the originals, copy them again:

```sh
rm content/examples/*.txt
cp ../no-fi/examples/*.txt content/examples/
cp ../no-fi/vocabulary.json content/vocabulary.json
```

## Fonts

The base sans is **Inter**, loaded with `next/font/google`. Wireframes use the system monospace font, and the nav logo uses JetBrains Mono.

`app/fonts/saans/` holds two Saans files that are not currently used. Their license is "Personal Use Only", so keep them out of version control (`app/fonts/` is in `.gitignore`) and do not deploy them without a web license from the foundry. Delete the folder if you do not need it.

## Troubleshooting

- **CSS changes do not show in `npm run build`:** the Turbopack cache can serve a stale `globals.css`. Delete `.next` and `out`, then build again. Stop `npm run dev` first, since it uses `.next` too.
- **The page shows old vocabulary or examples:** the page reads `content/` once when the server starts, so `npm run dev` does not notice changes to those files. Copy them again (see above), then restart the dev server.
- **Wireframe characters look wrong:** the monospace font has ligatures turned off in `globals.css` so `<--`, `//`, and `==` stay literal. Keep that rule.
