"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { formatYearMonth } from "@/lib/schedule";

interface Props {
  prefectures: string[];
  categories: string[];
  availableMonths: string[]; // "YYYY-MM"[]
}

export default function FilterBar({ prefectures, categories, availableMonths }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      return params.toString();
    },
    [searchParams]
  );

  const handleChange = (key: string, value: string) => {
    const qs = createQueryString({ [key]: value, page: "" });
    router.push(`${pathname}?${qs}`, { scroll: false });
  };

  const handleToggle = (key: string, current: boolean) => {
    const qs = createQueryString({ [key]: current ? "" : "1", page: "" });
    router.push(`${pathname}?${qs}`, { scroll: false });
  };

  const prefecture = searchParams.get("prefecture") ?? "";
  const category = searchParams.get("category") ?? "";
  const month = searchParams.get("month") ?? "";
  const freeOnly = searchParams.get("free") === "1";
  const foodOnly = searchParams.get("food") === "1";
  const parkingOnly = searchParams.get("parking") === "1";

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 p-5 mb-6 shadow-sm">
      <p className="text-sm font-bold text-emerald-700 mb-3">
        🔍 しぼりこみ検索
      </p>

      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-bold text-emerald-600 mb-1">
            都道府県
          </label>
          <select
            value={prefecture}
            onChange={(e) => handleChange("prefecture", e.target.value)}
            className="w-full rounded-xl border-2 border-emerald-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
          >
            <option value="">🗾 全都道府県</option>
            {prefectures.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-bold text-emerald-600 mb-1">
            カテゴリ
          </label>
          <select
            value={category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full rounded-xl border-2 border-emerald-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
          >
            <option value="">🏷️ 全カテゴリ</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-bold text-emerald-600 mb-1">
            開催月
          </label>
          <select
            value={month}
            onChange={(e) => handleChange("month", e.target.value)}
            className="w-full rounded-xl border-2 border-emerald-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
          >
            <option value="">📅 月を選ぶ</option>
            {availableMonths.map((ym) => (
              <option key={ym} value={ym}>{formatYearMonth(ym)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Toggle pill buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleToggle("free", freeOnly)}
          className={`rounded-full px-4 py-2 text-sm font-bold border-2 transition-all duration-150 ${
            freeOnly
              ? "bg-green-500 text-white border-green-500 shadow-sm"
              : "bg-white text-gray-600 border-gray-300 hover:border-green-400 hover:text-green-600"
          }`}
        >
          🆓 入場無料
        </button>

        <button
          type="button"
          onClick={() => handleToggle("food", foodOnly)}
          className={`rounded-full px-4 py-2 text-sm font-bold border-2 transition-all duration-150 ${
            foodOnly
              ? "bg-orange-500 text-white border-orange-500 shadow-sm"
              : "bg-white text-gray-600 border-gray-300 hover:border-orange-400 hover:text-orange-600"
          }`}
        >
          🍽️ 飲食あり
        </button>

        <button
          type="button"
          onClick={() => handleToggle("parking", parkingOnly)}
          className={`rounded-full px-4 py-2 text-sm font-bold border-2 transition-all duration-150 ${
            parkingOnly
              ? "bg-sky-500 text-white border-sky-500 shadow-sm"
              : "bg-white text-gray-600 border-gray-300 hover:border-sky-400 hover:text-sky-600"
          }`}
        >
          🚗 駐車場あり
        </button>
      </div>
    </div>
  );
}
