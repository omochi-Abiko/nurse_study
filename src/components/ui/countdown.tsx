"use client";

import * as React from "react";
import Link from "next/link";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import { Calendar, ChevronRight, Flame } from "lucide-react";

interface CountdownProps {
  className?: string;
  variant?: "default" | "compact";
}

export function ExamCountdown({ className, variant = "default" }: CountdownProps) {
  const getDaysUntilExam = useAppStore((state) => state.getDaysUntilExam);
  const examSettings = useAppStore((state) => state.examSettings);

  // ハイドレーション後にのみストア値を使用
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // サーバー側ではnullを返す（ハイドレーション一致のため）
  const daysUntil = isMounted ? getDaysUntilExam() : null;

  // コンパクトバリアント
  if (variant === "compact") {
    if (daysUntil === null) {
      return (
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 rounded-full text-xs text-neutral-500 hover:bg-neutral-200 transition-colors",
            className
          )}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>国試日を設定</span>
        </Link>
      );
    }

    if (daysUntil < 0) {
      return (
        <div
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 rounded-full",
            className
          )}
        >
          <span className="text-xs text-primary-600 font-medium">お疲れ様！</span>
        </div>
      );
    }

    if (daysUntil === 0) {
      return (
        <div
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 bg-warning-100 rounded-full animate-pulse",
            className
          )}
        >
          <Flame className="h-3.5 w-3.5 text-warning-600" />
          <span className="text-xs font-bold text-warning-700">今日が国試！</span>
        </div>
      );
    }

    const urgencyClass = daysUntil <= 7
      ? "bg-warning-100 text-warning-700"
      : daysUntil <= 30
        ? "bg-primary-100 text-primary-700"
        : "bg-neutral-100 text-neutral-700";

    return (
      <Link
        href="/settings"
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors",
          urgencyClass,
          className
        )}
      >
        <Calendar className="h-3.5 w-3.5" />
        <span className="text-xs font-bold">{daysUntil}</span>
        <span className="text-xs">日</span>
      </Link>
    );
  }

  // デフォルトバリアント（既存のデザイン）
  // 国試日付が設定されていない場合
  if (daysUntil === null) {
    return (
      <Link
        href="/settings"
        className={cn(
          "flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200 hover:bg-neutral-100 transition-colors",
          className
        )}
      >
        <div className="p-2 bg-neutral-100 rounded-lg">
          <Calendar className="h-5 w-5 text-neutral-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-neutral-600">国試日を設定しよう</p>
          <p className="text-xs text-neutral-400">カウントダウンが表示されます</p>
        </div>
        <ChevronRight className="h-5 w-5 text-neutral-300" />
      </Link>
    );
  }

  // 国試が過ぎた場合
  if (daysUntil < 0) {
    return (
      <div
        className={cn(
          "p-4 bg-primary-50 rounded-xl border border-primary-100",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Calendar className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary-700">お疲れ様でした！</p>
            <p className="text-xs text-primary-500">
              国試から{Math.abs(daysUntil)}日が経ちました
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 国試当日
  if (daysUntil === 0) {
    return (
      <div
        className={cn(
          "p-4 bg-warning-50 rounded-xl border border-warning-200 animate-pulse",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-warning-100 rounded-lg">
            <Calendar className="h-5 w-5 text-warning-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-warning-700">今日が国試！</p>
            <p className="text-xs text-warning-500">落ち着いて頑張って！</p>
          </div>
        </div>
      </div>
    );
  }

  // 残り日数の色分け
  const getColorClasses = () => {
    if (daysUntil <= 7) {
      return {
        bg: "bg-warning-50",
        border: "border-warning-200",
        icon: "bg-warning-100",
        iconColor: "text-warning-600",
        text: "text-warning-700",
        subtext: "text-warning-500",
        number: "text-warning-600",
      };
    }
    if (daysUntil <= 30) {
      return {
        bg: "bg-primary-50",
        border: "border-primary-100",
        icon: "bg-primary-100",
        iconColor: "text-primary-600",
        text: "text-primary-700",
        subtext: "text-primary-500",
        number: "text-primary-600",
      };
    }
    return {
      bg: "bg-neutral-50",
      border: "border-neutral-200",
      icon: "bg-neutral-100",
      iconColor: "text-neutral-600",
      text: "text-neutral-700",
      subtext: "text-neutral-500",
      number: "text-neutral-600",
    };
  };

  const colors = getColorClasses();

  // 励ましメッセージ
  const getMessage = () => {
    if (daysUntil <= 7) return "ラストスパート！";
    if (daysUntil <= 14) return "もう少しだよ！";
    if (daysUntil <= 30) return "1ヶ月切ったね！";
    if (daysUntil <= 60) return "コツコツ続けよう！";
    if (daysUntil <= 90) return "3ヶ月前だよ！";
    return "計画的に進めよう！";
  };

  return (
    <div
      className={cn(
        "p-4 rounded-xl border",
        colors.bg,
        colors.border,
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", colors.icon)}>
          <Calendar className={cn("h-5 w-5", colors.iconColor)} />
        </div>
        <div className="flex-1">
          <p className={cn("text-sm font-medium", colors.text)}>国試まで</p>
          <div className="flex items-baseline gap-1">
            <span className={cn("text-2xl font-bold", colors.number)}>
              {daysUntil}
            </span>
            <span className={cn("text-sm", colors.subtext)}>日</span>
          </div>
        </div>
        <div className="text-right">
          <p className={cn("text-xs", colors.subtext)}>
            {examSettings?.examDate &&
              new Date(examSettings.examDate).toLocaleDateString("ja-JP", {
                month: "long",
                day: "numeric",
              })}
          </p>
          <p className={cn("text-xs font-medium mt-0.5", colors.text)}>
            {getMessage()}
          </p>
        </div>
      </div>
    </div>
  );
}
