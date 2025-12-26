# CLAUDE.md - NurseStudy Project Guide

## Project Overview
NurseStudy（ゴーストレディ）は看護学生向けの国家試験対策PWAアプリです。

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon (Serverless PostgreSQL)
- **ORM**: Prisma 5
- **Authentication**: NextAuth.js v5 (Auth.js)
- **State Management**: Zustand (UI state) + SWR (server state)
- **Deployment**: Vercel

## Directory Structure
```
src/
├── app/
│   ├── (main)/          # メインアプリ（認証必須）
│   │   ├── page.tsx     # ホーム
│   │   ├── quiz/        # クイズ機能
│   │   ├── review/      # 苦手復習
│   │   ├── practicum/   # 実習関連
│   │   └── ...
│   ├── api/             # API Routes
│   │   ├── auth/        # 認証
│   │   ├── quiz/        # クイズAPI
│   │   └── ...
│   └── auth/            # 認証UI
├── components/
│   └── ui/              # UIコンポーネント
├── data/
│   └── questions.ts     # 問題データ（静的）
├── hooks/
│   └── useApi.ts        # SWR hooks
├── lib/
│   ├── auth.ts          # NextAuth設定
│   ├── prisma.ts        # Prisma client
│   └── api.ts           # APIクライアント
├── store/
│   └── index.ts         # Zustand store
└── types/
    └── index.ts         # TypeScript型定義
```

## Key Commands
```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run lint         # ESLint実行
npx prisma studio    # Prisma Studio（DB GUI）
npx prisma db push   # スキーマをDBに反映
npx prisma generate  # Prisma Client生成
```

## Environment Variables
```env
DATABASE_URL=        # Neon接続文字列（pooler）
DIRECT_URL=          # Neon直接接続文字列
NEXTAUTH_URL=        # アプリURL
NEXTAUTH_SECRET=     # NextAuth秘密鍵
GOOGLE_CLIENT_ID=    # Google OAuth（任意）
GOOGLE_CLIENT_SECRET=# Google OAuth（任意）
```

## Data Flow
1. **問題データ**: `src/data/questions.ts`に静的に保持
2. **回答履歴**: PostgreSQL（QuizAnswer）に保存
3. **苦手問題**: PostgreSQL（WeakQuestion）に保存
4. **UIステート**: Zustand + localStorage（クイズセッション等）

## Authentication
- メール/パスワード認証が実装済み
- Google OAuthは環境変数設定で有効化可能
- `/auth/signin`, `/auth/signup`でログイン/新規登録

## Design Guidelines
- **カラー**: Primary（ピンク系）、Secondary（ターコイズ系）
- **フォント**: Noto Sans JP
- **ターゲット**: 看護学生（女性中心）
- **トーン**: やさしい、励まし、かわいい

## Important Notes
- 問題数が3問未満の場合、dailyQuizは自動再生成される
- Fisher-Yatesシャッフルで日付ベースの決定論的ランダム
- SWRキーは`/api/xxx`形式（クエリパラメータ含む）
