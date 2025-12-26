"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { questions, questionCategories } from "@/data/questions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Shuffle,
  BookOpen,
  Target,
  Check,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuizSelectPage() {
  const router = useRouter();
  const startQuizSession = useAppStore((state) => state.startQuizSession);
  const customQuestions = useAppStore((state) => state.customQuestions);
  const weakQuestions = useAppStore((state) => state.weakQuestions);

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );
  const [questionCount, setQuestionCount] = React.useState(10);

  // カテゴリごとの問題数をカウント
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    const allQuestions = [...questions, ...customQuestions];
    allQuestions.forEach((q) => {
      counts[q.category] = (counts[q.category] || 0) + 1;
    });
    return counts;
  }, [customQuestions]);

  const totalQuestions = questions.length + customQuestions.length;

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const selectAllCategories = () => {
    setSelectedCategories([...questionCategories]);
  };

  const clearCategories = () => {
    setSelectedCategories([]);
  };

  const getAvailableQuestionCount = () => {
    if (selectedCategories.length === 0) {
      return totalQuestions;
    }
    return selectedCategories.reduce(
      (sum, cat) => sum + (categoryCounts[cat] || 0),
      0
    );
  };

  const handleStartQuiz = (mode: "category" | "all" | "weak") => {
    if (mode === "weak") {
      startQuizSession([], weakQuestions.length, "weak");
    } else if (mode === "all") {
      startQuizSession([], 0, "all"); // 0 = all questions
    } else {
      startQuizSession(selectedCategories, questionCount, "category");
    }
    router.push("/quiz/session");
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
          <h1 className="font-semibold text-neutral-900">クイズを選ぶ</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="pt-14 pb-8 screen-padding">
        {/* クイックスタート */}
        <section className="mt-4 mb-6">
          <h2 className="text-sm font-medium text-neutral-500 mb-3">
            クイックスタート
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* 全問ランダム */}
            <Card
              className="p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
              onClick={() => handleStartQuiz("all")}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Shuffle className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-800">全問ランダム</p>
                  <p className="text-xs text-neutral-500">{totalQuestions}問</p>
                </div>
              </div>
            </Card>

            {/* 苦手克服 */}
            <Card
              className={cn(
                "p-4 transition-colors",
                weakQuestions.length > 0
                  ? "cursor-pointer hover:bg-neutral-50"
                  : "opacity-50"
              )}
              onClick={() =>
                weakQuestions.length > 0 && handleStartQuiz("weak")
              }
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <Flame className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-800">苦手克服</p>
                  <p className="text-xs text-neutral-500">
                    {weakQuestions.length}問
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* カテゴリ選択 */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-neutral-500">
              カテゴリを選択
            </h2>
            <div className="flex gap-2">
              <button
                onClick={selectAllCategories}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                全選択
              </button>
              <span className="text-neutral-300">|</span>
              <button
                onClick={clearCategories}
                className="text-xs text-neutral-500 hover:text-neutral-700"
              >
                クリア
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {questionCategories.map((category) => {
              const count = categoryCounts[category] || 0;
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all",
                    isSelected
                      ? "bg-primary-500 text-white"
                      : "bg-white border border-neutral-200 text-neutral-700 hover:border-primary-300"
                  )}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                  <span>{category}</span>
                  <span
                    className={cn(
                      "text-xs",
                      isSelected ? "text-primary-200" : "text-neutral-400"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 問題数選択 */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-neutral-500 mb-3">
            出題数: {questionCount === 0 ? "全問" : `${questionCount}問`}
          </h2>
          <div className="flex flex-wrap gap-2">
            {[5, 10, 20, 30, 0].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  questionCount === count
                    ? "bg-primary-500 text-white"
                    : "bg-white border border-neutral-200 text-neutral-700 hover:border-primary-300"
                )}
              >
                {count === 0 ? "全問" : `${count}問`}
              </button>
            ))}
          </div>
          {selectedCategories.length > 0 && (
            <p className="text-xs text-neutral-500 mt-2">
              選択中のカテゴリ: {getAvailableQuestionCount()}問
            </p>
          )}
        </section>

        {/* スタートボタン */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => handleStartQuiz("category")}
          disabled={
            selectedCategories.length === 0 && questionCount !== 0
          }
        >
          <BookOpen className="h-5 w-5 mr-2" />
          {selectedCategories.length === 0
            ? "カテゴリを選んでスタート"
            : `${Math.min(questionCount || getAvailableQuestionCount(), getAvailableQuestionCount())}問でスタート`}
        </Button>

        {/* カスタム問題への導線 */}
        <div className="mt-6 text-center">
          <Link
            href="/quiz/create"
            className="text-sm text-neutral-500 hover:text-primary-600 transition-colors"
          >
            自分で問題を作成する →
          </Link>
        </div>
      </div>
    </div>
  );
}
