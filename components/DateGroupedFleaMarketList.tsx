"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { FleaMarket } from "@/lib/data";
import {
  formatFullDate,
  formatYearMonth,
  toYearMonth,
  getUpcomingMonths,
} from "@/lib/schedule";
import FleaMarketCard from "./FleaMarketCard";

interface Props {
  markets: FleaMarket[];
  basePath: string; // e.g. "/area/tokyo" or "/prefecture/東京都"
}

function Inner({ markets, basePath }: Props) {
  const searchParams = useSearchParams();
  const selectedMonth = searchParams.get("month") ?? "";
  const availableMonths = getUpcomingMonths(5);

  const { dateGroups, noDate } = useMemo(() => {
    const map = new Map<string, FleaMarket[]>();
    const noDate: FleaMarket[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() + 56); // 8週先まで

    for (const market of markets) {
      let dates: string[];

      if (selectedMonth) {
        dates = market.upcoming_dates.filter(
          (d) => toYearMonth(d) === selectedMonth
        );
      } else {
        // デフォルト: 直近8週
        dates = market.upcoming_dates.filter((d) => {
          const dt = new Date(d + "T00:00:00");
          return dt >= today && dt <= cutoffDate;
        });
      }

      if (dates.length === 0) {
        // 月指定ありの場合はnoDateに入れない（その月に開催なしなので非表示）
        if (!selectedMonth) noDate.push(market);
        continue;
      }

      for (const d of dates) {
        if (!map.has(d)) map.set(d, []);
        map.get(d)!.push(market);
      }
    }

    const dateGroups = [...map.entries()].sort(([a], [b]) =>
      a.localeCompare(b)
    );

    return { dateGroups, noDate };
  }, [markets, selectedMonth]);

  return (
    <div>
      {/* 月フィルタータブ */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={basePath}
          className={`rounded-full px-4 py-2 text-sm font-bold border-2 transition-colors ${
            !selectedMonth
              ? "bg-emerald-500 text-white border-emerald-500"
              : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50"
          }`}
        >
          直近8週
        </Link>
        {availableMonths.map((ym) => (
          <Link
            key={ym}
            href={`${basePath}?month=${ym}`}
            className={`rounded-full px-4 py-2 text-sm font-bold border-2 transition-colors ${
              selectedMonth === ym
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50"
            }`}
          >
            {formatYearMonth(ym)}
          </Link>
        ))}
      </div>

      {/* 日付グループ表示 */}
      {dateGroups.length > 0 ? (
        dateGroups.map(([date, dayMarkets]) => (
          <div key={date} className="mb-8">
            <div className="bg-emerald-100 border-l-4 border-emerald-500 px-4 py-2.5 mb-4 rounded-r-xl">
              <h2 className="font-bold text-emerald-900 text-lg">
                {formatFullDate(date)}
              </h2>
              <p className="text-xs text-emerald-600 mt-0.5">
                {dayMarkets.length}件のフリマ
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dayMarkets.map((market) => (
                <FleaMarketCard key={market.slug} market={market} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-emerald-700 text-center py-12">
          {selectedMonth
            ? "この月の開催予定はありません。"
            : "直近8週間の開催予定はありません。"}
        </p>
      )}

      {/* 日程未定・不定期 */}
      {noDate.length > 0 && (
        <div className="mb-8">
          <div className="bg-gray-100 border-l-4 border-gray-400 px-4 py-2.5 mb-4 rounded-r-xl">
            <h2 className="font-bold text-gray-700">
              📌 開催日程調整中・不定期開催
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              最新情報は各フリマの公式サイトをご確認ください
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {noDate.map((market) => (
              <FleaMarketCard key={market.slug} market={market} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DateGroupedFleaMarketList(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="text-sm font-bold text-emerald-700 mb-4">
          読み込み中...
        </div>
      }
    >
      <Inner {...props} />
    </Suspense>
  );
}
