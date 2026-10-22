// Newest first. Add a new entry at the top. Skill changes only: no site changes.
export const entries = [
  {
    version: "0.3.1",
    date: "2026-10-22",
    title: "Claude plugin",
    changes: [
      "no-fi is also a Claude plugin, so it can be added from Claude's plugin directory and used in claude.ai, Cowork, and Claude Code.",
      "The validate rule names the checker by its path inside the installed skill, so agents run it from wherever the skill was installed instead of looking for a no-fi/ folder in the project.",
    ],
  },
  {
    version: "0.3.0",
    date: "2026-10-22",
    title: "Stacked columns",
    changes: [
      "Stacked column replaces Stacked bar: columns built from █ ▓ ▒ ░ segments in legend order, darkest at the bottom, with a legend naming every shade, instead of a bar of letters. The vocabulary stays at 44 elements.",
      "The checkers require a stacked column legend to name every shade it uses, and don't ask stacked columns for a row value, and still require 'Low ░ ▒ ▓ █ High' for heatmaps. The Node and Python checkers still give identical output.",
      "Line charts are drawn as a line: `─` runs that turn with ╭ ╮ ╰ ╯ and climb with │, against a ┤ axis. Rule 1 now allows those rounded corners, and `o` points are the ASCII fallback.",
      "The checkers accept ╭ ╮ ╰ ╯ as chart characters.",
      "The spending report screen shows spending by category as weekly stacked columns, and weekly spend as a line.",
      "The skill now ships only what drawing needs: the rules, the vocabulary, the examples, and the wireframe checker. The vocabulary sync and coverage scripts are for maintaining the skill, so they moved out of it.",
    ],
  },
  {
    version: "0.2.1",
    date: "2026-10-22",
    title: "Install with npx",
    changes: [
      "Install the skill with `npx no-fi-skill`, which copies it into ~/.claude/skills/no-fi. Add --project to install it into the current project instead, and --force to replace an existing install.",
      "Check a wireframe without installing anything with `npx no-fi-skill check FILE`. It runs the same checker, with the same output.",
      "The skill itself is unchanged from 0.2.0.",
    ],
  },
  {
    version: "0.2.0",
    date: "2026-10-17",
    title: "Block-character charts",
    changes: [
      "Charts now use block characters. Bar charts use █ with the eighths ▏▎▍▌▋▊▉, column charts and sparklines use ▁▂▃▄▅▆▇ for the remainder, and heatmaps use ░▒▓█. The ASCII versions stay as fallbacks.",
      "Rule 1 now allows block characters in progress bars and charts, not only progress bars.",
      "The checkers compare each bar chart row with its value and stated unit, require a legend for shaded heatmaps, and require column charts to say what a row is worth. The Node and Python checkers still give identical output.",
      "The dashboard, spending report, and activity patterns screens are redrawn with the new charts.",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-10-17",
    title: "First release",
    changes: [
      "The no-fi skill: six rules and a 44-element vocabulary for drawing UI as plain text, with box-drawing borders and block characters in progress bars.",
      "Seven example screens, built to use the vocabulary.",
      "Checkers in both Node and Python, with identical output: check_wireframe validates characters, boxes, tables and progress bars. check_coverage confirms every element appears in an example.",
    ],
  },
];
