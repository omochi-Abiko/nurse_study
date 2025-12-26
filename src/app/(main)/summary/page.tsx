"use client";

import * as React from "react";
import Link from "next/link";
import { useAppStore } from "@/store";
import { Card } from "@/components/ui/card";
import { MoodChart, MoodSummary, moodLabels } from "@/components/ui/mood-chart";
import { CategoryStatsList, WeakCategoryAlert } from "@/components/ui/category-badge";
import { MenuButton } from "@/components/ui/menu";
import { Button } from "@/components/ui/button";
import { shareService } from "@/lib/share";
import { ChevronLeft, Trophy, Target, Flame, Calendar, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SummaryPage() {
  const getWeeklySummary = useAppStore((state) => state.getWeeklySummary);
  const getCategoryStats = useAppStore((state) => state.getCategoryStats);
  const getWeakCategories = useAppStore((state) => state.getWeakCategories);

  const summary = getWeeklySummary();
  const categoryStats = getCategoryStats();
  const weakCategories = getWeakCategories();

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "text-success-600";
    if (accuracy >= 60) return "text-warning-600";
    return "text-error-600";
  };

  const getEncouragementMessage = () => {
    const { accuracy } = summary.quizStats;
    if (accuracy >= 80) return "素晴らしい！この調子で頑張ろう！";
    if (accuracy >= 60) return "いい感じ！もう少しで完璧！";
    if (accuracy >= 40) return "着実に成長してるよ！";
    return "コツコツ続けることが大事！";
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-100">
        <div className="flex items-center justify-between px-4 h-14">
          <Link
            href="/"
            className="p-2 -ml-2 text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="font-semibold text-neutral-900">週間サマリー</h1>
          <MenuButton />
        </div>
      </header>

      <div className="pt-14 pb-8 screen-padding">
        {/* 週の期間表示 */}
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6 mt-4">
          <Calendar className="h-4 w-4" />
          <span>{summary.weekStart} 〜 の週</span>
        </div>

        {/* サマリーカード群 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* 正答率 */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-primary-500" />
              <span className="text-sm text-neutral-600">正答率</span>
            </div>
            <p
              className={cn(
                "text-3xl font-bold",
                getAccuracyColor(summary.quizStats.accuracy)
              )}
            >
              {summary.quizStats.accuracy}%
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {summary.quizStats.correctAnswers}/{summary.quizStats.totalQuestions}問正解
            </p>
          </Card>

          {/* 連続日数 */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-warning-500" />
              <span className="text-sm text-neutral-600">連続学習</span>
            </div>
            <p className="text-3xl font-bold text-warning-600">
              {summary.streakDays}日
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {summary.streakDays >= 7 ? "素晴らしい！" : "続けよう！"}
            </p>
          </Card>
        </div>

        {/* 励ましメッセージ */}
        <Card className="p-4 mb-6 bg-primary-50 border-primary-100">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary-500" />
            <p className="text-sm text-primary-700 font-medium">
              {getEncouragementMessage()}
            </p>
          </div>
        </Card>

        {/* 苦手カテゴリアラート */}
        {weakCategories.length > 0 && (
          <WeakCategoryAlert categories={weakCategories} className="mb-6" />
        )}

        {/* 気分の推移 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            今週の気持ち
          </h2>
          <Card className="p-4">
            <MoodChart data={summary.moodHistory} />
            <MoodSummary data={summary.moodHistory} className="mt-4" />
          </Card>
        </section>

        {/* ふりかえり一覧 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            ひとことふりかえり
          </h2>
          <div className="space-y-2">
            {summary.reflections.length > 0 ? (
              summary.reflections.map((reflection, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-neutral-400 shrink-0">
                      {reflection.date}
                    </span>
                    <p className="text-sm text-neutral-700 flex-1">
                      {reflection.note || "（メモなし）"}
                    </p>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-neutral-400 py-4 text-sm">
                まだふりかえりがないよ
              </p>
            )}
          </div>
        </section>

        {/* カテゴリ別成績 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            分野別の成績
          </h2>
          <Card className="p-4">
            <CategoryStatsList
              stats={categoryStats}
              onCategoryClick={(category) => {
                // 将来: カテゴリ別の問題一覧に遷移
                console.log("Navigate to category:", category);
              }}
            />
          </Card>
        </section>

        {/* アクションリンク */}
        <div className="space-y-3">
          <Link
            href="/review"
            className="block w-full py-3 px-4 bg-primary-500 text-white text-center rounded-xl font-medium hover:bg-primary-600 transition-colors"
          >
            苦手を復習する
          </Link>
          <Button
            variant="secondary"
            fullWidth
            onClick={() =>
              shareService.shareWeeklySummary(
                summary.quizStats.accuracy,
                summary.streakDays
              )
            }
            className="flex items-center justify-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            シェアする
          </Button>
          <Link
            href="/"
            className="block w-full py-3 px-4 bg-neutral-100 text-neutral-700 text-center rounded-xl font-medium hover:bg-neutral-200 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
