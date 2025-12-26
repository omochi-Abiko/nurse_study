# NurseStudy - 看護学生のための国試対策アプリ

スキマ時間に3問だけ。毎日続けられる看護師国家試験対策PWAアプリ。

## Features

### 今日の3問
- 毎日3問のクイズで無理なく継続
- 間違えた問題は自動で苦手リストに追加

### 自由にクイズ
- 分野別・問題数を選んで挑戦
- 39問の過去問を収録（厚生労働省公開問題）

### 苦手復習
- スワイプ式カードで効率的に復習
- 「わかった」で削除、「まだ」で継続

### 実習サポート
- SOAP記録の作成・管理
- 実習施設ごとのメモ機能
- 朝のチェックリスト

### ふりかえり
- 1行ふりかえりで気持ちを記録
- 週間サマリーで学習を振り返り

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Neon (PostgreSQL)
- **ORM**: Prisma
- **Auth**: NextAuth.js v5
- **State**: Zustand + SWR

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Neon account (PostgreSQL)

### Installation

```bash
# Clone the repository
git clone https://github.com/omochi-Abiko/nurse_study.git
cd nurse_study

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Setup database
npx prisma db push
npx prisma generate

# Run development server
npm run dev
```

### Environment Variables

```env
# Database (Neon)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Screenshots

Coming soon...

## License

MIT

## Author

株式会社さいとうテックプラス
