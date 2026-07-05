// localStorageベースのローカルデータベース
// 静的サイト化に伴い、サーバーDB（Neon/Prisma）の代わりに
// すべてのユーザーデータをブラウザのlocalStorageに保存する

const PREFIX = "nursestudy:";

// ========== 型定義 ==========

export interface LocalQuizAnswer {
  id: string;
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  category?: string;
  answeredAt: string; // ISO文字列
}

export interface LocalWeakQuestion {
  id: string;
  questionId: string;
  addedAt: string;
  reviewCount: number;
  lastReviewedAt: string | null;
}

export interface LocalReflection {
  id: string;
  date: string; // YYYY-MM-DD
  mood: string;
  note?: string;
  createdAt: string;
}

export interface LocalSoapRecord {
  id: string;
  date: string;
  patientId?: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalFacilityNote {
  id: string;
  facilityId: string;
  category: string;
  content: string;
  createdAt: string;
}

export interface LocalFacility {
  id: string;
  name: string;
  address?: string;
  createdAt: string;
}

export interface LocalSettings {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  examDate: string | null;
  examYear: number | null;
  voiceEnabled: boolean;
  voiceRate: number;
  voiceAutoPlay: boolean;
}

export interface LocalReviewSchedule {
  id: string;
  questionId: string;
  interval: number;
  easeFactor: number;
  reviewCount: number;
  nextReviewDate: string;
  lastReviewedAt: string;
}

// ========== 基本ヘルパー ==========

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function readCollection<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function writeCollection<T>(key: string, items: T[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(PREFIX + key, JSON.stringify(items));
}

export function readObject<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeObject<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

// ローカルタイムゾーンでの日付文字列（YYYY-MM-DD）
export function localDateStr(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ========== コレクションキー ==========

export const DB_KEYS = {
  QUIZ_ANSWERS: "quizAnswers",
  WEAK_QUESTIONS: "weakQuestions",
  REFLECTIONS: "reflections",
  SOAP_RECORDS: "soapRecords",
  FACILITIES: "facilities",
  FACILITY_NOTES: "facilityNotes",
  SETTINGS: "settings",
  LEARNING_PROGRESS: "learningProgress",
  REVIEW_SCHEDULES: "reviewSchedules",
} as const;

// ========== デフォルト設定 ==========

export const DEFAULT_SETTINGS: LocalSettings = {
  id: "local-user",
  name: null,
  email: null,
  image: null,
  examDate: null,
  examYear: null,
  voiceEnabled: true,
  voiceRate: 1.0,
  voiceAutoPlay: false,
};

export function getSettings(): LocalSettings {
  return { ...DEFAULT_SETTINGS, ...(readObject<LocalSettings>(DB_KEYS.SETTINGS) ?? {}) };
}
