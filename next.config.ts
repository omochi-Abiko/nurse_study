import type { NextConfig } from "next";
import path from "path";

// GitHub Pagesでは https://<user>.github.io/<repo>/ 配下に配信されるため、
// デプロイ時のみ NEXT_PUBLIC_BASE_PATH（例: /nurse_study）を設定する
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 静的サイトとしてエクスポート（GitHub Pages用）
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // ワークスペースルートの警告を解消
  outputFileTracingRoot: path.join(__dirname, "./"),
};

export default nextConfig;
