"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import FleaMarketCard from "./FleaMarketCard";
import FilterBar from "./FilterBar";
import type { FleaMarket } from "@/lib/data";
import { toYearMonth } from "@/lib/schedule";

interface Props {
  markets: FleaMarket[];
  prefectures: string[];
  categories: string[];
  availableMonths: string[];
}

function FleaMarketListInner({ markets, prefectures, categories, availableMonths }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const prefecture = searchParams.get("prefecture") ?? "";
  const category = searchParams.get("category") ?? "";
  const month = searchParams.get("month") ?? "";
  const freeOnly = searchParams.get("free") === "1";
  const foodOnly = searchParams.get("food") === "1";
  const parkingOnly = searchParams.get("parking") === "1";

  const activeCount = [prefecture, category, month, freeOnly, foodOnly, parkingOnly]
    .filter(Boolean).length;

  const filtered = useMemo(() => {
    return markets.filter((m) => {
      if (prefecture && m.prefecture !== prefecture) return false;
      if (category && m.category !== category) return false;
      if (freeOnly && !m.is_free_entry) return false;
      if (foodOnly && !m.has_food) return false;
      if (parkingOnly && !m.has_parking) return false;
      if (month) {
        // 指定月に開催日があるか（irregular は upcoming_dates が空なので除外）
        const hasDateInMonth = m.upcoming_dates.some(
          (d) => toYearMonth(d) === month
        );
        if (!hasDateInMonth) return false;
      }
      return true;
    });
  }, [markets, prefecture, category, month, freeOnly, foodOnly, parkingOnly]);

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <>
      {/* Sticky filter bar */}
      <div className="sticky top-14 z-30 -mx-4 px-4 py-2 bg-[#F0FDF4]/95 backdrop-blur-sm border-b border-emerald-100 shadow-sm mb-2">
        <FilterBar
          prefectures={prefectures}
          categories={categories}
          availableMonths={availableMonths}
        />
        {activeCount > 0 && (
          <div className="flex items-center gap-2 mt-2 pb-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 rounded-full px-2.5 py-1">
              🔍 {activeCount}件の条件で絞り込み中
            </span>
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-gray-500 hover:text-red-600 underline transition-colors"
            >
              クリア
            </button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-500 text-lg mb-4">条件に合うフリマが見つかりませんでした。</p>
          <button
            onClick={clearFilters}
            className="rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-800 text-sm font-bold px-5 py-2 hover:bg-emerald-200 transition-colors"
          >
            絞り込みをクリアする
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm font-bold text-emerald-700 mb-4 mt-4">
            🏷️ {filtered.length}件みつかりました
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {filtered.map((market) => (
              <FleaMarketCard key={market.slug} market={market} filterMonth={month || undefined} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default function FleaMarketListClient(props: Props) {
  return (
    <Suspense
      fallback={<div className="h-24 bg-emerald-50 rounded-2xl animate-pulse mb-6" />}
    >
      <FleaMarketListInner {...props} />
    </Suspense>
  );
}
