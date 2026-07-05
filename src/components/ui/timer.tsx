"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  useTimerStore,
  formatTime,
  getModeLabel,
  getModeColor,
  type TimerMode,
} from "@/store/timer";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { Button } from "./button";

interface CircularTimerProps {
  className?: string;
}

export function CircularTimer({ className }: CircularTimerProps) {
  const {
    mode,
    timeLeft,
    isRunning,
    pomodoroCount,
    todayCount,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    tick,
    skipToNext,
  } = useTimerStore();

  // タイマーのインターバル
  React.useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, tick]);

  // 進捗率の計算
  const getTotalTime = () => {
    switch (mode) {
      case "work":
        return workDuration;
      case "shortBreak":
        return shortBreakDuration;
      case "longBreak":
        return longBreakDuration;
      default:
        return workDuration;
    }
  };

  const progress = (timeLeft / getTotalTime()) * 100;
  const circumference = 2 * Math.PI * 120; // r=120
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colorClass = getModeColor(mode);

  const getStrokeColor = () => {
    switch (colorClass) {
      case "primary":
        return "#FF69B4"; // primary-500
      case "secondary":
        return "#40E0D0"; // secondary-500
      case "success":
        return "#22C55E"; // success-500
      default:
        return "#9CA3AF"; // neutral-400
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* 円形タイマー */}
      <div className="relative w-64 h-64">
        {/* 背景の円 */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
          />
          {/* 進捗の円 */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>

        {/* 中央の時間表示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p
            className={cn(
              "text-xs font-medium mb-1",
              mode === "work" && "text-primary-600",
              mode === "shortBreak" && "text-secondary-600",
              mode === "longBreak" && "text-success-600",
              mode === "idle" && "text-neutral-500"
            )}
          >
            {getModeLabel(mode)}
          </p>
          <p className="text-5xl font-bold text-neutral-900 tabular-nums">
            {formatTime(timeLeft)}
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            本日 {todayCount} ポモドーロ
          </p>
        </div>
      </div>

      {/* コントロールボタン */}
      <div className="flex items-center gap-4 mt-8">
        <Button
          variant="ghost"
          size="lg"
          onClick={resetTimer}
          className="rounded-full w-12 h-12 p-0"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={isRunning ? pauseTimer : startTimer}
          className={cn(
            "rounded-full w-16 h-16 p-0",
            mode === "shortBreak" && "bg-secondary-500 hover:bg-secondary-600",
            mode === "longBreak" && "bg-success-500 hover:bg-success-600"
          )}
        >
          {isRunning ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={skipToNext}
          className="rounded-full w-12 h-12 p-0"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {/* ポモドーロカウント */}
      <div className="flex items-center gap-2 mt-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full",
              i < pomodoroCount % 4 ? "bg-primary-500" : "bg-neutral-200"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-neutral-500 mt-2">
        {4 - (pomodoroCount % 4)} ポモドーロで長休憩
      </p>
    </div>
  );
}

// モード切替タブ
interface TimerModeTabsProps {
  className?: string;
}

export function TimerModeTabs({ className }: TimerModeTabsProps) {
  const { mode, setMode, isRunning } = useTimerStore();

  const modes: { value: TimerMode; label: string }[] = [
    { value: "work", label: "作業" },
    { value: "shortBreak", label: "小休憩" },
    { value: "longBreak", label: "長休憩" },
  ];

  return (
    <div
      className={cn(
        "flex bg-neutral-100 rounded-full p-1",
        className
      )}
    >
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => !isRunning && setMode(m.value)}
          disabled={isRunning}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-full transition-all",
            mode === m.value
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700",
            isRunning && "opacity-50 cursor-not-allowed"
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
