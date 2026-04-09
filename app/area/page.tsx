import Link from "next/link";
import type { Metadata } from "next";
import { getAllFleaMarkets } from "@/lib/data";
import { prefToSlug } from "@/lib/prefectureSlug";

export const metadata: Metadata = {
  title: "エリアからさがす | フリーマーケット情報",
  description:
    "都道府県・エリア別にフリーマーケットを検索。東京・大阪・神奈川など全国のフリマ情報を掲載。",
};

const REGIONS = [
  { label: "北海道・東北", prefs: ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"] },
  { label: "関東", prefs: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"] },
  { label: "中部", prefs: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"] },
  { label: "近畿", prefs: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"] },
  { label: "中国・四国", prefs: ["鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県"] },
  { label: "九州・沖縄", prefs: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"] },
];

export default function AreaIndexPage() {
  const allMarkets = getAllFleaMarkets();
  const prefCounts: Record<string, number> = {};
  for (const m of allMarkets) {
    if (m.prefecture) prefCounts[m.prefecture] = (prefCounts[m.prefecture] ?? 0) + 1;
  }

  return (
    <div>
      <nav className="text-sm text-emerald-700 mb-6 flex flex-wrap gap-1 items-center">
        <Link href="/" className="hover:text-emerald-600">🏠 ホーム</Link>
        <span className="text-emerald-400">/</span>
        <span className="text-emerald-900 font-medium">エリアからさがす</span>
      </nav>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 md:p-10 mb-8 border-2 border-emerald-200">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">
          🗾 エリアからさがす
        </h1>
        <p className="text-emerald-700 text-lg">
          都道府県を選んで、開催スケジュール付きのフリマ一覧を確認できます。
        </p>
      </div>

      <div className="space-y-6">
        {REGIONS.map(({ label, prefs }) => {
          const available = prefs.filter((p) => prefCounts[p]);
          if (available.length === 0) return null;
          return (
            <div key={label}>
              <p className="text-xs font-bold text-emerald-500 mb-3">{label}</p>
              <div className="flex flex-wrap gap-2">
                {available.map((pref) => (
                  <Link
                    key={pref}
                    href={`/area/${prefToSlug(pref)}`}
                    className="rounded-full border-2 border-emerald-200 bg-white px-4 py-2 text-sm font-medium hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-150"
                  >
                    {pref}
                    <span className="ml-1.5 text-xs text-emerald-500 font-bold">
                      {prefCounts[pref]}件
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <Link href="/" className="text-sm font-bold text-emerald-600 hover:text-emerald-800 hover:underline">
          ← 全国のフリマ一覧
        </Link>
      </div>
    </div>
  );
}
