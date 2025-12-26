import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 時間帯に応じた挨拶を返す
 */
export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) {
    return "おはよう";
  } else if (hour >= 11 && hour < 17) {
    return "おつかれさま";
  } else if (hour >= 17 && hour < 22) {
    return "今日もおつかれさま";
  } else {
    return "夜遅くまでえらいね";
  }
}

/**
 * 日付を YYYY-MM-DD 形式で返す
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * 今日の日付を YYYY-MM-DD 形式で返す
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * 指定した日付が含まれる週の月曜日を YYYY-MM-DD 形式で返す
 */
export function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 日曜日は-6、それ以外は1を引く
  d.setDate(diff);
  return formatDate(d);
}

/**
 * 曜日の短縮名を返す
 */
export function getDayName(date: Date): string {
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return days[date.getDay()];
}

/**
 * 日付を「12/26(木)」形式で返す
 */
export function formatDateShort(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayName = getDayName(date);
  return `${month}/${day}(${dayName})`;
}
