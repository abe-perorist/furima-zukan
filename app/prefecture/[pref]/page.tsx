import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  getAllPrefectures,
  getFleaMarketsByPrefecture,
  getCitiesByPrefecture,
} from "@/lib/data";
import { generatePrefectureMetadata } from "@/lib/seo";
import SortableFleaMarketList from "@/components/SortableFleaMarketList";
import StatChip from "@/components/StatChip";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ pref: string }>;
}

export async function generateStaticParams() {
  return getAllPrefectures().map((pref) => ({ pref }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pref } = await params;
  const decoded = decodeURIComponent(pref);
  const markets = getFleaMarketsByPrefecture(decoded);
  if (markets.length === 0) return {};
  return generatePrefectureMetadata(decoded, markets.length);
}

export default async function PrefecturePage({ params }: Props) {
  const { pref } = await params;
  const prefecture = decodeURIComponent(pref);
  const markets = getFleaMarketsByPrefecture(prefecture);

  if (markets.length === 0) notFound();

  const cities = getCitiesByPrefecture(prefecture);

  const freeCount = markets.filter((m) => m.is_free_entry).length;
  const foodCount = markets.filter((m) => m.has_food).length;
  const parkingCount = markets.filter((m) => m.has_parking).length;

  return (
    <div>
      <nav className="text-sm text-emerald-700 mb-6 flex flex-wrap gap-1 items-center">
        <Link href="/" className="hover:text-emerald-600">🏠 ホーム</Link>
        <span className="text-emerald-400">/</span>
        <span className="text-emerald-900 font-medium">{prefecture}</span>
      </nav>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 md:p-10 mb-6 border-2 border-emerald-200">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">
          🗾 {prefecture}のフリーマーケット
          <span className="text-emerald-500"> 全{markets.length}件</span>
        </h1>
        <p className="text-emerald-700 text-lg">
          {prefecture}で開催されるフリーマーケット情報を掲載。
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatChip icon="🆓" label="入場無料" count={freeCount} color="green" />
        <StatChip icon="🍽️" label="飲食あり" count={foodCount} color="orange" />
        <StatChip icon="🚗" label="駐車場あり" count={parkingCount} color="blue" />
      </div>

      {cities.length > 1 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-emerald-700 mb-2">📍 市区町村でしぼりこむ</h2>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link
                key={city}
                href={`/prefecture/${encodeURIComponent(prefecture)}/${encodeURIComponent(city)}`}
                className="rounded-full border-2 border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-150"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      )}

      <Suspense fallback={<div className="text-sm font-bold text-emerald-700 mb-4">🏷️ {markets.length}件</div>}>
        <SortableFleaMarketList markets={markets} />
      </Suspense>

      <div className="mt-8">
        <Link href="/" className="text-sm font-bold text-emerald-600 hover:text-emerald-800 hover:underline">
          ← 全国のフリマ一覧
        </Link>
      </div>
    </div>
  );
}
