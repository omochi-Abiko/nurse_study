"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";

const errorMessages: Record<string, string> = {
  Configuration: "サーバー設定に問題があります",
  AccessDenied: "アクセスが拒否されました",
  Verification: "認証リンクの有効期限が切れています",
  OAuthSignin: "OAuth認証の開始に失敗しました",
  OAuthCallback: "OAuth認証のコールバックでエラーが発生しました",
  OAuthCreateAccount: "OAuthアカウントの作成に失敗しました",
  EmailCreateAccount: "メールアカウントの作成に失敗しました",
  Callback: "認証コールバックでエラーが発生しました",
  OAuthAccountNotLinked: "このメールアドレスは別の認証方法で登録されています",
  EmailSignin: "メール認証の開始に失敗しました",
  CredentialsSignin: "メールアドレスまたはパスワードが正しくありません",
  SessionRequired: "このページにアクセスするにはログインが必要です",
  Default: "認証中にエラーが発生しました",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-warning-50 via-white to-neutral-50">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-warning-100 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-warning-600" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-neutral-900 mb-2">
          認証エラー
        </h1>

        {/* Error Message */}
        <p className="text-neutral-600 mb-8">
          {errorMessage}
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/auth/signin">
            <Button variant="primary" size="lg" fullWidth>
              ログインページへ戻る
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="lg" fullWidth className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              ホームへ戻る
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-neutral-400">読み込み中...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
