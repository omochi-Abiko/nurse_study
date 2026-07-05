"use client";

import * as React from "react";
import Link from "next/link";
import { flashcardCategories, TOTAL_FLASHCARDS } from "@/data/flashcards";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Layers, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FlashcardsPage() {
  const getCategoryColors = (color: string) => {
    switch (color) {
      case "primary":
        return {
          bg: "bg-primary-50",
          border: "border-primary-200",
          icon: "bg-primary-100",
          text: "text-primary-700",
        };
      case "secondary":
        return {
          bg: "bg-secondary-50",
          border: "border-secondary-200",
          icon: "bg-secondary-100",
          text: "text-secondary-700",
        };
      case "warning":
        return {
          bg: "bg-warning-50",
          border: "border-warning-200",
          icon: "bg-warning-100",
          text: "text-warning-700",
        };
      case "success":
        return {
          bg: "bg-success-50",
          border: "border-success-200",
          icon: "bg-success-100",
          text: "text-success-700",
        };
      default:
        return {
          bg: "bg-neutral-50",
          border: "border-neutral-200",
          icon: "bg-neutral-100",
          text: "text-neutral-700",
        };
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* ヘッダー */}
      <header className="bg-white border-b border-neutral-100 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 -ml-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-neutral-900">フラッシュカード</h1>
            <p className="text-xs text-neutral-500">
              全{TOTAL_FLASHCARDS}枚の用語カード
            </p>
          </div>
        </div>
      </header>

      {/* 全カードで学習ボタン */}
      <div className="px-4 py-4 bg-gradient-to-r from-primary-50 to-secondary-50">
        <Link href="/flashcards/study?all=true">
          <Button variant="primary" size="lg" fullWidth className="gap-2">
            <Shuffle className="h-5 w-5" />
            全カードでシャッフル学習
          </Button>
        </Link>
      </div>

      {/* カテゴリ一覧 */}
      <div className="px-4 py-4 space-y-3">
        <h2 className="text-sm font-medium text-neutral-500 px-1">
          カテゴリから選ぶ
        </h2>

        {flashcardCategories.map((category) => {
          const colors = getCategoryColors(category.color);

          return (
            <Link
              key={category.id}
              href={`/flashcards/study?category=${category.id}`}
              className="block"
            >
              <div
                className={cn(
                  "bg-white rounded-xl shadow-card p-4 flex items-center gap-4",
                  "hover:shadow-md transition-shadow active:scale-[0.98]"
                )}
              >
                {/* アイコン */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center",
                    colors.icon
                  )}
                >
                  <span className="text-2xl">{category.icon}</span>
                </div>

                {/* 情報 */}
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{category.name}</p>
                  <p className="text-sm text-neutral-500">
                    {category.cards.length}枚のカード
                  </p>
                </div>

                {/* 矢印 */}
                <ChevronRight className="h-5 w-5 text-neutral-300" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* 使い方ヒント */}
      <div className="px-4 mt-4">
        <div className="bg-neutral-50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
              <Layers className="h-4 w-4 text-neutral-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700">使い方</p>
              <p className="text-xs text-neutral-500 mt-1">
                カードをタップすると裏面（意味）が表示されます。
                左右にスワイプで次/前のカードに移動できます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
