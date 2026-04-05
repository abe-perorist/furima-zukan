import type { Metadata } from "next";
import type { FleaMarket } from "./data";

export function generateFleaMarketMetadata(market: FleaMarket): Metadata {
  const description = market.highlights
    ? market.highlights.slice(0, 160)
    : `${market.prefecture}${market.city}で開催のフリーマーケット「${market.name}」。${market.schedule_text}開催。`;

  return {
    title: `${market.name} | ${market.prefecture}${market.city}のフリマ`,
    description,
    openGraph: {
      title: market.name,
      description,
      type: "website",
    },
  };
}

export function generatePrefectureMetadata(
  pref: string,
  count: number
): Metadata {
  return {
    title: `${pref}のフリーマーケット 全${count}件`,
    description: `${pref}で開催されるフリーマーケット${count}件を掲載。入場無料・駐車場あり・飲食ありのフリマも。`,
    openGraph: {
      title: `${pref}のフリーマーケット 全${count}件`,
      description: `${pref}で開催されるフリーマーケット${count}件を掲載。`,
      type: "website",
    },
  };
}

export function generateCityMetadata(
  pref: string,
  city: string,
  count: number
): Metadata {
  return {
    title: `${city}のフリーマーケット 全${count}件 | ${pref}`,
    description: `${pref}${city}で開催されるフリーマーケット${count}件を掲載。`,
    openGraph: {
      title: `${city}のフリーマーケット`,
      description: `${pref}${city}のフリーマーケット${count}件。`,
      type: "website",
    },
  };
}

export function generateCategoryMetadata(
  cat: string,
  count: number
): Metadata {
  return {
    title: `${cat}のフリーマーケット 全${count}件`,
    description: `${cat}カテゴリのフリーマーケット${count}件を掲載。`,
    openGraph: {
      title: `${cat}のフリーマーケット`,
      description: `${cat}のフリーマーケット${count}件。`,
      type: "website",
    },
  };
}
