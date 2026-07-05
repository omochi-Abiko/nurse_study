// 間隔反復学習（Spaced Repetition）アルゴリズム
// 簡易SM-2アルゴリズムをベースに実装

/**
 * 復習スケジュールの状態
 */
export interface ReviewScheduleState {
  interval: number;      // 復習間隔（日数）
  easeFactor: number;    // 難易度係数（1.3〜2.5）
  reviewCount: number;   // 復習回数
  nextReviewDate: Date;  // 次回復習日
}

/**
 * 回答の品質（正解/不正解）
 */
export type AnswerQuality = "correct" | "incorrect";

/**
 * デフォルトの初期値
 */
export const DEFAULT_EASE_FACTOR = 2.5;
export const MIN_EASE_FACTOR = 1.3;
export const MAX_EASE_FACTOR = 2.5;

/**
 * 次の復習スケジュールを計算
 *
 * SM-2アルゴリズムの簡易版:
 * - 正解時: interval × easeFactor、easeFactor維持または微増
 * - 不正解時: interval = 1日にリセット、easeFactor減少
 */
export function calculateNextReview(
  current: ReviewScheduleState | null,
  quality: AnswerQuality
): ReviewScheduleState {
  const now = new Date();

  // 初回の場合
  if (!current) {
    if (quality === "correct") {
      // 初回正解: 1日後に復習
      return {
        interval: 1,
        easeFactor: DEFAULT_EASE_FACTOR,
        reviewCount: 1,
        nextReviewDate: addDays(now, 1),
      };
    } else {
      // 初回不正解: 翌日また復習
      return {
        interval: 1,
        easeFactor: DEFAULT_EASE_FACTOR - 0.2,
        reviewCount: 1,
        nextReviewDate: addDays(now, 1),
      };
    }
  }

  const { interval, easeFactor, reviewCount } = current;

  if (quality === "correct") {
    // 正解: 間隔を伸ばす
    let newInterval: number;

    if (reviewCount === 1) {
      // 2回目の正解: 6日後
      newInterval = 6;
    } else {
      // 3回目以降: 前回の間隔 × easeFactor
      newInterval = Math.round(interval * easeFactor);
    }

    // 最大90日
    newInterval = Math.min(newInterval, 90);

    return {
      interval: newInterval,
      easeFactor: Math.min(easeFactor + 0.1, MAX_EASE_FACTOR),
      reviewCount: reviewCount + 1,
      nextReviewDate: addDays(now, newInterval),
    };
  } else {
    // 不正解: 間隔をリセット
    return {
      interval: 1,
      easeFactor: Math.max(easeFactor - 0.2, MIN_EASE_FACTOR),
      reviewCount: reviewCount + 1,
      nextReviewDate: addDays(now, 1),
    };
  }
}

/**
 * 日付に日数を加算
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 今日が復習日かどうかを判定
 */
export function isDueToday(nextReviewDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reviewDate = new Date(nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);

  return reviewDate <= today;
}

/**
 * 復習日までの残り日数を取得
 */
export function getDaysUntilReview(nextReviewDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reviewDate = new Date(nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);

  const diffTime = reviewDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * 復習状態のラベルを取得
 */
export function getReviewStatusLabel(nextReviewDate: Date): string {
  const days = getDaysUntilReview(nextReviewDate);

  if (days <= 0) {
    return "今日復習";
  } else if (days === 1) {
    return "明日復習";
  } else {
    return `${days}日後`;
  }
}

/**
 * 習熟度のレベルを取得（復習間隔に基づく）
 */
export function getMasteryLevel(interval: number): {
  level: number;
  label: string;
  color: string;
} {
  if (interval >= 30) {
    return { level: 5, label: "習得済み", color: "success" };
  } else if (interval >= 14) {
    return { level: 4, label: "得意", color: "secondary" };
  } else if (interval >= 7) {
    return { level: 3, label: "まあまあ", color: "primary" };
  } else if (interval >= 3) {
    return { level: 2, label: "練習中", color: "warning" };
  } else {
    return { level: 1, label: "苦手", color: "error" };
  }
}
