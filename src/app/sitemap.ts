import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://comforting-boba-d84e62.netlify.app";
  const lastMod = new Date("2026-06-05");
  return [
    { url: baseUrl, lastModified: lastMod, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/method`, lastModified: lastMod, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: lastMod, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/brief`, lastModified: lastMod, changeFrequency: "monthly", priority: 0.5 },
  ];
}
