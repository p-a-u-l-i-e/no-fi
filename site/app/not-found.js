import Link from "next/link";
import SiteNav from "./components/SiteNav";

export const metadata = {
  title: "Page not found",
};

// Each digit is five rows of block characters, eight columns wide.
const font = {
  4: ["██    ██", "██    ██", "████████", "      ██", "      ██"],
  0: ["████████", "██    ██", "██    ██", "██    ██", "████████"],
};

const width = 50;
const digits = [0, 1, 2, 3, 4].map((row) => ["4", "0", "4"].map((d) => font[d][row]).join("   "));

// Centers text in the frame. Odd padding goes right, like Python's str.center.
function pad(text) {
  const space = width - [...text].length;
  const left = Math.floor(space / 2);
  return [" ".repeat(left), " ".repeat(space - left)];
}

// A row of pure drawing: borders, blank lines, and the digits.
function Drawn({ text = "" }) {
  const [left, right] = pad(text);
  return <span aria-hidden="true">{`║${left}${text}${right}║\n`}</span>;
}

// A row whose words are real content. Only the frame around it is hidden.
function Row({ text, children }) {
  const [left, right] = pad(text);
  return (
    <>
      <span aria-hidden="true">{`║${left}`}</span>
      {children ?? text}
      <span aria-hidden="true">{`${right}║`}</span>
      {"\n"}
    </>
  );
}

export default function NotFound() {
  return (
    <>
      <SiteNav />

      <main className="mx-auto flex min-h-svh max-w-[1120px] flex-col justify-center px-3 pb-24 pt-32 sm:px-6">
        <h1 className="sr-only">Page not found</h1>
        <div className="flex flex-col rounded-[28px] border border-line bg-card p-1.5 shadow-[var(--lift)] sm:p-2">
          <div className="fit-stage dots flex flex-col justify-center overflow-x-auto rounded-[20px] bg-stage p-3 sm:p-10">
            <pre style={{ "--cols": width + 2 }} className="wire fit mx-auto w-max text-ink">
              <span aria-hidden="true">{`╔${"═".repeat(width)}╗\n`}</span>
              <Drawn />
              {digits.map((row, index) => (
                <Drawn key={index} text={row} />
              ))}
              <Drawn />
              <Drawn text="Page not found" />
              <Drawn />
              <Row text="Nothing is drawn at this address yet." />
              <Drawn />
              <Row text="[[ Back to home ]]">
                <Link href="/" className="font-semibold underline-offset-4 hover:underline">
                  <span aria-hidden="true">[[ </span>
                  Back to home
                  <span aria-hidden="true"> ]]</span>
                </Link>
              </Row>
              <Drawn />
              <span aria-hidden="true">{`╚${"═".repeat(width)}╝`}</span>
            </pre>
          </div>
        </div>
      </main>
    </>
  );
}
