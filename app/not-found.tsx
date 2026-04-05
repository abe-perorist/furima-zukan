import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <p className="text-6xl mb-4">🏷️</p>
      <h1 className="text-2xl font-bold text-emerald-900 mb-3">
        ページが見つかりません
      </h1>
      <p className="text-emerald-700 mb-8">
        このフリマ情報は存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
      >
        🏠 トップに戻る
      </Link>
    </div>
  );
}
