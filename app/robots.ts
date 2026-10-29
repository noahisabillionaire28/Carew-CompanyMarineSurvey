import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/contact/thank-you"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
