# NurseStudy - 看護学生の毎日をサポートするアプリ

忙しい看護学生の毎日に寄り添う、オールインワンPWAアプリ。
実習・勉強・メンタルケアをひとつのアプリで。

## Features

### 実習サポート
- **SOAP記録** - テンプレートで素早く記録作成
- **施設メモ** - 実習先ごとのルール・注意点を管理
- **朝のチェックリスト** - 忘れ物防止

### 国試対策
- **今日の3問** - スキマ時間に無理なく継続
- **自由にクイズ** - 分野別・問題数を選んで挑戦
- **苦手復習** - スワイプ式カードで効率的に復習
- 39問の過去問収録（厚生労働省公開問題）

### セルフケア
- **1行ふりかえり** - 今日の気持ちを記録
- **週間サマリー** - 気分の変化を可視化
- やさしい励ましメッセージ

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
