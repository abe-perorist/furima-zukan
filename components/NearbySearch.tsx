"use client";

import { useState, useMemo } from "react";
import { haversineDistance } from "@/lib/geo";
import FleaMarketCard from "./FleaMarketCard";
import type { FleaMarket } from "@/lib/data";

interface Props {
  markets: FleaMarket[];
}

const CATEGORIES = ["骨董・アンティーク", "雑貨・衣類", "ハンドメイド・クラフト", "農産物・食品", "オールジャンル"];

export default function NearbySearch({ markets }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearby, setNearby] = useState<(FleaMarket & { distanceKm: number })[] | null>(null);

  const [category, setCategory] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);
  const [foodOnly, setFoodOnly] = useState(false);
  const [parkingOnly, setParkingOnly] = useState(false);

  const handleSearch = () => {
    if (!navigator.geolocation) {
      setError("お使いのブラウザは位置情報をサポートしていません。");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const withDist = markets
          .filter((m) => m.latitude !== null && m.longitude !== null)
          .map((m) => ({
            ...m,
            distanceKm: haversineDistance(latitude, longitude, m.latitude!, m.longitude!),
          }))
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, 50);
        setNearby(withDist);
        setLoading(false);
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? "位置情報の利用が拒否されました。ブラウザの設定から位置情報を許可してください。"
            : "位置情報の取得に失敗しました。"
        );
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleClear = () => {
    setNearby(null);
    setCategory("");
    setFreeOnly(false);
    setFoodOnly(false);
    setParkingOnly(false);
  };

  const filtered = useMemo(() => {
    if (!nearby) return null;
    return nearby.filter((m) => {
      if (category && m.category !== category) return false;
      if (freeOnly && !m.is_free_entry) return false;
      if (foodOnly && !m.has_food) return false;
      if (parkingOnly && !m.has_parking) return false;
      return true;
    });
  }, [nearby, category, freeOnly, foodOnly, parkingOnly]);

  return (
    <section className="mb-8">
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={handleSearch}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-60 transition-all duration-200"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              さがしています...
            </>
          ) : (
            <>📍 いまいる場所からさがす</>
          )}
        </button>
        {nearby && (
          <button onClick={handleClear} className="text-sm text-emerald-600 font-bold hover:text-emerald-800 underline">
            クリア
          </button>
        )}
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-700 bg-red-100 rounded-xl px-4 py-3 border border-red-200">
          {error}
        </p>
      )}

      {nearby && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-emerald-900 mb-3">
            🗺️ ちかくのフリーマーケット
          </h2>

          {/* Filters */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 mb-4 space-y-3">
            <div>
              <label className="block text-xs font-bold text-emerald-600 mb-1">カテゴリ</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border-2 border-emerald-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">🏷️ すべてのカテゴリ</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { key: "free", label: "🆓 入場無料", active: freeOnly, set: setFreeOnly, activeColor: "bg-green-500 border-green-500 text-white" },
                { key: "food", label: "🍽️ 飲食あり", active: foodOnly, set: setFoodOnly, activeColor: "bg-orange-500 border-orange-500 text-white" },
                { key: "parking", label: "🚗 駐車場あり", active: parkingOnly, set: setParkingOnly, activeColor: "bg-sky-500 border-sky-500 text-white" },
              ].map(({ key, label, active, set, activeColor }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set(!active)}
                  className={`rounded-full px-4 py-2 text-sm font-bold border-2 transition-all duration-150 ${
                    active ? activeColor : "bg-white text-gray-600 border-gray-300 hover:border-emerald-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm font-bold text-emerald-700 mb-4">
            🏷️ {filtered!.length}件みつかりました
          </p>

          {filtered!.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-4xl mb-3">🔍</p>
              <p>条件に合うフリマが見つかりませんでした。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered!.map((m) => (
                <FleaMarketCard
                  key={m.slug}
                  market={m}
                  distanceLabel={m.distanceKm < 1 ? `${Math.round(m.distanceKm * 1000)}m` : `${m.distanceKm.toFixed(1)}km`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
