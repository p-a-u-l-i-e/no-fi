# no-fi

Wireframes without the distraction. no-fi draws UI wireframes and charts as plain text, so a team argues about layout, content, and flow instead of color and type.

## Install

In Claude Code:

```
/plugin install no-fi --marketplace p-a-u-l-i-e/no-fi
```

## Use it

Ask for a screen the way you would ask a designer for a sketch, for example "Wireframe a send-money form with three steps" or "Let's talk through the transactions table before we design it." Saying wireframe or sketch is enough to load the skill.

Claude answers with a monospaced drawing in a code block: boxes, fields, buttons, tables, and charts made from box-drawing and block characters, with a note below for anything that needs a visual described in words. The skill has seven rules and a 44-element vocabulary, so every input, badge, alert, and chart is drawn the same way each time.

## What it runs

Before it shows you a wireframe, Claude checks it with the skill's own checker, `scripts/check_wireframe.mjs` (or the identical `check_wireframe.py` without Node). The checker reads the text file you give it and reports broken boxes, unsupported characters, and bars or charts that disagree with their values. It makes no network requests, reads nothing else, and writes nothing.

## Data

The plugin sends no data anywhere and stores nothing. It is plain text instructions, example screens, and the local checker.

## More

Examples, the full rules, and other ways to install are at [no-fi.dev](https://no-fi.dev). The source is at [github.com/p-a-u-l-i-e/no-fi](https://github.com/p-a-u-l-i-e/no-fi). MIT license.
