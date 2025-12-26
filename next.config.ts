import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ワークスペースルートの警告を解消
  outputFileTracingRoot: path.join(__dirname, "./"),
};

export default nextConfig;
