"use client";

import * as React from "react";
import Link from "next/link";
import { CircularTimer, TimerModeTabs } from "@/components/ui/timer";
import { useTimerStore, TIMER_DEFAULTS } from "@/store/timer";
import { ChevronLeft, Settings, Coffee, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { cn } from "@/lib/utils";

export default function TimerPage() {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const {
    todayCount,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    setWorkDuration,
    setShortBreakDuration,
    setLongBreakDuration,
  } = useTimerStore();

  // プリセットの時間オプション
  const workPresets = [
    { value: 15 * 60, label: "15分" },
    { value: 25 * 60, label: "25分" },
    { value: 30 * 60, label: "30分" },
    { value: 45 * 60, label: "45分" },
  ];

  const breakPresets = [
    { value: 5 * 60, label: "5分" },
    { value: 10 * 60, label: "10分" },
    { value: 15 * 60, label: "15分" },
  ];

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
            <h1 className="text-lg font-bold text-neutral-900">学習タイマー</h1>
            <p className="text-xs text-neutral-500">ポモドーロテクニック</p>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="px-4 py-8 flex flex-col items-center">
        {/* モード切替タブ */}
        <TimerModeTabs className="mb-8" />

        {/* 円形タイマー */}
        <CircularTimer />
      </div>

      {/* 今日の成果 */}
      {todayCount > 0 && (
        <div className="px-4">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-warning-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">
                  今日のポモドーロ
                </p>
                <p className="text-2xl font-bold text-primary-600">
                  {todayCount}回
                  <span className="text-sm font-normal text-neutral-500 ml-2">
                    ({Math.round((todayCount * workDuration) / 60)}分集中)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 説明 */}
      <div className="px-4 mt-6 space-y-3">
        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <Brain className="h-4 w-4 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-700">作業モード</p>
            <p className="text-xs text-neutral-500">
              {workDuration / 60}分間集中して学習しよう
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0">
            <Coffee className="h-4 w-4 text-secondary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-700">休憩モード</p>
            <p className="text-xs text-neutral-500">
              短休憩{shortBreakDuration / 60}分、4回ごとに長休憩{longBreakDuration / 60}分
            </p>
          </div>
        </div>
      </div>

      {/* 設定BottomSheet */}
      <BottomSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="タイマー設定"
      >
        <div className="space-y-6">
          {/* 作業時間 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              作業時間
            </label>
            <div className="flex flex-wrap gap-2">
              {workPresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setWorkDuration(preset.value)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    workDuration === preset.value
                      ? "bg-primary-500 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 短休憩時間 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              短休憩時間
            </label>
            <div className="flex flex-wrap gap-2">
              {breakPresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setShortBreakDuration(preset.value)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    shortBreakDuration === preset.value
                      ? "bg-secondary-500 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 長休憩時間 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              長休憩時間
            </label>
            <div className="flex flex-wrap gap-2">
              {breakPresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setLongBreakDuration(preset.value)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    longBreakDuration === preset.value
                      ? "bg-success-500 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 閉じるボタン */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setIsSettingsOpen(false)}
          >
            完了
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
