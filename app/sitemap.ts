import type { MetadataRoute } from "next";
import {
  getAllFleaMarkets,
  getAllPrefectures,
  getAllCategories,
  getCitiesByPrefecture,
} from "@/lib/data";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://furima-zukan.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  entries.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  });

  for (const market of getAllFleaMarkets()) {
    entries.push({
      url: `${BASE_URL}/flea-market/${market.slug}`,
      lastModified: (() => { const d = new Date(market.verified_at); return isNaN(d.getTime()) ? new Date() : d; })(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const pref of getAllPrefectures()) {
    entries.push({
      url: `${BASE_URL}/prefecture/${encodeURIComponent(pref)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });

    for (const city of getCitiesByPrefecture(pref)) {
      if (city) {
        entries.push({
          url: `${BASE_URL}/prefecture/${encodeURIComponent(pref)}/${encodeURIComponent(city)}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  for (const cat of getAllCategories()) {
    entries.push({
      url: `${BASE_URL}/category/${encodeURIComponent(cat)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}
