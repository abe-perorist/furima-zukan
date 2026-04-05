# furima-zukan 開発進捗

最終更新: 2026-04-06

## 完成済み

### サービス基盤
- [x] Next.js (App Router) + TypeScript + Tailwind CSS v4 構成
- [x] CSVベースの静的サイト（factory-zukanと同アーキテクチャ）
- [x] サンプルデータ 14件（代々木公園、弘法市、大江戸骨董市、仙台朝市など）
- [x] Vercelデプロイ設定

### ページ
- [x] トップページ（一覧・絞り込み・現在地検索）
- [x] 詳細ページ `/flea-market/[slug]`
- [x] 都道府県別 `/prefecture/[pref]`
- [x] 市区町村別 `/prefecture/[pref]/[city]`
- [x] カテゴリ別 `/category/[cat]`（骨董・アンティーク / 雑貨・衣類 / ハンドメイド・クラフト / 農産物・食品 / オールジャンル）
- [x] プライバシーポリシー

### スケジュール機能（独自）
- [x] `lib/schedule.ts` — `schedule_rule` からビルド時に開催日を自動生成
  - `weekly:sat` — 毎週土曜
  - `monthly:1sun,3sun` — 毎月第1・3日曜
  - `monthly:d21` — 毎月21日
  - `monthly:2sun:5-10` — 5〜10月の第2日曜（季節限定）
  - `irregular` — 不定期（テキスト表示にフォールバック）
- [x] カードに直近の開催日を表示
- [x] 詳細ページに今後6ヶ月分のスケジュール一覧
- [x] フィルターで「エリア × 開催月」絞り込み

### SEO・技術
- [x] sitemap.xml / robots.txt
- [x] JSON-LD構造化データ（Event型）
- [x] セキュリティヘッダー
- [x] 現在地からのフリマ検索（Geolocation API）

---

## 今後やること

### 必須（公開前）
- [ ] **データ拡充** — 14件 → 50〜100件目安。実在するフリマを調査してCSVに追加
- [ ] **Vercelデプロイ** — `furima-zukan` ディレクトリを新規Vercelプロジェクトとして登録
- [ ] **定期ビルド設定** — 週1でVercel cron rebuild（開催日を常に最新に）
- [ ] **Google Analytics 設定** — `app/layout.tsx` にGA IDを追加

### あると良い
- [ ] **slug改善** — 現状 `flea-market-1` 形式。読みやすい英語slugに変更
- [ ] **OGP画像** — `opengraph-image.tsx` を追加（factory-zukanと同様）
- [ ] **`irregular` フリマの日程管理** — `extra_dates` 列（YYYY-MM-DD カンマ区切り）を追加し、年数回開催のフリマも月別検索にひっかかるようにする

### 将来的に
- [ ] カレンダービュー（月カレンダーで開催日を一望）
- [ ] 地図ビュー（都道府県ページなどにマップ表示）
