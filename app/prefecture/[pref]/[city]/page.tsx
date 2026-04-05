import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  getAllPrefectures,
  getCitiesByPrefecture,
  getFleaMarketsByCity,
} from "@/lib/data";
import { generateCityMetadata } from "@/lib/seo";
import SortableFleaMarketList from "@/components/SortableFleaMarketList";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ pref: string; city: string }>;
}

export async function generateStaticParams() {
  const params: { pref: string; city: string }[] = [];
  for (const pref of getAllPrefectures()) {
    for (const city of getCitiesByPrefecture(pref)) {
      if (city) params.push({ pref, city });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pref, city } = await params;
  const prefecture = decodeURIComponent(pref);
  const cityDecoded = decodeURIComponent(city);
  const markets = getFleaMarketsByCity(prefecture, cityDecoded);
  if (markets.length === 0) return {};
  return generateCityMetadata(prefecture, cityDecoded, markets.length);
}

export default async function CityPage({ params }: Props) {
  const { pref, city } = await params;
  const prefecture = decodeURIComponent(pref);
  const cityDecoded = decodeURIComponent(city);
  const markets = getFleaMarketsByCity(prefecture, cityDecoded);

  if (markets.length === 0) notFound();

  return (
    <div>
      <nav className="text-sm text-emerald-700 mb-6 flex flex-wrap gap-1 items-center">
        <Link href="/" className="hover:text-emerald-600">🏠 ホーム</Link>
        <span className="text-emerald-400">/</span>
        <Link
          href={`/prefecture/${encodeURIComponent(prefecture)}`}
          className="hover:text-emerald-600"
        >
          {prefecture}
        </Link>
        <span className="text-emerald-400">/</span>
        <span className="text-emerald-900 font-medium">{cityDecoded}</span>
      </nav>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 md:p-10 mb-6 border-2 border-emerald-200">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">
          📍 {cityDecoded}のフリーマーケット
          <span className="text-emerald-500"> 全{markets.length}件</span>
        </h1>
        <p className="text-emerald-700">
          {prefecture}{cityDecoded}で開催されるフリーマーケット情報を掲載。
        </p>
      </div>

      <Suspense fallback={<div className="text-sm font-bold text-emerald-700 mb-4">🏷️ {markets.length}件</div>}>
        <SortableFleaMarketList markets={markets} />
      </Suspense>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href={`/prefecture/${encodeURIComponent(prefecture)}`}
          className="text-sm font-bold text-emerald-600 hover:text-emerald-800 hover:underline"
        >
          ← {prefecture}のフリマ一覧
        </Link>
        <Link href="/" className="text-sm font-bold text-emerald-600 hover:text-emerald-800 hover:underline">
          全国のフリマ一覧 →
        </Link>
      </div>
    </div>
  );
}
