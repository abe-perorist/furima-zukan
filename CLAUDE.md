# furima-zukan — フリマ図鑑

## サービス概要
全国のフリーマーケット情報を掲載する静的サイト。
工場見学ガイド（factory-zukan）と同じアーキテクチャで作られている。

## 技術スタック
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- データソース: `data/master_data.csv`（サーバーサイドで読み込み、静的ビルド）

## ルート構成
- `/` — トップ（一覧・フィルタ）
- `/flea-market/[slug]` — フリマ詳細
- `/category/[cat]` — カテゴリ別一覧
- `/prefecture/[pref]` — 都道府県別一覧
- `/prefecture/[pref]/[city]` — 市区町村別一覧
- `/privacy` — プライバシーポリシー

## データフィールド（FleaMarket型）
- `name`: フリマ名
- `organizer`: 主催者
- `category`: カテゴリ（骨董・アンティーク / 雑貨・衣類 / ハンドメイド・クラフト / 農産物・食品 / オールジャンル）
- `prefecture` / `city` / `address`: 所在地
- `venue`: 会場名
- `schedule_text`: 開催スケジュール（例：毎月第1・3日曜日）
- `opening_hours`: 開催時間
- `entry_fee`: 入場料テキスト
- `is_free_entry`: 入場無料フラグ（boolean）
- `has_food`: 飲食出店あり（boolean）
- `has_parking`: 駐車場あり（boolean）
- `access_text` / `nearest_station` / `walk_min`: アクセス情報
- `highlights`: 見どころ（詳細ページに表示）
- `notes`: 備考・注意事項
- `official_url`: 公式URL
- `latitude` / `longitude`: 座標（近くのフリマ検索に使用）
- `slug`: URLスラッグ（自動生成）
- `verified_at`: データ確認日

## フィルタ
- 入場無料（`is_free_entry`）
- 駐車場あり（`has_parking`）
- 飲食あり（`has_food`）
- ハンドメイド系（`category === "ハンドメイド・クラフト"`）

## カラーテーマ
factory-zukanはオレンジ/アンバー系。このサービスはグリーン/エメラルド系。
