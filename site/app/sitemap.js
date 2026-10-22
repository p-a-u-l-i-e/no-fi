import { entries } from "./lib/changelog";
import { SITE_URL } from "./site-config";

export const dynamic = "force-static";

export default function sitemap() {
  const lastModified = entries[0].date;
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/changelog`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];
}
