---
name: no-fi
description: Draw low-fidelity UI wireframes and charts as plain text, so people can discuss layout, content, and flow without being distracted by visual design. Use when the user asks for a wireframe, layout sketch, screen flow, dashboard, or to "talk through" a screen before any visuals exist. Output is text only, in a code block, with no emoji, color, or images.
---

# no-fi

Draw screens as monospaced text. The goal is to make the conversation about structure, content, and flow, not color, type, or polish.

## Rules

1. **Plain characters, plus box-drawing.** Printable ASCII, the box-drawing characters used for borders (`╔ ═ ╗ ║ ╚ ╝` and `┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴ ┼`), and block characters for progress bars and charts (`▮ ▯ █ ▒ ░ ▓`, the horizontal eighths `▏▎▍▌▋▊▉`, and the vertical steps `▁▂▃▄▅▆▇`), and the rounded corners `╭ ╮ ╰ ╯` where a line chart turns. No emoji, no tabs.
2. **Double outside, single inside.** The outermost container is drawn with double lines `╔═╗`. Every box inside it uses single lines `┌─┐`.
3. **Fixed width.** Keep every line at 80 characters or fewer. Every box is exactly as wide on every row.
4. **Code block.** Always wrap the output in a fenced block with no language tag, so monospacing and alignment hold.
5. **Describe, don't decorate.** No colors, fonts, or icons. If something needs a visual, name it in words in a note below the drawing.
6. **Use the vocabulary.** Draw each element the way the tables below show it. Do not invent a symbol. If an element is missing, draw the closest one and say what it is in a note.
7. **Validate.** Run the checker before showing the result:

   ```sh
   node ${CLAUDE_SKILL_DIR}/scripts/check_wireframe.mjs path/to/wireframe.txt
   ```

   `${CLAUDE_SKILL_DIR}` is the folder this file is in. Without Node, `python3 ${CLAUDE_SKILL_DIR}/scripts/check_wireframe.py` gives the same output.

   It fails on unsupported characters, tabs, ASCII box borders, boxes that don't close or line up, mixed double and single lines in one box, a double-line box nested inside another box, table dividers that don't land in the same column top and bottom, progress bars whose fill disagrees with their percentage, bar chart rows whose length disagrees with their value and stated unit, heatmaps and stacked columns without a legend, and column charts that don't say what a row is worth. Fix every failure before presenting the wireframe.

## Draw it like the UI it stands for

Each element should look like the component it represents, not a character that hints at it.

- A one-line field is an **input**. A taller card with a `//` grip is a **textarea**. They are never interchangeable.
- A bare `!` is not a component. Use an **alert** (a card with an icon) for messages and a **field error** under a field.
- A **badge** is a pill, `( Paid )`. A **tag** is removable, `<Food x>`. A **button** has brackets, and the **primary** one has double brackets.
- Open states are drawn open: a **select** with its **menu** below, an **accordion** with its content under it.
- Floating things (**modal**, **toast**, **tooltip**) are cards drawn inside the screen they sit on.

## Vocabulary

<!-- vocabulary:start -->

### Structure

| Element | Draw as | Notes |
| --- | --- | --- |
| Screen | the outermost container, in double lines: `╔═╗ ║ ╚═╝`. One per wireframe. | Double lines mean the outer frame. |
| Card | any box inside the screen, in single lines: `┌─┐ │ └─┘` | Single lines mean a nested box. Blank line between stacked cards. |
| Heading | `SECTION NAME` in capitals, underlined with `═════` for a major section | Capitals. Underline with a double rule for a major section. |
| Divider | `─────` across a screen, or `├─────┤` across a card | A rule between groups. |
| Placeholder | `[image: description]` inside a card | Say what goes there. |
| Skeleton | `xxxxxxxx  xxxxx` for content still loading | Content that has not arrived yet. |
| Annotation | `<-- note` beside an element. A design note, not part of the UI. | Design notes live outside the UI. |

### Fields

| Element | Draw as | Notes |
| --- | --- | --- |
| Input | `[ value________ ]` on one line, label above | One line. Label above, value inside. |
| Textarea | a card several lines tall with a `//` resize grip in the bottom-right | Taller than an input. The grip tells them apart. |
| Search | `[? Search_____]` | A question mark marks it as search. |
| Select | `[ Choose      v ]` | v marks the menu. |
| Menu | a card directly under an open select, `>` marks the highlighted row | The open state of a select. |
| Checkbox | `[x]` checked, `[ ]` unchecked | x means checked. |
| Radio | `(*)` selected, `( )` unselected | Star means selected. |
| Toggle | `[ON ]` / `[OFF]` | Always four characters wide. |
| Slider | `[----o-------]` with the value beside it | o is the handle. |
| Required | `Name *` | Star after the label. |
| Field error | `(!) message` on the line directly under the field | Sits under the field it belongs to. |

### Buttons

| Element | Draw as | Notes |
| --- | --- | --- |
| Primary button | `[[ Save ]]`, last in a row | Double brackets. One per view. |
| Button | `[ Cancel ]` | Single brackets. Secondary actions. |
| Icon button | `[ + ]`, `[ ... ]`, `[ ? ]` | A symbol alone. Name it in a note. |
| Disabled | `[- Continue -]`, dashes mark it as dimmed | Say why, in a tooltip or note. |

### Feedback

| Element | Draw as | Notes |
| --- | --- | --- |
| Alert | a full-width card with a status icon: `(!)` warning, `(i)` info, `(ok)` success, `(x)` error | Icon, message, optional action. |
| Toast | a small card with an icon, a short message, and `x` to close | Brief. Always closes with x. |
| Modal | a card inside the screen with a capitalized title, `x`, a divider, body, and actions | Sits inside the screen it covers. |
| Tooltip | a small card under its element, with `^` pointing up at it | Caret points at the trigger. |
| Badge | `( Paid )` status pill, `(3)` count | Pill for status, bare number for a count. |
| Tag | `<Food x>` removable filter | x removes it. |
| Avatar | `(AN)` initials in a circle | A person or account. |

### Navigation

| Element | Draw as | Notes |
| --- | --- | --- |
| Tabs | `[ Active ]  Other  More` | Active tab is bracketed. |
| Breadcrumb | `Home > Cards > Visa` | Greater-than between levels. |
| Pagination | `< 1 [2] 3 4 >` | Current page in brackets. |
| Stepper | `*-----o-----o` with step names below | Star is reached, o is still ahead. |
| Accordion | `v Open` with content below it, `> Closed` | v is open, > is closed. |
| Link | `Label >` | Greater-than after the label. |

### Data

| Element | Draw as | Notes |
| --- | --- | --- |
| Table | a card with `┬ ┼ ┴` column dividers, header in capitals, `v` or `^` marks the sort | Sort arrow beside the sorted column. |
| Delta | `^ +2.1%` up, `v -3.4%` down | Arrow and signed number. |
| Progress | `[=======---] 70%`, `[ ▮▮▮▮▯▯▯▯ ] 50%`, or `[ ████▒▒▒▒ ] 50%` | Three styles. The fill matches the percent. |

### Charts

| Element | Draw as | Notes |
| --- | --- | --- |
| Bar chart | `Rent Co  ████████████  $1,200`: one `█` per fixed unit, and `▏▎▍▌▋▊▉` add eighths. ASCII fallback: `#` | State the unit of one █. The partial block is the remainder. |
| Column chart | `███` columns, one row per fixed unit, a `▁▂▃▄▅▆▇` top for the remainder, `───` baseline, labels below. ASCII fallback: `###` | State what one row is worth. The partial top is the remainder. |
| Line chart | a `─` line that turns with `╭ ╮ ╰ ╯` and climbs with `│`, against a `$400 ┤` axis and a `└────` baseline. ASCII fallback: `o` points | Label the top, middle, and bottom of the axis. Each x label sits under the start of its step. |
| Sparkline | `▁▂▃▄▅▆▇█` from low to high. ASCII fallback: `~` then `_ . - = + * #` | A trend with no axis. |
| Stacked column | `███` columns of `█ ▓ ▒ ░` segments, with a `█ Food  ▓ Home` legend. ASCII fallback: `# = : .` | Stack in legend order, darkest at the bottom. |
| Heatmap | blank, `░ ▒ ▓ █` from light to dark, two characters per cell, with a `Low ░ ▒ ▓ █ High` legend. ASCII fallback: `. : - = + * # % @` | Always draw the legend. |

<!-- vocabulary:end -->

## Charts

- Draw charts with block characters. Each one has an ASCII fallback for places that can't show blocks: `o` points for line charts, `#` for bars, `###` for columns, `~_.-=+*#` for sparklines, `# = : .` for stacked columns, and `. : - = + * # % @` for heatmaps. Use one style within a chart.
- State what one unit is: `(one █ is $100)`, `(one row is $25)`. The checker compares each bar's length to its value.
- Use the partial block for the remainder, so 4.1 units is `████▏`, not `████`. A value under one unit is just the partial block.
- Label the top, middle, and bottom of an axis, and the first and last point on the x axis.
- Keep a chart under about eight rows or columns. Summarise the rest in words.
- A bar's fill must agree with its label. The checker enforces this for progress bars and bar charts.
- Always draw a legend for stacked columns and heatmaps. The checker requires `Low ░ ▒ ▓ █ High` for a shaded heatmap, and a legend naming every shade, like `█ Food  ▓ Home`, for stacked columns.
- Stack segments in legend order, darkest at the bottom, the same order in every column. Use at most four, and group the rest as Other. Round each segment to whole rows and put exact figures in the legend.

## Layout

- Sketch the frame first, then fill in content. Confirm the frame before adding detail.
- Use one width per kind of screen so right edges line up across a set: 80 columns for a full screen, 49 for a form.
- Right-align anything that sits at the right of a row (actions, totals, a toast), so every row ends on the same column.
- Leave one blank line between stacked cards.
- Put side-by-side cards on the same rows, with a 2-character gap between them.
- Show hierarchy with capitals, rules, and nesting, not with size.

## Output format

1. The wireframe, in one fenced block.
2. A short list of notes for anything the drawing cannot show: states, interactions, data sources.
3. The checker result, if it was run.

## Example

```
╔═════════════════════════════════════╗
║ SIGN IN                             ║
║ ═══════════════════════════════════ ║
║                                     ║
║ Email *                             ║
║ [ ana@acme.co____________________ ] ║
║                                     ║
║ Password *                          ║
║ [ ************___________________ ] ║
║ (!) Wrong email or password         ║
║                                     ║
║ [ ] Remember me                     ║
║                                     ║
║ Forgot password >     [[ Sign in ]] ║
╚═════════════════════════════════════╝
```

Seven full screens that use every element are in `examples/`.
