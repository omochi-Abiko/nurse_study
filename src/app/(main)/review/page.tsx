"use client";

import * as React from "react";
import { useAppStore } from "@/store";
import { useWeakQuestions, useStats } from "@/hooks/useApi";
import { getQuestionById } from "@/data/questions";
import { SwipeCard } from "@/components/ui/swipe-card";
import { Button } from "@/components/ui/button";
import { WeakCategoryAlert, CategoryStatsList } from "@/components/ui/category-badge";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { RefreshCw, Brain, BarChart3, X, Loader2, Table2, Layers, Trash2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  // 表示モード（カードめくり / テーブル一覧）
  const [viewMode, setViewMode] = React.useState<"swipe" | "table">("swipe");
  // テーブルで解説を開いている問題ID
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

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

  // テーブル（一覧）表示
  if (viewMode === "table") {
    return (
      <div className="min-h-screen flex flex-col px-4 pt-6 pb-24">
        {/* ヘッダー */}
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-neutral-900">復習</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("swipe")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
              aria-label="カード表示に切り替え"
            >
              <Layers className="h-4 w-4" />
              カード
            </button>
            <span className="text-sm text-neutral-500">{questions.length}問</span>
          </div>
        </header>

        {/* カテゴリフィルター表示 */}
        {filterCategory && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-primary-50 rounded-xl">
            <span className="text-sm text-primary-700 flex-1">
              「{filterCategory}」で絞り込み中
            </span>
            <button
              onClick={clearFilter}
              className="p-1 text-primary-500 hover:text-primary-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* テーブル本体（横スクロール対応） */}
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-card">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-neutral-500 text-xs">
                <th className="text-left font-medium px-3 py-2.5 min-w-[180px]">問題</th>
                <th className="text-left font-medium px-3 py-2.5 whitespace-nowrap">分野</th>
                <th className="text-left font-medium px-3 py-2.5 whitespace-nowrap">正解</th>
                <th className="text-center font-medium px-2 py-2.5 whitespace-nowrap">回数</th>
                <th className="px-2 py-2.5" aria-label="操作" />
              </tr>
            </thead>
            <tbody>
              {questions.map(
                (item: {
                  questionId: string;
                  reviewCount: number;
                  question: {
                    text: string;
                    category: string;
                    options?: string[];
                    correctIndex: number;
                    explanation: string;
                  } | null;
                }) => {
                  const q = item.question;
                  if (!q) return null;
                  const isExpanded = expandedId === item.questionId;
                  const correctLabel = String.fromCharCode(65 + q.correctIndex);
                  const correctText = q.options?.[q.correctIndex] ?? "";
                  return (
                    <React.Fragment key={item.questionId}>
                      <tr
                        onClick={() =>
                          setExpandedId(isExpanded ? null : item.questionId)
                        }
                        className="border-t border-neutral-100 cursor-pointer hover:bg-neutral-50 transition-colors align-top"
                      >
                        <td className="px-3 py-3 text-neutral-800">
                          <div className="flex items-start gap-1.5">
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 text-neutral-400 mt-0.5 flex-shrink-0 transition-transform",
                                isExpanded && "rotate-180"
                              )}
                            />
                            <span>{q.text}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                            {q.category}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-success-700 font-medium whitespace-nowrap">
                          {correctLabel}. {correctText}
                        </td>
                        <td className="px-2 py-3 text-center text-neutral-500 whitespace-nowrap">
                          {item.reviewCount}
                        </td>
                        <td className="px-2 py-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeWeakQuestion(item.questionId);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-error-500 transition-colors"
                            aria-label="苦手リストから削除"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-neutral-50/60">
                          <td colSpan={5} className="px-4 py-3">
                            <p className="text-xs font-medium text-neutral-500 mb-1">解説</p>
                            <p className="text-sm text-neutral-700 leading-relaxed">
                              {q.explanation}
                            </p>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                }
              )}
            </tbody>
          </table>
        </div>

        <p className="text-center text-xs text-neutral-400 mt-3">
          行をタップで解説を表示・ゴミ箱で苦手から削除
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
            onClick={() => setViewMode("table")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
            aria-label="一覧（テーブル）表示に切り替え"
          >
            <Table2 className="h-4 w-4" />
            一覧
          </button>
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
