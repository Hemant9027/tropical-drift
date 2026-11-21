import type { MetadataRoute } from "next";

const base = "https://tropicaldrifttravel-concept.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/plan-your-stay", priority: 0.9 },
    { path: "/contact", priority: 0.8 },
    { path: "/about", priority: 0.6 },
    { path: "/experiences", priority: 0.6 },
  ];
  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));
}
