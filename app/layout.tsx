import type { Metadata } from "next";
import Link from "next/link";
import BackToTop from "@/components/BackToTop";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "フリマ図鑑 | 全国のフリーマーケット情報",
    template: "%s | フリマ図鑑",
  },
  description:
    "全国のフリーマーケット情報を掲載。骨董・アンティーク・ハンドメイド・雑貨など。都道府県別・カテゴリ別に検索できます。",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://furima-zukan.vercel.app"
  ),
  openGraph: {
    siteName: "フリマ図鑑",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen flex flex-col">
        <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-md">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="font-bold text-xl text-white drop-shadow-sm"
            >
              🏷️ フリマ図鑑
            </Link>
            <nav className="flex gap-2 text-sm">
              <Link
                href="/category/骨董・アンティーク"
                className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-white hover:bg-white/30 transition-colors"
              >
                🏺 骨董
              </Link>
              <Link
                href="/category/ハンドメイド・クラフト"
                className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-white hover:bg-white/30 transition-colors hidden sm:inline-block"
              >
                🎨 ハンドメイド
              </Link>
              <Link
                href="/category/オールジャンル"
                className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-white hover:bg-white/30 transition-colors hidden sm:inline-block"
              >
                🛍️ オールジャンル
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
          {children}
        </main>

        <footer className="mt-16 bg-emerald-50 border-t-2 border-emerald-200">
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-emerald-800">
            <p className="font-bold text-lg mb-2">🏷️ フリマ図鑑</p>
            <p className="text-emerald-700">
              全国のフリーマーケット情報を掲載しています。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full bg-emerald-100 px-3 py-1 hover:bg-emerald-200 transition-colors"
              >
                🏠 ホーム
              </Link>
              <Link
                href="/category/骨董・アンティーク"
                className="rounded-full bg-amber-100 px-3 py-1 hover:bg-amber-200 transition-colors"
              >
                🏺 骨董・アンティーク
              </Link>
              <Link
                href="/category/ハンドメイド・クラフト"
                className="rounded-full bg-purple-100 px-3 py-1 hover:bg-purple-200 transition-colors"
              >
                🎨 ハンドメイド・クラフト
              </Link>
              <Link
                href="/category/雑貨・衣類"
                className="rounded-full bg-pink-100 px-3 py-1 hover:bg-pink-200 transition-colors"
              >
                👗 雑貨・衣類
              </Link>
              <Link
                href="/privacy"
                className="rounded-full bg-emerald-100 px-3 py-1 hover:bg-emerald-200 transition-colors"
              >
                プライバシーポリシー
              </Link>
            </div>
            <p className="mt-4 text-xs text-emerald-600">
              掲載情報は公式サイト等をもとに作成しています。最新情報は各フリマの公式サイト・主催者にご確認ください。
            </p>
          </div>
        </footer>
        <BackToTop />
      </body>
    </html>
  );
}
