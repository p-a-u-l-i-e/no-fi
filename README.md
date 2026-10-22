![no-fi: wireframes without the distraction](https://raw.githubusercontent.com/p-a-u-l-i-e/no-fi/main/assets/banner.png)

# no-fi

**Wireframes without the distraction.** no-fi is an agent skill that draws UI as plain text, so a team argues about layout, content, and flow instead of color and type.

Ask for a screen and Claude answers with a monospaced drawing: boxes, fields, buttons, tables, and bar charts made from plain characters. There are no colors, fonts, or icons to react to, so the only thing left to discuss is structure.

## Contents

- [What it looks like](#what-it-looks-like)
- [Install](#install)
- [Use it](#use-it)
- [The rules](#the-rules)
- [The vocabulary](#the-vocabulary)
- [Examples](#examples)
- [Check your work](#check-your-work)
- [Repository layout](#repository-layout)

## What it looks like

```
╔══════════════════════════════════════╗
║ SIGN IN                              ║
║                                      ║
║ ┌──────────────────────────────────┐ ║
║ │ Email                            │ ║
║ │ [ ana@acme.com_______________ ]  │ ║
║ │                                  │ ║
║ │ Password                         │ ║
║ │ [ ************_______________ ]  │ ║
║ │                                  │ ║
║ │ [[ Sign in ]]   [ Forgot? ]      │ ║
║ └──────────────────────────────────┘ ║
╚══════════════════════════════════════╝
```

The outer frame is double-lined, every box inside it is single-lined, and the primary button gets double brackets. Larger screens are in [Examples](#examples).

## Install

Pick one. Each puts the `no-fi/` folder where your agent loads skills from.

**With npx**

```sh
npx no-fi-skill
```

This copies the skill into `~/.claude/skills/no-fi`. Add `--project` to install it into `./.claude/skills/no-fi` instead, and `--force` to replace an existing install.

**With the skills CLI**

```sh
npx skills add p-a-u-l-i-e/no-fi --skill no-fi
```

**By hand**

```sh
git clone https://github.com/p-a-u-l-i-e/no-fi.git
cp -R no-fi/no-fi ~/.claude/skills/
```

**On claude.ai**

Download the repository as a ZIP and upload it under Settings, Capabilities, Skills.

The skill is plain text and a few small scripts, so you can read every file before you install it.

## Use it

Ask for a screen the way you would ask a designer for a sketch:

> Wireframe a send-money form with three steps.
>
> Draw the settings page for notification preferences.
>
> Let's talk through the transactions table before we design it.

Claude replies with a fenced code block, runs the checker on it, and adds a note below the drawing for anything that needs a visual described in words.

## The rules

Seven rules keep every wireframe readable. The full text is in [`no-fi/SKILL.md`](no-fi/SKILL.md).

1. **Plain characters, plus box-drawing.** Printable ASCII, box-drawing borders, and block characters for bars and charts. No emoji, no tabs.
2. **Double outside, single inside.** The outermost container uses double lines. Every box inside it uses single lines.
3. **Fixed width.** No line is longer than 80 characters, and every box is the same width on every row.
4. **Code block.** Output is always a fenced block, so alignment holds.
5. **Describe, don't decorate.** No colors, fonts, or icons. Name anything visual in a note below the drawing.
6. **Use the vocabulary.** Draw each element as the tables show. Don't invent symbols.
7. **Validate.** Run the checker and fix every failure before showing the result.

## The vocabulary

44 elements in 7 groups: Structure, Fields, Buttons, Feedback, Navigation, Data, and Charts. Each element looks like the component it stands for:

- An **input** is one line. A **textarea** is a taller card with a `//` grip.
- A **badge** is a pill, `( Paid )`. A **tag** is removable, `<Food x>`.
- A **button** has brackets, and the **primary** one has double brackets.
- Open states are drawn open: a **select** with its menu below, an **accordion** with its content under it.
- **Modals**, **toasts**, and **tooltips** are cards drawn inside the screen they sit on.

The complete table, with a drawing and a note for each element, is in [`no-fi/SKILL.md`](no-fi/SKILL.md). The same data is in [`no-fi/vocabulary.json`](no-fi/vocabulary.json).

## Examples

Seven finished screens in [`no-fi/examples/`](no-fi/examples), built to use the whole vocabulary:

| Screen | File |
| --- | --- |
| Fintech dashboard | [`fintech-dashboard.txt`](no-fi/examples/fintech-dashboard.txt) |
| Send money form | [`send-money-form.txt`](no-fi/examples/send-money-form.txt) |
| Transactions table | [`transactions-table.txt`](no-fi/examples/transactions-table.txt) |
| Spending report | [`spending-report.txt`](no-fi/examples/spending-report.txt) |
| Card details | [`card-details.txt`](no-fi/examples/card-details.txt) |
| Notification settings | [`settings-notifications.txt`](no-fi/examples/settings-notifications.txt) |
| Activity patterns | [`activity-patterns.txt`](no-fi/examples/activity-patterns.txt) |

## Check your work

Two scripts ship with the skill. Each comes in Node and Python, with the same output.

**Check a wireframe**

```sh
node no-fi/scripts/check_wireframe.mjs wireframe.txt
python3 no-fi/scripts/check_wireframe.py wireframe.txt
npx no-fi-skill check wireframe.txt
```

It fails on unsupported characters, tabs, ASCII box borders, boxes that don't close or line up, mixed double and single lines in one box, a double-line box nested inside another box, table dividers that don't land in the same column, progress bars whose fill disagrees with their percentage, bar chart rows whose length disagrees with their value, heatmaps without a legend, and column charts that don't say what a row is worth.

**Check vocabulary coverage**

```sh
node no-fi/scripts/check_coverage.mjs
python3 no-fi/scripts/check_coverage.py
```

It confirms every vocabulary element appears in at least one example screen.

## Repository layout

```
no-fi/               the skill
  SKILL.md           rules and vocabulary tables
  vocabulary.json    the element vocabulary as data
  examples/          finished example screens
  scripts/           wireframe and coverage checks
bin/no-fi-skill.mjs  the npx no-fi-skill command
assets/              README images
site/                the no-fi.dev site
```

## License

[MIT](LICENSE)
