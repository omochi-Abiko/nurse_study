"use client";

import * as React from "react";
import Link from "next/link";
import { useLearningProgress } from "@/hooks/useApi";
import { freshmanCategories, FreshmanCategory } from "@/data/freshman-skills";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, Check, Circle, Loader2 } from "lucide-react";

export default function LearningPage() {
  const { skillIds, isLoading, toggleComplete, getStats } = useLearningProgress();

  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);

  const stats = getStats();

  // カテゴリごとの進捗を計算
  const getCategoryProgress = (category: FreshmanCategory) => {
    const completed = category.skills.filter((skill) =>
      skillIds.includes(skill.id)
    ).length;
    return { completed, total: category.skills.length };
  };

  // ローディング表示
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  // カテゴリの色を取得
  const getCategoryColors = (color: FreshmanCategory["color"]) => {
    switch (color) {
      case "primary":
        return {
          bg: "bg-primary-50",
          border: "border-primary-200",
          text: "text-primary-700",
          progress: "bg-primary-500",
        };
      case "secondary":
        return {
          bg: "bg-secondary-50",
          border: "border-secondary-200",
          text: "text-secondary-700",
          progress: "bg-secondary-500",
        };
      case "warning":
        return {
          bg: "bg-warning-50",
          border: "border-warning-200",
          text: "text-warning-700",
          progress: "bg-warning-500",
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
            <h1 className="text-lg font-bold text-neutral-900">1年生の学習</h1>
            <p className="text-xs text-neutral-500">
              {stats.completed}/{stats.total} 完了
            </p>
          </div>
        </div>
      </header>

      {/* 全体の進捗バー */}
      <div className="px-4 py-4 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">全体の進捗</span>
          <span className="text-sm font-bold text-primary-600">
            {Math.round((stats.completed / stats.total) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all"
            style={{ width: `${(stats.completed / stats.total) * 100}%` }}
          />
        </div>
      </div>

      {/* カテゴリ一覧（アコーディオン） */}
      <div className="px-4 py-4 space-y-3">
        {freshmanCategories.map((category) => {
          const colors = getCategoryColors(category.color);
          const progress = getCategoryProgress(category);
          const isExpanded = expandedCategory === category.id;

          return (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-card overflow-hidden"
            >
              {/* カテゴリヘッダー */}
              <button
                onClick={() =>
                  setExpandedCategory(isExpanded ? null : category.id)
                }
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors tap-target"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="text-left">
                    <p className="font-medium text-neutral-900">{category.name}</p>
                    <p className="text-xs text-neutral-500">
                      {progress.completed}/{progress.total} 完了
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* ミニ進捗バー */}
                  <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", colors.progress)}
                      style={{
                        width: `${(progress.completed / progress.total) * 100}%`,
                      }}
                    />
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-neutral-400 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </div>
              </button>

              {/* 展開時のコンテンツ */}
              {isExpanded && (
                <div className="border-t border-neutral-100">
                  {category.skills.map((skill) => {
                    const isCompleted = skillIds.includes(skill.id);

                    return (
                      <div
                        key={skill.id}
                        className="flex items-center border-b border-neutral-50 last:border-b-0"
                      >
                        {/* チェックボタン */}
                        <button
                          onClick={() => toggleComplete(skill.id)}
                          className={cn(
                            "p-4 transition-colors",
                            isCompleted
                              ? "text-success-500"
                              : "text-neutral-300 hover:text-neutral-400"
                          )}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </button>

                        {/* スキルリンク */}
                        <Link
                          href={`/learning/${skill.id}`}
                          className={cn(
                            "flex-1 py-4 pr-4 flex items-center gap-3 hover:bg-neutral-50 transition-colors",
                            isCompleted && "opacity-60"
                          )}
                        >
                          <span className="text-lg">{skill.icon}</span>
                          <div className="flex-1">
                            <p
                              className={cn(
                                "font-medium text-neutral-800",
                                isCompleted && "line-through"
                              )}
                            >
                              {skill.title}
                            </p>
                            <p className="text-xs text-neutral-500 line-clamp-1">
                              {skill.overview}
                            </p>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 達成時のメッセージ */}
      {stats.completed === stats.total && (
        <div className="px-4">
          <div className="bg-success-50 border border-success-200 rounded-xl p-4 text-center animate-fade-in">
            <p className="text-success-700 font-medium">
              すべて完了！基礎はばっちり！
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
