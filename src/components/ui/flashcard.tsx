"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  term: string;
  reading?: string;
  definition: string;
  example?: string;
  isFlipped: boolean;
  onFlip: () => void;
  color?: "primary" | "secondary" | "warning" | "success" | "neutral";
}

export function Flashcard({
  term,
  reading,
  definition,
  example,
  isFlipped,
  onFlip,
  color = "primary",
}: FlashcardProps) {
  const colorStyles = {
    primary: {
      front: "bg-gradient-to-br from-primary-400 to-primary-600",
      back: "bg-white border-2 border-primary-200",
      text: "text-white",
      backText: "text-neutral-800",
    },
    secondary: {
      front: "bg-gradient-to-br from-secondary-400 to-secondary-600",
      back: "bg-white border-2 border-secondary-200",
      text: "text-white",
      backText: "text-neutral-800",
    },
    warning: {
      front: "bg-gradient-to-br from-warning-400 to-warning-600",
      back: "bg-white border-2 border-warning-200",
      text: "text-white",
      backText: "text-neutral-800",
    },
    success: {
      front: "bg-gradient-to-br from-success-400 to-success-600",
      back: "bg-white border-2 border-success-200",
      text: "text-white",
      backText: "text-neutral-800",
    },
    neutral: {
      front: "bg-gradient-to-br from-neutral-500 to-neutral-700",
      back: "bg-white border-2 border-neutral-200",
      text: "text-white",
      backText: "text-neutral-800",
    },
  };

  const styles = colorStyles[color];

  return (
    <div
      className="w-full aspect-[3/2] perspective-1000 cursor-pointer"
      onClick={onFlip}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-style-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* 表面（用語） */}
        <div
          className={cn(
            "absolute w-full h-full rounded-2xl shadow-lg backface-hidden",
            "flex flex-col items-center justify-center p-6",
            styles.front
          )}
        >
          <p className={cn("text-3xl font-bold text-center", styles.text)}>
            {term}
          </p>
          {reading && (
            <p className={cn("text-sm mt-2 opacity-80", styles.text)}>
              {reading}
            </p>
          )}
          <p className={cn("text-xs mt-4 opacity-60", styles.text)}>
            タップして意味を見る
          </p>
        </div>

        {/* 裏面（意味） */}
        <div
          className={cn(
            "absolute w-full h-full rounded-2xl shadow-lg backface-hidden rotate-y-180",
            "flex flex-col items-center justify-center p-6",
            styles.back
          )}
        >
          <p className={cn("text-lg font-medium text-center leading-relaxed", styles.backText)}>
            {definition}
          </p>
          {example && (
            <p className="text-sm text-neutral-500 mt-3 text-center">
              例: {example}
            </p>
          )}
          <p className="text-xs text-neutral-400 mt-4">
            タップして戻る
          </p>
        </div>
      </div>
    </div>
  );
}

// 進捗インジケーター
interface FlashcardProgressProps {
  current: number;
  total: number;
}

export function FlashcardProgress({ current, total }: FlashcardProgressProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-neutral-600">
        {current} / {total}
      </span>
      <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
