import fs from "fs";
import path from "path";
import { generateUpcomingDates, toISODate } from "./schedule";

/** Only allow http/https URLs to prevent javascript: XSS */
function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return trimmed;
    }
    return "";
  } catch {
    return "";
  }
}

export interface FleaMarket {
  name: string;
  organizer: string;
  category: string;
  prefecture: string;
  city: string;
  address: string;
  venue: string;
  schedule_text: string;
  schedule_rule: string;
  upcoming_dates: string[]; // YYYY-MM-DD, ビルド時に schedule_rule から生成
  opening_hours: string;
  entry_fee: string;
  is_free_entry: boolean;
  has_food: boolean;
  has_parking: boolean;
  access_text: string;
  nearest_station: string;
  walk_min: number | null;
  highlights: string;
  notes: string;
  official_url: string;
  latitude: number | null;
  longitude: number | null;
  verified_at: string;
  slug: string;
}

function generateSlug(name: string, index: number): string {
  const ascii = name
    .toLowerCase()
    .replace(/[^\x00-\x7F]/g, " ")
    .replace(/[\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const base = ascii.length > 0 ? ascii : "flea-market";
  return `${base}-${index + 1}`;
}

function parseBool(val: string): boolean {
  return val.trim().toUpperCase() === "TRUE";
}

function parseNum(val: string): number | null {
  const n = parseFloat(val.trim());
  return isNaN(n) ? null : n;
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

let _cache: FleaMarket[] | null = null;

export function getAllFleaMarkets(): FleaMarket[] {
  if (_cache) return _cache;

  const csvPath = path.join(process.cwd(), "data", "master_data.csv");
  const raw = fs.readFileSync(csvPath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim());
  const [headerLine, ...dataLines] = lines;
  const headers = headerLine.split(",");

  const markets: FleaMarket[] = dataLines
    .filter((line) => line.trim())
    .map((line, index) => {
      const vals = parseCSVLine(line);
      const get = (col: string) => (vals[headers.indexOf(col)] ?? "").trim();

      const name = get("name");
      if (!name) return null;

      return {
        name,
        organizer: get("organizer"),
        category: get("category"),
        prefecture: get("prefecture"),
        city: get("city"),
        address: get("address"),
        venue: get("venue"),
        schedule_text: get("schedule_text"),
        schedule_rule: get("schedule_rule"),
        upcoming_dates: generateUpcomingDates(get("schedule_rule")).map(toISODate),
        opening_hours: get("opening_hours"),
        entry_fee: get("entry_fee"),
        is_free_entry: parseBool(get("is_free_entry")),
        has_food: parseBool(get("has_food")),
        has_parking: parseBool(get("has_parking")),
        access_text: get("access_text"),
        nearest_station: get("nearest_station"),
        walk_min: parseNum(get("walk_min")),
        highlights: get("highlights"),
        notes: get("notes"),
        official_url: sanitizeUrl(get("official_url")),
        latitude: parseNum(get("latitude")),
        longitude: parseNum(get("longitude")),
        verified_at: get("verified_at"),
        slug: generateSlug(name, index),
      } as FleaMarket;
    })
    .filter(Boolean) as FleaMarket[];

  _cache = markets;
  return _cache;
}

export function getFleaMarketBySlug(slug: string): FleaMarket | undefined {
  return getAllFleaMarkets().find((m) => m.slug === slug);
}

export function getFleaMarketsByPrefecture(pref: string): FleaMarket[] {
  return getAllFleaMarkets().filter((m) => m.prefecture === pref);
}

export function getFleaMarketsByCity(pref: string, city: string): FleaMarket[] {
  return getAllFleaMarkets().filter(
    (m) => m.prefecture === pref && m.city === city
  );
}

export function getFleaMarketsByCategory(cat: string): FleaMarket[] {
  return getAllFleaMarkets().filter((m) => m.category === cat);
}

export function getAllPrefectures(): string[] {
  return [...new Set(getAllFleaMarkets().map((m) => m.prefecture))]
    .filter(Boolean)
    .sort();
}

export function getAllCategories(): string[] {
  return [...new Set(getAllFleaMarkets().map((m) => m.category))]
    .filter(Boolean)
    .sort();
}

export function getCitiesByPrefecture(pref: string): string[] {
  return [
    ...new Set(
      getAllFleaMarkets()
        .filter((m) => m.prefecture === pref)
        .map((m) => m.city)
    ),
  ]
    .filter(Boolean)
    .sort();
}
