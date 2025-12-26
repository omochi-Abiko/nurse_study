"use client";

import * as React from "react";
import { Mood } from "@/types";
import { cn } from "@/lib/utils";
import { formatDateShort } from "@/lib/utils";

const moodEmojis: Record<Mood, string> = {
  great: "😊",
  good: "🙂",
  okay: "😐",
  tired: "😮‍💨",
  tough: "😢",
};

const moodLabels: Record<Mood, string> = {
  great: "とてもいい",
  good: "いい感じ",
  okay: "ふつう",
  tired: "疲れた",
  tough: "つらい",
};

interface MoodChartProps {
  data: { date: string; mood: Mood }[];
  className?: string;
}

export function MoodChart({ data, className }: MoodChartProps) {
  if (data.length === 0) {
    return (
      <div className={cn("text-center py-8 text-neutral-400", className)}>
        まだ記録がないよ
      </div>
    );
  }

  // 日付順にソート
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* 気分の推移グラフ */}
      <div className="flex items-end justify-between gap-1 h-32 px-2">
        {sortedData.map((item, index) => {
          const moodLevel = getMoodLevel(item.mood);
          const height = `${(moodLevel / 5) * 100}%`;

          return (
            <div
              key={item.date}
              className="flex flex-col items-center flex-1 h-full"
            >
              <div className="flex-1 w-full flex flex-col justify-end">
                <div
                  className={cn(
                    "w-full rounded-t-lg transition-all duration-300",
                    getMoodColor(item.mood)
                  )}
                  style={{ height }}
                />
              </div>
              <div className="text-2xl mt-2">{moodEmojis[item.mood]}</div>
              <div className="text-[10px] text-neutral-400 mt-1">
                {formatDateShort(new Date(item.date)).split("(")[0]}
              </div>
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="flex justify-center gap-4 text-xs text-neutral-500">
        <span>😢 つらい</span>
        <span>→</span>
        <span>😊 とてもいい</span>
      </div>
    </div>
  );
}

function getMoodLevel(mood: Mood): number {
  const levels: Record<Mood, number> = {
    tough: 1,
    tired: 2,
    okay: 3,
    good: 4,
    great: 5,
  };
  return levels[mood];
}

function getMoodColor(mood: Mood): string {
  const colors: Record<Mood, string> = {
    great: "bg-primary-400",
    good: "bg-primary-300",
    okay: "bg-neutral-300",
    tired: "bg-warning-300",
    tough: "bg-warning-400",
  };
  return colors[mood];
}

interface MoodSummaryProps {
  data: { date: string; mood: Mood }[];
  className?: string;
}

export function MoodSummary({ data, className }: MoodSummaryProps) {
  if (data.length === 0) return null;

  // 最も多い気分を計算
  const moodCounts = data.reduce((acc, { mood }) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<Mood, number>);

  const dominantMood = Object.entries(moodCounts).sort(
    (a, b) => b[1] - a[1]
  )[0][0] as Mood;

  const message = getSummaryMessage(dominantMood, data.length);

  return (
    <div
      className={cn(
        "bg-primary-50 rounded-xl p-4 text-center border border-primary-100",
        className
      )}
    >
      <div className="text-3xl mb-2">{moodEmojis[dominantMood]}</div>
      <p className="text-sm text-primary-700">{message}</p>
    </div>
  );
}

function getSummaryMessage(mood: Mood, days: number): string {
  const messages: Record<Mood, string> = {
    great: `${days}日間、とても調子が良かったね！`,
    good: `${days}日間、いい感じで過ごせたね`,
    okay: `${days}日間、マイペースに頑張ったね`,
    tired: "お疲れ気味だったね。無理しないでね",
    tough: "大変な週だったね。よく頑張ったよ",
  };
  return messages[mood];
}

export { moodEmojis, moodLabels };
