"use client";

import * as React from "react";
import Link from "next/link";
import { useAppStore } from "@/store";
import { useStats, useReflections } from "@/hooks/useApi";
import { reflectionApi } from "@/lib/api";
import { getGreeting } from "@/lib/utils";
import { FeatureCard, ActionCard, StatCard } from "@/components/ui/card";
import { DailyProgress } from "@/components/ui/progress";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { MenuButton } from "@/components/ui/menu";
import { ExamCountdown } from "@/components/ui/countdown";
import { Mood } from "@/types";
import { mutate } from "swr";
import { SWR_KEYS } from "@/lib/api";
import {
  Stethoscope,
  BookOpen,
  ClipboardCheck,
  PenLine,
  BarChart3,
  Sparkles,
  Target,
  Brain,
  Loader2,
} from "lucide-react";

const moodOptions: { value: Mood; emoji: string; label: string }[] = [
  { value: "great", emoji: "😊", label: "とてもいい" },
  { value: "good", emoji: "🙂", label: "いい感じ" },
  { value: "okay", emoji: "😐", label: "ふつう" },
  { value: "tired", emoji: "😮‍💨", label: "疲れた" },
  { value: "tough", emoji: "😢", label: "つらい" },
];

export default function HomePage() {
  const dailyQuiz = useAppStore((state) => state.dailyQuiz);
  const isPracticumMode = useAppStore((state) => state.isPracticumMode);
  const checklist = useAppStore((state) => state.checklist);
  const getProgress = useAppStore((state) => state.getProgress);

  // API hooks
  const { stats, isLoading: isLoadingStats } = useStats();
  const { reflections, isLoading: isLoadingReflections } = useReflections(1);

  const [isReflectionOpen, setIsReflectionOpen] = React.useState(false);
  const [selectedMood, setSelectedMood] = React.useState<Mood | null>(null);
  const [reflectionNote, setReflectionNote] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  // ハイドレーション後にのみ動的な値を使用
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // 今日のふりかえり（APIから）
  const today = new Date().toISOString().split("T")[0];
  const todayReflection = reflections?.find((r: { date: string }) => r.date === today);

  const progress = getProgress();
  const totalQuestions = dailyQuiz?.questionIds.length ?? 3;
  const answeredCount = dailyQuiz?.answers.length ?? 0;
  const remainingCount = totalQuestions - answeredCount;
  const checkedCount = checklist.filter((item) => item.checked).length;

  const handleSaveReflection = async () => {
    if (selectedMood) {
      setIsSaving(true);
      try {
        await reflectionApi.saveReflection({
          date: today,
          mood: selectedMood,
          note: reflectionNote || undefined,
        });
        // 両方のキーをリフレッシュ（limit付きとなし）
        mutate(`${SWR_KEYS.REFLECTIONS}?limit=1`);
        mutate(SWR_KEYS.REFLECTIONS);
        setIsReflectionOpen(false);
        setSelectedMood(null);
        setReflectionNote("");
      } catch (error) {
        console.error("Failed to save reflection:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // ローディング状態
  const isLoading = isLoadingStats || isLoadingReflections;

  // 時間帯に応じたイラスト背景のグラデーション（ハイドレーション後のみ）
  const getTimeBasedGradient = () => {
    if (!isMounted) {
      return "from-primary-50 via-white to-secondary-50/20"; // デフォルト（サーバー側）
    }
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "from-primary-50 via-secondary-50/30 to-warning-50/20"; // 朝
    } else if (hour >= 12 && hour < 17) {
      return "from-primary-50 via-white to-secondary-50/20"; // 昼
    } else if (hour >= 17 && hour < 21) {
      return "from-secondary-50 via-primary-50/30 to-warning-50/30"; // 夕方
    } else {
      return "from-primary-100/50 via-secondary-50/20 to-neutral-100"; // 夜
    }
  };

  // 初回ローディング表示
  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-4" />
        <p className="text-neutral-500 text-sm">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* ヒーローセクション */}
      <div className={`bg-gradient-to-br ${getTimeBasedGradient()} px-4 pt-4 pb-6`}>
        {/* ヘッダー */}
        <header className="flex items-center justify-between mb-6 animate-fade-in">
          <MenuButton />
          <ExamCountdown variant="compact" />
        </header>

        {/* 挨拶とモチベーション */}
        <div className="mb-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-warning-500" />
            <span className="text-sm font-medium text-primary-600">
              今日もえらい！
            </span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 leading-tight">
            {getGreeting()}
          </h1>
          <p className="text-neutral-600 mt-1">
            今日も3分だけ、やってみよう
          </p>
        </div>

        {/* 今日の達成カード */}
        <div className="animate-slide-up-1">
          <DailyProgress
            quizDone={progress.quizCompleted}
            practicumDone={isPracticumMode ? progress.practicumCompleted : undefined}
            reflectionDone={!!todayReflection}
            streak={stats?.streak ?? 0}
          />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="px-4 -mt-2 space-y-4">
        {/* メインアクションカード */}
        <section className="space-y-3">
          {/* 今日の3問 */}
          <Link href="/quiz" className="block animate-slide-up-2">
            <FeatureCard
              icon={<Stethoscope className="h-7 w-7 text-white" />}
              title="今日の3問"
              description={
                progress.quizCompleted
                  ? "今日の3問、完了！"
                  : `あと${remainingCount}問で今日のノルマ達成`
              }
              action={progress.quizCompleted ? undefined : "始める"}
              completed={progress.quizCompleted}
              variant="primary"
            />
          </Link>

          {/* 自由にクイズ */}
          <Link href="/quiz/select" className="block animate-slide-up-3">
            <FeatureCard
              icon={<BookOpen className="h-7 w-7 text-white" />}
              title="自由にクイズ"
              description="ジャンルや問題数を選んで挑戦"
              action="選ぶ"
              variant="secondary"
              badge="39問収録"
            />
          </Link>

          {/* 実習チェック（実習モード時のみ） */}
          {isPracticumMode && (
            <Link href="/practicum" className="block animate-slide-up-4">
              <FeatureCard
                icon={<ClipboardCheck className="h-7 w-7 text-white" />}
                title="実習チェック"
                description={
                  progress.practicumCompleted
                    ? "準備OK！いってらっしゃい"
                    : `${checkedCount}/${checklist.length} 完了`
                }
                action={progress.practicumCompleted ? undefined : "確認"}
                completed={progress.practicumCompleted}
                variant="neutral"
              />
            </Link>
          )}
        </section>

        {/* サブアクション */}
        <section className="space-y-2 animate-slide-up-4">
          <h2 className="text-sm font-medium text-neutral-500 px-1">
            もっと学ぶ
          </h2>

          {/* 1行ふりかえり */}
          <div
            onClick={() => !todayReflection && setIsReflectionOpen(true)}
            className="cursor-pointer"
          >
            <ActionCard
              icon={<PenLine className="h-5 w-5 text-secondary-500" />}
              title="1行ふりかえり"
              description={
                todayReflection
                  ? `今日の気持ち: ${moodOptions.find((m) => m.value === todayReflection?.mood)?.emoji ?? ""}`
                  : "今日の気持ちを残そう"
              }
              iconBg={todayReflection ? "bg-success-100" : "bg-secondary-100"}
            />
          </div>

          {/* 苦手復習 */}
          <Link href="/review">
            <ActionCard
              icon={<Target className="h-5 w-5 text-warning-500" />}
              title="苦手を復習"
              description="間違えた問題をもう一度"
              iconBg="bg-warning-100"
            />
          </Link>

          {/* 週間サマリー */}
          <Link href="/summary">
            <ActionCard
              icon={<BarChart3 className="h-5 w-5 text-primary-500" />}
              title="週間サマリー"
              description="今週の学習を振り返る"
              iconBg="bg-primary-100"
            />
          </Link>
        </section>

        {/* クイック統計 */}
        <section className="animate-slide-up-5">
          <h2 className="text-sm font-medium text-neutral-500 px-1 mb-2">
            あなたの記録
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              icon={<Brain className="h-5 w-5 text-primary-500" />}
              value={stats ? `${stats.correctRate}%` : "-"}
              label="正答率"
            />
            <StatCard
              icon={<Target className="h-5 w-5 text-warning-500" />}
              value={stats ? `${stats.weakQuestionsCount}` : "-"}
              label="苦手問題"
            />
            <StatCard
              icon={<Sparkles className="h-5 w-5 text-secondary-500" />}
              value={stats ? `${stats.streak}日` : "-"}
              label="連続学習"
            />
          </div>
        </section>

        {/* 豆知識・ヒント（ランダム表示） */}
        <section className="animate-slide-up-5">
          <div className="rounded-2xl p-4 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <span className="text-lg">💡</span>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">
                  今日の豆知識
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  成人の正常な脈拍は60〜100回/分。緊張すると上がるのは自然なこと！
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ふりかえりBottomSheet */}
      <BottomSheet
        isOpen={isReflectionOpen}
        onClose={() => setIsReflectionOpen(false)}
        title="今日の気持ちは？"
      >
        <div className="space-y-6">
          {/* 気分選択 */}
          <div className="flex justify-center gap-2">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedMood(option.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all tap-target ${
                  selectedMood === option.value
                    ? "bg-primary-100 scale-105 ring-2 ring-primary-300"
                    : "bg-neutral-50 hover:bg-neutral-100"
                }`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-xs text-neutral-600">{option.label}</span>
              </button>
            ))}
          </div>

          {/* 1行メモ（任意） */}
          <div>
            <label
              htmlFor="reflection-note"
              className="block text-sm text-neutral-600 mb-2"
            >
              ひとこと（任意）
            </label>
            <input
              id="reflection-note"
              type="text"
              value={reflectionNote}
              onChange={(e) => setReflectionNote(e.target.value)}
              placeholder="今日のことをひとことで..."
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              maxLength={50}
            />
          </div>

          {/* 保存ボタン */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSaveReflection}
            disabled={!selectedMood || isSaving}
          >
            {isSaving ? "保存中..." : "記録する"}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
