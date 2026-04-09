import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPrefectures, getFleaMarketsByPrefecture, getCitiesByPrefecture } from "@/lib/data";
import { slugToPref, prefToSlug, PREF_TO_SLUG } from "@/lib/prefectureSlug";
import { generatePrefectureMetadata } from "@/lib/seo";
import StatChip from "@/components/StatChip";
import DateGroupedFleaMarketList from "@/components/DateGroupedFleaMarketList";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPrefectures()
    .filter((pref) => pref in PREF_TO_SLUG)
    .map((pref) => ({ slug: prefToSlug(pref) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pref = slugToPref(slug);
  if (!pref) return {};
  const markets = getFleaMarketsByPrefecture(pref);
  if (markets.length === 0) return {};
  const base = generatePrefectureMetadata(pref, markets.length);
  return {
    ...base,
    alternates: {
      canonical: `/area/${slug}`,
    },
  };
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const prefecture = slugToPref(slug);
  if (!prefecture) notFound();

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
        <Link href="/area" className="hover:text-emerald-600">エリア一覧</Link>
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

      <DateGroupedFleaMarketList
        markets={markets}
        basePath={`/area/${slug}`}
      />

      <div className="mt-8">
        <Link href="/" className="text-sm font-bold text-emerald-600 hover:text-emerald-800 hover:underline">
          ← 全国のフリマ一覧
        </Link>
      </div>
    </div>
  );
}
