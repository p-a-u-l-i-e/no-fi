// Shown on the home page, in its FAQPage schema, and in llms.txt.
// Backticks mark code. Strip them where code can't be styled.
export const faq = [
  {
    question: "How do I get an AI agent to draw a wireframe as text?",
    answer:
      "Install the no-fi skill, then ask for a wireframe, layout sketch, screen flow, or dashboard. It answers with a text wireframe in a code block.",
  },
  {
    question: "What does a no-fi wireframe look like?",
    answer:
      "An 80-column drawing made of box-drawing characters, like an ASCII wireframe with cleaner lines. The outer frame uses double lines and every box inside uses single lines. Bars and charts use block characters. There is no emoji, color, or image.",
  },
  {
    question: "How do I know a wireframe is drawn correctly?",
    answer:
      "Run `npx no-fi-skill check wireframe.txt`, or `node no-fi/scripts/check_wireframe.mjs wireframe.txt` once installed (a Python version gives the same output). It fails on broken or misaligned boxes, unsupported characters, and bars that disagree with their values.",
  },
  {
    question: "How is no-fi different from Figma, Balsamiq, or Excalidraw?",
    answer:
      "Those are visual tools. no-fi is text, so an agent can write it, it fits in chat, docs, issues, and commit messages, and it diffs in git. It has no visual style for people to argue about. Unlike freehand ASCII diagrams, it has a fixed vocabulary of UI elements and a checker that rejects broken drawings.",
  },
];

export const plain = (text) => text.replaceAll("`", "");
