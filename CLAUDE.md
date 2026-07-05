# CLAUDE.md - NurseStudy Project Guide

## Project Overview
NurseStudy（ゴーストレディ）は看護学生の毎日をサポートするPWAアプリです。
実習サポート・国試対策・セルフケアをひとつのアプリで提供します。
**認証・サーバーDBなしの完全静的サイト**として、GitHub Pagesで公開しています。

## Tech Stack
- **Framework**: Next.js 15 (App Router, `output: "export"` による静的エクスポート)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Storage**: localStorage（`src/lib/local-db.ts`。サーバーDBなし）
- **State Management**: Zustand (UI state) + SWR (localStorage読み出しのキャッシュ)
- **Deployment**: GitHub Pages（GitHub Actions: `.github/workflows/deploy.yml`）
  - 公開URL: https://omochi-abiko.github.io/nurse_study/

## Directory Structure
```
src/
├── app/
│   ├── (main)/          # メインアプリ
│   │   ├── page.tsx     # ホーム
│   │   ├── quiz/        # クイズ機能
│   │   ├── review/      # 苦手復習
│   │   ├── practicum/   # 実習関連
│   │   ├── learning/    # 1年生の学習（[id]はgenerateStaticParams）
│   │   ├── glossary/    # 用語集（[id]はgenerateStaticParams）
│   │   ├── tools/       # 点滴計算・タイマー・薬剤検索
│   │   └── ...
│   └── layout.tsx       # ルートレイアウト
├── components/
│   ├── providers/       # AppProvider（SWRConfig）
│   └── ui/              # UIコンポーネント
├── data/
│   ├── questions.ts     # 問題データ（静的）
│   └── drugs.ts         # 薬剤データ（約4MB・dynamic importで遅延ロード）
├── hooks/
│   └── useApi.ts        # SWR hooks
├── lib/
│   ├── local-db.ts      # localStorageラッパー（型定義・読み書きヘルパー）
│   ├── api.ts           # データAPI（localStorage実装。旧サーバーAPI互換）
│   └── drugs-client.ts  # 薬剤検索（クライアントサイド）
├── store/
│   └── index.ts         # Zustand store
└── types/
    └── index.ts         # TypeScript型定義
```

## Key Commands
```bash
npm run dev          # 開発サーバー起動
npm run build        # 静的エクスポート（out/ に出力）
npm run lint         # ESLint実行
npx serve out        # エクスポート結果をローカル配信して確認
```

## Environment Variables
```env
NEXT_PUBLIC_BASE_PATH=  # GitHub Pages用basePath（デプロイ時のみ /nurse_study）
```
ローカル開発では未設定でOK（basePathなしで動く）。

## Data Flow
1. **問題・用語・薬剤データ**: `src/data/*.ts` に静的に保持
2. **回答履歴・苦手問題・ふりかえり・SOAP・設定など**: すべてlocalStorage
   （`src/lib/api.ts` が旧サーバーAPIと同じインターフェース・レスポンス形状で提供）
3. **UIステート**: Zustand + localStorage（クイズセッション等）
4. SWRのfetcherは `/api/xxx?query` 形式のキーをパースしてlocalStorageから返す

## Deployment
- mainブランチへのpushで GitHub Actions が自動ビルド＆デプロイ
- 動的ルート（`glossary/[id]`, `learning/[id]`）は `generateStaticParams` で全ページ生成
- basePath対応: manifest.jsonは相対パス、layout.tsxは `NEXT_PUBLIC_BASE_PATH` を参照

## Design Guidelines
- **カラー**: Primary（ピンク系 #ec4899）、Secondary（ターコイズ系 #14b8a6）、Accent（ラベンダー #a855f7）
- **フォント**: Zen Maru Gothic（丸ゴシック）＋ Noto Sans JP
- **背景**: 桜色がかったクリーム（#fdf6f9）、シャドウはピンク寄りのソフトなもの
- **ターゲット**: 看護学生（女性中心）
- **トーン**: やさしい、励まし、かわいい（ボタンはピル型、角丸大きめ）

## Important Notes
- 問題数が3問未満の場合、dailyQuizは自動再生成される
- Fisher-Yatesシャッフルで日付ベースの決定論的ランダム
- SWRキーは`/api/xxx`形式（クエリパラメータ含む）だが、実体はlocalStorage
- データはブラウザ単位で保存される（端末を変えると引き継がれない）
