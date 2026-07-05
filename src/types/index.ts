// クイズ関連の型
export interface Question {
  id: string;
  text: string;
  type: "choice" | "truefalse";
  options?: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  // 出典情報
  source?: string; // 出典（例: "第112回看護師国家試験"）
  examYear?: number; // 出題年度
  // Phase 2: 国試出題傾向
  examFrequency?: number; // 過去5年の出題回数
  lastExamYear?: number;  // 最後に出題された年
}

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  answeredAt: string;
  category?: string; // カテゴリ別分析用
}

export interface DailyQuiz {
  date: string;
  questionIds: string[];
  answers: QuizAnswer[];
  completed: boolean;
}

// 苦手リスト
export interface WeakQuestion {
  questionId: string;
  addedAt: string;
  lastReviewedAt?: string;
  reviewCount: number;
}

// 実習チェックリスト
export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface PracticumDay {
  date: string;
  enabled: boolean;
  checklist: ChecklistItem[];
}

// ふりかえり
export type Mood = "great" | "good" | "okay" | "tired" | "tough";

export interface Reflection {
  date: string;
  mood: Mood;
  note?: string;
  createdAt: string;
}

// 達成状況
export interface DailyProgress {
  date: string;
  quizCompleted: boolean;
  practicumCompleted: boolean;
  reflectionCompleted: boolean;
}

// ========================================
// Phase 1: 週間サマリー
// ========================================
export interface WeeklySummary {
  weekStart: string; // YYYY-MM-DD (月曜日)
  quizStats: {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
  };
  moodHistory: { date: string; mood: Mood }[];
  reflections: { date: string; note?: string }[];
  streakDays: number;
}

// ========================================
// Phase 1: SOAP記録
// ========================================
export interface SOAPRecord {
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

export interface SOAPTemplate {
  id: string;
  category: string;
  name: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

// ========================================
// Phase 1: 苦手分野分析
// ========================================
export interface CategoryStats {
  category: string;
  totalAnswered: number;
  correctCount: number;
  accuracy: number;
  isWeak: boolean; // 正答率60%未満
}

// ========================================
// Phase 2: 学年設定
// ========================================
export type StudentGrade = 1 | 2 | 3 | 4;

export interface GradeSettings {
  grade: StudentGrade;
  updatedAt: string;
}

// ========================================
// Phase 2: 音声設定
// ========================================
export interface VoiceSettings {
  enabled: boolean;
  rate: number; // 0.5 - 2.0
  autoPlay: boolean;
}

// ========================================
// Phase 2: 国試設定
// ========================================
export interface ExamSettings {
  examDate: string; // YYYY-MM-DD
  targetYear: number;
}

// ========================================
// Phase 2: 実習施設
// ========================================
export interface Facility {
  id: string;
  name: string;
  address?: string;
  notes: FacilityNote[];
  checklist: ChecklistItem[];
  createdAt: string;
}

export interface FacilityNote {
  id: string;
  category: "rule" | "tip" | "warning";
  content: string;
  createdAt: string;
}

// ========================================
// Phase 3: 写真メモ
// ========================================
export interface PhotoNote {
  id: string;
  title?: string;
  imageData: string;
  tags: string[];
  category?: string;
  createdAt: string;
}

// ========================================
// Phase 3: カスタム問題
// ========================================
export interface CustomQuestion extends Omit<Question, "id"> {
  id: string;
  isCustom: true;
  source?: string;
  createdAt: string;
}
