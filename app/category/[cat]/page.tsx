import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getAllCategories, getFleaMarketsByCategory } from "@/lib/data";
import { generateCategoryMetadata } from "@/lib/seo";
import { getCategoryTheme } from "@/lib/categoryTheme";
import SortableFleaMarketList from "@/components/SortableFleaMarketList";
import StatChip from "@/components/StatChip";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ cat: string }>;
}

export async function generateStaticParams() {
  return getAllCategories().map((cat) => ({ cat }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat } = await params;
  const decoded = decodeURIComponent(cat);
  const markets = getFleaMarketsByCategory(decoded);
  if (markets.length === 0) return {};
  return generateCategoryMetadata(decoded, markets.length);
}

export default async function CategoryPage({ params }: Props) {
  const { cat } = await params;
  const category = decodeURIComponent(cat);
  const markets = getFleaMarketsByCategory(category);

  if (markets.length === 0) notFound();

  const theme = getCategoryTheme(category);

  const freeCount = markets.filter((m) => m.is_free_entry).length;
  const foodCount = markets.filter((m) => m.has_food).length;
  const parkingCount = markets.filter((m) => m.has_parking).length;

  return (
    <div>
      <nav className="text-sm text-emerald-700 mb-6 flex flex-wrap gap-1 items-center">
        <Link href="/" className="hover:text-emerald-600">🏠 ホーム</Link>
        <span className="text-emerald-400">/</span>
        <span className="text-emerald-900 font-medium">{category}</span>
      </nav>

      <div className={`${theme.bgLight} border-2 ${theme.borderColor} rounded-3xl p-6 md:p-10 mb-6`}>
        <div className="text-5xl mb-3">{theme.emoji}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {category}のフリーマーケット
          <span className="text-emerald-500"> 全{markets.length}件</span>
        </h1>
        <p className="text-gray-600 text-lg">
          {category}カテゴリのフリーマーケット情報を掲載しています。
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatChip icon="🆓" label="入場無料" count={freeCount} color="green" />
        <StatChip icon="🍽️" label="飲食あり" count={foodCount} color="orange" />
        <StatChip icon="🚗" label="駐車場あり" count={parkingCount} color="blue" />
      </div>

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
