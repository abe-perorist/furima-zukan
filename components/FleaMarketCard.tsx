import Link from "next/link";
import type { FleaMarket } from "@/lib/data";
import { getCategoryTheme } from "@/lib/categoryTheme";
import { formatShortDate, toYearMonth } from "@/lib/schedule";

interface Props {
  market: FleaMarket;
  distanceLabel?: string;
  filterMonth?: string; // "YYYY-MM" — 指定されたらその月の日程を強調表示
}

export default function FleaMarketCard({ market, distanceLabel, filterMonth }: Props) {
  const theme = getCategoryTheme(market.category);

  // 表示する直近日程を決定
  const displayDates = (() => {
    if (filterMonth) {
      return market.upcoming_dates
        .filter((d) => toYearMonth(d) === filterMonth)
        .slice(0, 3);
    }
    return market.upcoming_dates.slice(0, 2);
  })();

  return (
    <Link
      href={`/flea-market/${market.slug}`}
      className={`group block rounded-2xl border-2 ${theme.borderColor} ${theme.bgLight} shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 overflow-hidden relative`}
    >
      {/* Category accent stripe */}
      <div className={`h-1.5 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo}`} />

      {/* Decorative category emoji */}
      <div className="absolute top-4 right-3 text-4xl opacity-15 select-none pointer-events-none">
        {theme.emoji}
      </div>

      <div className="p-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {distanceLabel && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-2.5 py-1">
              📍 {distanceLabel}
            </span>
          )}
          {market.is_free_entry && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-green-200 text-green-800 text-xs font-bold px-2.5 py-1">
              🆓 入場無料
            </span>
          )}
          {market.has_food && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-200 text-orange-800 text-xs font-bold px-2.5 py-1">
              🍽️ 飲食あり
            </span>
          )}
          {market.has_parking && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-200 text-sky-800 text-xs font-bold px-2.5 py-1">
              🚗 駐車場あり
            </span>
          )}
        </div>

        {/* Market name */}
        <h2 className="font-bold text-lg text-gray-900 leading-snug mb-1 line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {market.name}
        </h2>

        <p className="text-sm text-gray-600 mb-2">
          📍 {market.prefecture}
          {market.city && market.city !== market.prefecture ? `・${market.city}` : ""}
        </p>

        {/* 開催日程 */}
        {displayDates.length > 0 ? (
          <div className="mt-2 space-y-1">
            {displayDates.map((d) => (
              <p key={d} className="text-sm font-bold text-emerald-700">
                📅 {formatShortDate(d)}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            📅 {market.schedule_text}
          </p>
        )}
      </div>
    </Link>
  );
}
