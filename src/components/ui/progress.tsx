"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Star, Flame, Trophy } from "lucide-react";

interface ProgressDotsProps {
  total: number;
  current: number;
  className?: string;
}

export function ProgressDots({ total, current, className }: ProgressDotsProps) {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`進捗: ${total}問中${current}問完了`}
    >
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-2.5 h-2.5 rounded-full transition-colors duration-200",
            index < current
              ? "bg-primary-500"
              : index === current
              ? "bg-primary-300"
              : "bg-neutral-200"
          )}
        />
      ))}
    </div>
  );
}

interface AchievementItem {
  label: string;
  completed: boolean;
}

interface AchievementDotsProps {
  items: AchievementItem[];
  className?: string;
}

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  showLabel?: boolean;
  variant?: "default" | "gradient";
}

export function ProgressBar({ current, total, className, showLabel, variant = "default" }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div
      className={cn("w-full", className)}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`進捗: ${total}問中${current}問完了`}
    >
      <div className={cn(
        "h-2 rounded-full overflow-hidden",
        variant === "gradient" ? "bg-neutral-100" : "bg-neutral-200"
      )}>
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            variant === "gradient"
              ? "bg-gradient-to-r from-primary-400 via-primary-500 to-secondary-400"
              : "bg-primary-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-neutral-500 text-center mt-1">
          {current} / {total}
        </p>
      )}
    </div>
  );
}

export function AchievementDots({ items, className }: AchievementDotsProps) {
  return (
    <div className={cn("flex items-center gap-6", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-1">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
              item.completed
                ? "bg-primary-500 text-white"
                : "bg-neutral-100 text-neutral-400 border-2 border-neutral-200"
            )}
          >
            {item.completed ? (
              <Check className="h-4 w-4" strokeWidth={3} />
            ) : (
              <div className="w-2 h-2 rounded-full bg-current" />
            )}
          </div>
          <span
            className={cn(
              "text-xs",
              item.completed ? "text-primary-600 font-medium" : "text-neutral-500"
            )}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// 新しいビジュアルリッチな達成度表示
interface DailyProgressProps {
  quizDone: boolean;
  practicumDone?: boolean;
  reflectionDone: boolean;
  streak?: number;
  className?: string;
}

export function DailyProgress({
  quizDone,
  practicumDone,
  reflectionDone,
  streak = 0,
  className
}: DailyProgressProps) {
  const completedCount = [quizDone, practicumDone, reflectionDone].filter(Boolean).length;
  const totalCount = practicumDone !== undefined ? 3 : 2;
  const allDone = completedCount === totalCount;

  return (
    <div className={cn(
      "rounded-2xl p-5 relative overflow-hidden",
      allDone
        ? "bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500"
        : "bg-white shadow-card",
      className
    )}>
      {/* 背景装飾 */}
      {allDone && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
          <Star className="absolute top-3 right-3 h-5 w-5 text-warning-300 animate-pulse-soft" />
          <Star className="absolute bottom-4 right-8 h-4 w-4 text-warning-300/60 animate-pulse-soft" />
        </div>
      )}

      <div className="relative z-10">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={cn(
              "text-sm font-medium",
              allDone ? "text-white/80" : "text-neutral-500"
            )}>
              今日の達成
            </h3>
            <p className={cn(
              "text-2xl font-bold mt-0.5",
              allDone ? "text-white" : "text-neutral-800"
            )}>
              {completedCount} / {totalCount}
            </p>
          </div>
          {streak > 0 && (
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              allDone ? "bg-white/20" : "bg-warning-100"
            )}>
              <Flame className={cn(
                "h-4 w-4",
                allDone ? "text-warning-300" : "text-warning-500"
              )} />
              <span className={cn(
                "text-sm font-bold",
                allDone ? "text-white" : "text-warning-600"
              )}>
                {streak}日連続
              </span>
            </div>
          )}
        </div>

        {/* プログレスバー */}
        <div className={cn(
          "h-2 rounded-full overflow-hidden mb-4",
          allDone ? "bg-white/20" : "bg-neutral-100"
        )}>
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              allDone
                ? "bg-white"
                : "bg-gradient-to-r from-primary-400 to-secondary-400"
            )}
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>

        {/* 達成項目 */}
        <div className="flex justify-around">
          <AchievementBadge
            icon={<span className="text-lg">📝</span>}
            label="3問"
            completed={quizDone}
            allDone={allDone}
          />
          {practicumDone !== undefined && (
            <AchievementBadge
              icon={<span className="text-lg">🏥</span>}
              label="実習"
              completed={practicumDone}
              allDone={allDone}
            />
          )}
          <AchievementBadge
            icon={<span className="text-lg">✨</span>}
            label="ふりかえり"
            completed={reflectionDone}
            allDone={allDone}
          />
        </div>

        {/* 完了メッセージ */}
        {allDone && (
          <div className="mt-4 pt-4 border-t border-white/20 text-center">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-warning-300" />
              <span className="text-white font-medium">今日も頑張ったね！</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface AchievementBadgeProps {
  icon: React.ReactNode;
  label: string;
  completed: boolean;
  allDone?: boolean;
}

function AchievementBadge({ icon, label, completed, allDone }: AchievementBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
        completed
          ? allDone
            ? "bg-white/20 ring-2 ring-white/40"
            : "bg-success-100 ring-2 ring-success-200"
          : allDone
            ? "bg-white/10"
            : "bg-neutral-100"
      )}>
        {completed ? (
          <Check className={cn(
            "h-6 w-6",
            allDone ? "text-white" : "text-success-600"
          )} strokeWidth={2.5} />
        ) : (
          <span className={cn(
            "opacity-50",
            allDone ? "grayscale" : ""
          )}>{icon}</span>
        )}
      </div>
      <span className={cn(
        "text-xs font-medium",
        completed
          ? allDone ? "text-white" : "text-success-600"
          : allDone ? "text-white/50" : "text-neutral-400"
      )}>
        {label}
      </span>
    </div>
  );
}

// 週間カレンダービュー
interface WeekProgressProps {
  data: { date: string; completed: boolean; partial?: boolean }[];
  className?: string;
}

export function WeekProgress({ data, className }: WeekProgressProps) {
  const days = ['月', '火', '水', '木', '金', '土', '日'];

  return (
    <div className={cn("flex items-center justify-between gap-1", className)}>
      {data.slice(0, 7).map((day, index) => (
        <div key={day.date} className="flex flex-col items-center gap-1">
          <span className="text-xs text-neutral-400">{days[index]}</span>
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all",
            day.completed
              ? "bg-primary-500 text-white"
              : day.partial
                ? "bg-primary-100 text-primary-600"
                : "bg-neutral-100 text-neutral-400"
          )}>
            {new Date(day.date).getDate()}
          </div>
        </div>
      ))}
    </div>
  );
}
