import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/demo-insights"] },
    ],
    sitemap: "https://tropicaldrifttravel-concept.example/sitemap.xml",
  };
}
