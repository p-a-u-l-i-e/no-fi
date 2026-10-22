import { SITE_URL } from "./site-config";

export const dynamic = "force-static";

// Everyone may crawl, AI crawlers included: agents are the audience.
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
