import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "フリマ図鑑のプライバシーポリシーです。",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <nav className="text-sm text-emerald-700 mb-6 flex gap-1 items-center">
        <Link href="/" className="hover:text-emerald-600">🏠 ホーム</Link>
        <span className="text-emerald-400">/</span>
        <span className="text-emerald-900">プライバシーポリシー</span>
      </nav>

      <h1 className="text-2xl font-bold text-emerald-900 mb-8">プライバシーポリシー</h1>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-bold text-base text-gray-900 mb-2">1. 基本方針</h2>
          <p>
            フリマ図鑑（以下「本サイト」）は、ユーザーの個人情報の取り扱いについて、
            以下のとおりプライバシーポリシーを定めます。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-900 mb-2">2. 収集する情報</h2>
          <p className="mb-2">本サイトでは以下の情報を収集する場合があります。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>位置情報</strong>：「現在地から探す」機能を使用した場合のみ、
              ブラウザの Geolocation API を通じて取得します。
              位置情報はお客様のブラウザ上でのみ処理され、サーバーへの送信・保存は行いません。
            </li>
            <li>
              <strong>アクセス情報</strong>：Google Analytics 4（GA4）により、
              ページビュー・滞在時間・流入元などのアクセス情報を収集しています。
              個人を特定できる情報は含まれません。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-900 mb-2">3. Cookieの使用</h2>
          <p>
            本サイトは Google Analytics のために Cookie を使用します。
            Cookie はブラウザの設定から無効化することができます。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-900 mb-2">4. Google Analyticsについて</h2>
          <p className="mb-2">
            本サイトはトラフィック分析のため Google Analytics を使用しています。
            収集されたデータは Google のプライバシーポリシーに従い管理されます。
          </p>
          <p>
            Google Analytics のオプトアウトは
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline ml-1"
            >
              Google アナリティクス オプトアウト アドオン
            </a>
            をご利用ください。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-900 mb-2">5. 外部リンクについて</h2>
          <p>
            本サイトには各フリマの公式サイトへのリンクが含まれます。
            外部サイトのプライバシーポリシーについては各サイトをご確認ください。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-900 mb-2">6. 免責事項</h2>
          <p>
            掲載フリマの情報（開催日程・場所・入場料など）は公式サイト等をもとに作成していますが、
            変更・中止される場合があります。最新情報は各フリマの公式サイト・主催者にご確認ください。
            本サイトの情報をもとに生じたトラブルや損害について、当サイトは責任を負いかねます。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-900 mb-2">7. プライバシーポリシーの変更</h2>
          <p>
            本ポリシーは、必要に応じて改定することがあります。
            改定後のポリシーは本ページに掲載した時点で効力を生じます。
          </p>
        </section>

        <p className="text-gray-400 text-xs pt-4 border-t border-gray-200">
          制定日：2026年4月3日
        </p>
      </div>
    </div>
  );
}
