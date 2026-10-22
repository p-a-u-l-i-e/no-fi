import { Analytics } from "@vercel/analytics/next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "./components/MotionProvider";
import { SITE_NAME, SITE_URL } from "./site-config";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
// The latin subset has no block characters (progress bars). Glyphs missing from
// it must fall back to a real monospace font, not Next's Arial-based fallback,
// or they render wider than one cell and break alignment.
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "DejaVu Sans Mono", "monospace"],
});

const description =
  "no-fi is an agent skill that draws UI wireframes and charts as plain text, so teams discuss layout, content, and flow instead of color and type.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "no-fi: wireframes without the distraction",
    template: "%s | no-fi",
  },
  description,
  alternates: { canonical: "/" },
  keywords: ["wireframes", "plain text", "monospace", "low-fidelity", "agent skill", "UI design", "prototyping"],
  icons: {
    // app/favicon.ico is picked up automatically. Add the SVG for modern browsers.
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "no-fi: wireframes without the distraction",
    description,
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "no-fi: wireframes without the distraction",
    description,
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfdfd" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

// Runs before first paint so a saved theme never flashes the wrong colors.
const themeScript = `try{var t=localStorage.getItem("no-fi-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      // Next turns smooth scrolling off during route changes only when this is
      // set. Without it, going home from /changelog glides to the bottom.
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
