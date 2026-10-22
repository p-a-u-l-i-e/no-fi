// Newest first. Add a new entry at the top. Skill changes only: no site changes.
export const entries = [
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
