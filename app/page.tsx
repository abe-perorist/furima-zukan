import {
  getAllFleaMarkets,
  getAllPrefectures,
  getAllCategories,
} from "@/lib/data";
import { getCategoryTheme } from "@/lib/categoryTheme";
import { getUpcomingMonths } from "@/lib/schedule";
import FleaMarketListClient from "@/components/FleaMarketListClient";
import NearbySearch from "@/components/NearbySearch";
import Link from "next/link";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://furima-zukan.vercel.app";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "フリマ図鑑",
  url: BASE_URL,
  description:
    "全国のフリーマーケット情報を掲載。骨董・アンティーク・ハンドメイド・雑貨など。都道府県別・カテゴリ別に検索できます。",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const REGIONS = [
  { label: "北海道・東北", prefs: ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"] },
  { label: "関東", prefs: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"] },
  { label: "中部", prefs: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"] },
  { label: "近畿", prefs: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"] },
  { label: "中国・四国", prefs: ["鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県"] },
  { label: "九州・沖縄", prefs: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"] },
];

export default function HomePage() {
  const allMarkets = getAllFleaMarkets();
  const prefectures = getAllPrefectures();
  const categories = getAllCategories();
  const availableMonths = getUpcomingMonths(6);

  const prefectureCounts: Record<string, number> = {};
  allMarkets.forEach((m) => {
    if (m.prefecture) {
      prefectureCounts[m.prefecture] = (prefectureCounts[m.prefecture] ?? 0) + 1;
    }
  });

  const categoryCounts: Record<string, number> = {};
  allMarkets.forEach((m) => {
    if (m.category) {
      categoryCounts[m.category] = (categoryCounts[m.category] ?? 0) + 1;
    }
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
    <div>
      {/* Hero section */}
      <div className="bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 rounded-3xl p-6 md:p-10 mb-8 border-2 border-emerald-200/50">
        <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-3">
          🏷️ 全国のフリーマーケット
          <span className="text-emerald-500"> {allMarkets.length}</span>件
        </h1>
        <p className="text-emerald-800 text-lg leading-relaxed">
          骨董・ハンドメイド・雑貨・アンティーク。お気に入りのフリマを見つけよう！
        </p>
      </div>

      {/* Quick filter buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/?free=1"
          className="inline-flex items-center gap-1.5 rounded-full bg-green-100 border-2 border-green-300 text-green-800 text-sm font-bold px-4 py-2 hover:bg-green-200 transition-colors"
        >
          🆓 入場無料
        </Link>
        <Link
          href="/?parking=1"
          className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 border-2 border-sky-300 text-sky-800 text-sm font-bold px-4 py-2 hover:bg-sky-200 transition-colors"
        >
          🚗 駐車場あり
        </Link>
        <Link
          href="/?food=1"
          className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 border-2 border-orange-300 text-orange-800 text-sm font-bold px-4 py-2 hover:bg-orange-200 transition-colors"
        >
          🍽️ 飲食あり
        </Link>
        <Link
          href="/?category=%E3%83%8F%E3%83%B3%E3%83%89%E3%83%A1%E3%82%A4%E3%83%89%E3%83%BB%E3%82%AF%E3%83%A9%E3%83%95%E3%83%88"
          className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 border-2 border-purple-300 text-purple-800 text-sm font-bold px-4 py-2 hover:bg-purple-200 transition-colors"
        >
          🎨 ハンドメイド
        </Link>
      </div>

      {/* Nearby search */}
      <NearbySearch markets={allMarkets} />

      {/* Client-side filter + results */}
      <FleaMarketListClient
        markets={allMarkets}
        prefectures={prefectures}
        categories={categories}
        availableMonths={availableMonths}
      />

      {/* Category section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-emerald-900 mb-4">
          🎪 カテゴリからさがす
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const theme = getCategoryTheme(cat);
            return (
              <Link
                key={cat}
                href={`/category/${encodeURIComponent(cat)}`}
                className={`${theme.bgLight} border-2 ${theme.borderColor} rounded-2xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group`}
              >
                <div className="text-4xl mb-2">{theme.emoji}</div>
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {cat}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {categoryCounts[cat] ?? 0}件のフリマ
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Prefecture section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-emerald-900 mb-4">
          🗾 都道府県からさがす
        </h2>
        <div className="space-y-4">
          {REGIONS.map(({ label, prefs }) => {
            const available = prefs.filter((p) => prefectureCounts[p]);
            if (available.length === 0) return null;
            return (
              <div key={label}>
                <p className="text-xs font-bold text-emerald-500 mb-2">{label}</p>
                <div className="flex flex-wrap gap-2">
                  {available.map((pref) => (
                    <Link
                      key={pref}
                      href={`/prefecture/${encodeURIComponent(pref)}`}
                      className="rounded-full border-2 border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-150"
                    >
                      {pref}
                      <span className="ml-1 text-xs text-emerald-500">
                        {prefectureCounts[pref]}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
    </>
  );
}
