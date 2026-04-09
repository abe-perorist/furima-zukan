"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-24">
      <p className="text-6xl mb-4">⚠️</p>
      <h1 className="text-2xl font-bold text-emerald-900 mb-3">
        エラーが発生しました
      </h1>
      <p className="text-emerald-700 mb-8">
        ページの読み込み中に問題が発生しました。
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          再試行する
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-400 text-emerald-700 px-6 py-3 text-sm font-bold hover:bg-emerald-50 transition-all duration-200"
        >
          🏠 トップに戻る
        </Link>
      </div>
    </div>
  );
}
