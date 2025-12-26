"use client";

import * as React from "react";
import { useAppStore } from "@/store";
import { useWeakQuestions, useStats } from "@/hooks/useApi";
import { getQuestionById } from "@/data/questions";
import { SwipeCard } from "@/components/ui/swipe-card";
import { Button } from "@/components/ui/button";
import { WeakCategoryAlert, CategoryStatsList } from "@/components/ui/category-badge";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { RefreshCw, Brain, BarChart3, X, Loader2 } from "lucide-react";

export default function ReviewPage() {
  // API hooks
  const { weakQuestions: apiWeakQuestions, isLoading, removeWeakQuestion, reviewWeakQuestion } = useWeakQuestions();
  const { stats } = useStats();

  // Zustand (カテゴリ統計用 - 将来的にはAPIに移行)
  const getCategoryStats = useAppStore((state) => state.getCategoryStats);
  const getWeakCategories = useAppStore((state) => state.getWeakCategories);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);
  const [showStats, setShowStats] = React.useState(false);
  const [filterCategory, setFilterCategory] = React.useState<string | null>(null);

  const categoryStats = getCategoryStats();
  const weakCategories = getWeakCategories();

  // APIから取得した苦手問題を使用
  const questions = React.useMemo(() => {
    if (!apiWeakQuestions) return [];

    let filtered = apiWeakQuestions
      .map((w: { questionId: string; addedAt: string; reviewCount: number }) => ({
        ...w,
        question: getQuestionById(w.questionId),
      }))
      .filter((w: { question: unknown }) => w.question);

    // カテゴリフィルターが設定されている場合
    if (filterCategory) {
      filtered = filtered.filter((w: { question: { category: string } | null }) => w.question?.category === filterCategory);
    }

    return filtered;
  }, [apiWeakQuestions, filterCategory]);

  // カテゴリフィルターをクリア
  const clearFilter = () => {
    setFilterCategory(null);
    setCurrentIndex(0);
    setShowAnswer(false);
    setCompleted(false);
  };

  // カテゴリ選択
  const handleCategoryClick = (category: string) => {
    setFilterCategory(category);
    setCurrentIndex(0);
    setShowAnswer(false);
    setCompleted(false);
    setShowStats(false);
  };

  const currentItem = questions[currentIndex];
  const remainingCount = questions.length - currentIndex;

  const handleSwipeRight = async () => {
    // わかった → 苦手から削除
    if (currentItem) {
      await removeWeakQuestion(currentItem.questionId);
    }
    moveToNext();
  };

  const handleSwipeLeft = async () => {
    // まだ → 復習回数を更新
    if (currentItem) {
      await reviewWeakQuestion(currentItem.questionId);
    }
    moveToNext();
  };

  const moveToNext = () => {
    setShowAnswer(false);
    if (currentIndex >= questions.length - 1) {
      setCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setCompleted(false);
  };

  // ローディング中
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-4" />
        <p className="text-neutral-500">読み込み中...</p>
      </div>
    );
  }

  // 復習する問題がない
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
          <Brain className="h-10 w-10 text-primary-500" />
        </div>
        <h1 className="text-xl font-bold text-neutral-900 mb-2">
          復習する問題はないよ
        </h1>
        <p className="text-neutral-500 text-sm max-w-[280px]">
          クイズで間違えた問題や「あとで復習」を押した問題がここに追加されるよ
        </p>
      </div>
    );
  }

  // 完了画面
  if (completed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
          <Brain className="h-10 w-10 text-primary-500" />
        </div>
        <h1 className="text-xl font-bold text-neutral-900 mb-2">
          今日の復習おわり！
        </h1>
        <p className="text-neutral-500 mb-8">スキマ時間にえらい</p>
        <Button variant="secondary" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          もう一度
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 pt-6 pb-24">
      {/* ヘッダー */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-neutral-900">復習</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStats(true)}
            className="p-2 text-neutral-500 hover:text-neutral-700 transition-colors rounded-lg hover:bg-neutral-100"
            aria-label="分野別成績を見る"
          >
            <BarChart3 className="h-5 w-5" />
          </button>
          <span className="text-sm text-neutral-500">あと {remainingCount} 枚</span>
        </div>
      </header>

      {/* 苦手カテゴリアラート */}
      {weakCategories.length > 0 && !filterCategory && (
        <WeakCategoryAlert categories={weakCategories} className="mb-4" />
      )}

      {/* カテゴリフィルター表示 */}
      {filterCategory && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-primary-50 rounded-xl">
          <span className="text-sm text-primary-700 flex-1">
            「{filterCategory}」を復習中
          </span>
          <button
            onClick={clearFilter}
            className="p-1 text-primary-500 hover:text-primary-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* カードエリア */}
      <div className="flex-1 flex flex-col justify-center">
        {currentItem?.question && (
          <SwipeCard
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            className="min-h-[400px]"
          >
            <div className="flex flex-col h-full">
              {/* 問題文 */}
              <div className="mb-4">
                <p className="text-base font-medium text-neutral-900 leading-relaxed">
                  {currentItem.question.text}
                </p>
              </div>

              {/* 選択肢 */}
              <div className="space-y-2 mb-4">
                {currentItem.question.options?.map((option: string, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border text-sm ${
                      showAnswer && index === currentItem.question.correctIndex
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-neutral-200 text-neutral-700"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </div>
                ))}
              </div>

              {/* 答え・解説 */}
              {showAnswer ? (
                <div className="animate-fade-in border-t border-neutral-200 pt-3">
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {currentItem.question.explanation}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="text-center py-3 text-neutral-400 hover:text-neutral-600 transition-colors border-t border-neutral-200"
                >
                  💡 タップで答えを見る
                </button>
              )}
            </div>
          </SwipeCard>
        )}

        {/* ボタン */}
        <div className="flex gap-4 mt-8">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleSwipeLeft}
          >
            まだ
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSwipeRight}
          >
            わかった
          </Button>
        </div>

        <p className="text-center text-xs text-neutral-400 mt-4">
          ← スワイプ: まだ　/　スワイプ: わかった →
        </p>
      </div>

      {/* 分野別成績BottomSheet */}
      <BottomSheet
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        title="分野別の成績"
      >
        <div className="pb-4">
          <CategoryStatsList
            stats={categoryStats}
            onCategoryClick={handleCategoryClick}
          />
          {categoryStats.length === 0 && (
            <p className="text-center text-neutral-400 text-sm py-4">
              まだ回答履歴がありません
            </p>
          )}
        </div>
      </BottomSheet>
    </div>
  );
}
