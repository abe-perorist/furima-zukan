import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllFleaMarkets, getFleaMarketBySlug } from "@/lib/data";
import { generateFleaMarketMetadata } from "@/lib/seo";
import { getCategoryTheme } from "@/lib/categoryTheme";
import { haversineDistance } from "@/lib/geo";
import { formatFullDate } from "@/lib/schedule";
import FleaMarketCard from "@/components/FleaMarketCard";
import type { Metadata } from "next";

/** Safely serialize JSON-LD to prevent </script> injection */
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function buildGoogleMapsUrl(market: {
  name: string;
  prefecture: string;
  city: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}): string {
  if (market.latitude && market.longitude) {
    return `https://www.google.com/maps?q=${market.latitude},${market.longitude}`;
  }
  const query = encodeURIComponent(
    `${market.prefecture}${market.city}${market.address || ""} ${market.name}`
  );
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllFleaMarkets().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const market = getFleaMarketBySlug(slug);
  if (!market) return {};
  return generateFleaMarketMetadata(market);
}

export default async function FleaMarketPage({ params }: Props) {
  const { slug } = await params;
  const market = getFleaMarketBySlug(slug);

  if (!market) notFound();

  const theme = getCategoryTheme(market.category);
  const mapsUrl = buildGoogleMapsUrl(market);

  const forWhom = [
    market.is_free_entry && { icon: "🆓", text: "入場無料で気軽に楽しめる" },
    market.has_parking && { icon: "🚗", text: "車でのアクセスOK" },
    market.has_food && { icon: "🍽️", text: "飲食ブースで食事も楽しめる" },
    market.category === "ハンドメイド・クラフト" && { icon: "🎨", text: "作家物・一点モノが見つかる" },
    market.category === "骨董・アンティーク" && { icon: "🏺", text: "掘り出し物が見つかるかも" },
  ].filter(Boolean) as { icon: string; text: string }[];

  const nearbyMarkets =
    market.latitude && market.longitude
      ? getAllFleaMarkets()
          .filter(
            (m) => m.slug !== market.slug && m.latitude && m.longitude
          )
          .map((m) => ({
            ...m,
            distanceKm: haversineDistance(
              market.latitude!,
              market.longitude!,
              m.latitude!,
              m.longitude!
            ),
          }))
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, 3)
      : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: market.name,
    description: market.highlights || market.notes,
    location: {
      "@type": "Place",
      name: market.venue || market.name,
      address: {
        "@type": "PostalAddress",
        addressRegion: market.prefecture,
        addressLocality: market.city,
        streetAddress: market.address || undefined,
        addressCountry: "JP",
      },
    },
    ...(market.latitude && market.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: market.latitude,
            longitude: market.longitude,
          },
        }
      : {}),
    url: market.official_url || undefined,
    isAccessibleForFree: market.is_free_entry,
    organizer: market.organizer
      ? { "@type": "Organization", name: market.organizer }
      : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://furima-zukan.vercel.app"}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: market.prefecture,
        item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://furima-zukan.vercel.app"}/prefecture/${encodeURIComponent(market.prefecture)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: market.name,
        item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://furima-zukan.vercel.app"}/flea-market/${market.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-emerald-700 mb-4 flex flex-wrap gap-1 items-center">
        <Link href="/" className="hover:text-emerald-600">🏠 ホーム</Link>
        <span className="text-emerald-400">/</span>
        <Link
          href={`/prefecture/${encodeURIComponent(market.prefecture)}`}
          className="hover:text-emerald-600"
        >
          {market.prefecture}
        </Link>
        {market.city && (
          <>
            <span className="text-emerald-400">/</span>
            <Link
              href={`/prefecture/${encodeURIComponent(market.prefecture)}/${encodeURIComponent(market.city)}`}
              className="hover:text-emerald-600"
            >
              {market.city}
            </Link>
          </>
        )}
        <span className="text-emerald-400">/</span>
        <span className="text-emerald-900 font-medium">{market.name}</span>
      </nav>

      {/* Main card */}
      <div className={`${theme.bgLight} rounded-3xl border-2 ${theme.borderColor} shadow-sm overflow-hidden`}>
        <div className={`h-2 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo}`} />

        <div className="p-6 md:p-8">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`rounded-full ${theme.badgeBg} ${theme.badgeText} text-sm font-bold px-3 py-1`}>
              {theme.emoji} {market.category}
            </span>
            {market.is_free_entry && (
              <span className="rounded-full bg-green-200 text-green-800 text-sm font-bold px-3 py-1">
                🆓 入場無料
              </span>
            )}
            {market.has_food && (
              <span className="rounded-full bg-orange-200 text-orange-800 text-sm font-bold px-3 py-1">
                🍽️ 飲食あり
              </span>
            )}
            {market.has_parking && (
              <span className="rounded-full bg-sky-200 text-sky-800 text-sm font-bold px-3 py-1">
                🚗 駐車場あり
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {market.name}
          </h1>
          {market.organizer && (
            <p className="text-gray-500 text-lg mb-4">主催：{market.organizer}</p>
          )}
          {market.highlights && (
            <ul className="mb-6 space-y-2">
              {market.highlights
                .split("。")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((s) => (
                  <li key={s} className="flex gap-2 text-gray-700 leading-relaxed">
                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">▶</span>
                    <span>{s}。</span>
                  </li>
                ))}
            </ul>
          )}

          {/* クイックファクト */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <QuickFact
              icon="📅"
              label="開催日"
              value={market.schedule_text || "要確認"}
            />
            <QuickFact
              icon="🕐"
              label="開催時間"
              value={market.opening_hours || "要確認"}
            />
            <QuickFact
              icon="💴"
              label="入場料"
              value={market.is_free_entry ? "無料" : (market.entry_fee || "要確認")}
              highlight={market.is_free_entry}
            />
          </div>

          {/* こんな人向け */}
          {forWhom.length > 0 && (
            <div className="bg-white/70 rounded-2xl p-4 mb-6">
              <p className="text-sm font-bold text-emerald-700 mb-2">✅ こんな人におすすめ</p>
              <ul className="flex flex-wrap gap-2">
                {forWhom.map((item) => (
                  <li
                    key={item.text}
                    className="flex items-center gap-1.5 text-sm bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 text-emerald-900"
                  >
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 基本情報 */}
          <div className="bg-white/70 rounded-2xl p-4 mb-4">
            <p className="text-sm font-bold text-emerald-700 mb-3">📋 基本情報</p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <InfoRow label="📅 開催日" value={market.schedule_text || "要確認"} />
              <InfoRow label="🕐 時間" value={market.opening_hours || "要確認"} />
              <InfoRow label="💴 入場料" value={market.is_free_entry ? "無料" : (market.entry_fee || "要確認")} />
              {market.venue && (
                <InfoRow label="🏛️ 会場" value={market.venue} />
              )}
            </dl>
          </div>

          {/* アクセス */}
          <div className="bg-white/70 rounded-2xl p-4 mb-6">
            <p className="text-sm font-bold text-emerald-700 mb-3">🗺 アクセス</p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <InfoRow
                label="📍 住所"
                value={`${market.prefecture}${market.city}${market.address ? `　${market.address}` : ""}`}
              />
              {market.nearest_station && (
                <InfoRow
                  label="🚉 最寄り駅"
                  value={`${market.nearest_station}${market.walk_min ? `（徒歩約${market.walk_min}分）` : ""}`}
                />
              )}
              {market.access_text && (
                <InfoRow label="🚗 アクセス" value={market.access_text} className="sm:col-span-2" />
              )}
            </dl>
          </div>

          {/* 今後の開催スケジュール */}
          {market.upcoming_dates.length > 0 ? (
            <div className="bg-white/70 rounded-2xl p-4 mb-6">
              <p className="text-sm font-bold text-emerald-700 mb-3">📅 今後の開催スケジュール</p>
              <ul className="space-y-1.5">
                {market.upcoming_dates.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm text-gray-800">
                    <span className="text-emerald-400 font-bold shrink-0">▶</span>
                    {formatFullDate(d)}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white/70 rounded-2xl p-4 mb-6">
              <p className="text-sm font-bold text-emerald-700 mb-1">📅 開催スケジュール</p>
              <p className="text-sm text-gray-700">{market.schedule_text}</p>
              <p className="text-xs text-gray-500 mt-1">最新の開催日程は公式サイト・主催者にご確認ください。</p>
            </div>
          )}

          {/* Notes */}
          {market.notes && (
            <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-200 p-4 mb-6">
              <p className="text-sm font-bold text-emerald-800 mb-1">📌 ご注意・補足情報</p>
              <p className="text-sm text-emerald-700 leading-relaxed">{market.notes}</p>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            {market.official_url && (
              <a
                href={market.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                公式サイトを見る ↗
              </a>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-green-400 text-green-700 px-6 py-3 text-sm font-bold hover:bg-green-50 transition-all duration-200"
            >
              🗺 地図で確認
            </a>
          </div>
        </div>
      </div>

      {/* 近くのフリマ */}
      {nearbyMarkets.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-emerald-900 mb-4">
            📍 近くのフリーマーケット
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {nearbyMarkets.map((m) => (
              <FleaMarketCard
                key={m.slug}
                market={m}
                distanceLabel={m.distanceKm < 1 ? `${Math.round(m.distanceKm * 1000)}m` : `${m.distanceKm.toFixed(1)}km`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Navigation links */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href={`/prefecture/${encodeURIComponent(market.prefecture)}`}
          className="text-sm font-bold text-emerald-600 hover:text-emerald-800 hover:underline"
        >
          ← {market.prefecture}のフリマ一覧
        </Link>
        {market.category && (
          <Link
            href={`/category/${encodeURIComponent(market.category)}`}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-800 hover:underline"
          >
            {theme.emoji} {market.category}の一覧 →
          </Link>
        )}
      </div>
    </>
  );
}

function QuickFact({ icon, label, value, highlight }: { icon: string; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-3 text-center ${highlight ? "bg-green-50 border-2 border-green-200" : "bg-white/60 border-2 border-emerald-100"}`}>
      <div className="text-xl mb-0.5">{icon}</div>
      <div className="text-xs text-emerald-600 font-medium mb-0.5">{label}</div>
      <div className={`text-sm font-bold leading-tight ${highlight ? "text-green-700" : "text-gray-900"}`}>{value}</div>
    </div>
  );
}

function InfoRow({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex gap-2 bg-white/60 rounded-xl px-3 py-2 ${className ?? ""}`}>
      <dt className="text-sm font-bold text-emerald-700 min-w-[100px] shrink-0">{label}</dt>
      <dd className="text-sm text-gray-900">{value}</dd>
    </div>
  );
}
