import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  QuizAnswer,
  DailyQuiz,
  WeakQuestion,
  ChecklistItem,
  Mood,
  Reflection,
  DailyProgress,
  WeeklySummary,
  SOAPRecord,
  CategoryStats,
  VoiceSettings,
  ExamSettings,
  Facility,
  FacilityNote,
  PhotoNote,
  CustomQuestion,
} from "@/types";
import { getDailyQuestions, getQuestionById, questions, questionCategories } from "@/data/questions";
import { defaultChecklist } from "@/data/templates";
import { getToday, getWeekStart } from "@/lib/utils";

// カスタムクイズセッション
interface QuizSession {
  questionIds: string[];
  answers: QuizAnswer[];
  completed: boolean;
  categories: string[]; // 選択されたカテゴリ
  mode: "daily" | "category" | "all" | "weak"; // クイズモード
}

interface AppState {
  // ========================================
  // 今日のクイズ
  // ========================================
  dailyQuiz: DailyQuiz | null;
  initDailyQuiz: () => void;
  answerQuestion: (questionId: string, selectedIndex: number, isCorrect: boolean) => void;
  completeDailyQuiz: () => void;

  // ========================================
  // カスタムクイズセッション
  // ========================================
  currentQuizSession: QuizSession | null;
  startQuizSession: (categories: string[], count: number, mode: QuizSession["mode"]) => void;
  answerQuizSession: (questionId: string, selectedIndex: number, isCorrect: boolean) => void;
  completeQuizSession: () => void;
  clearQuizSession: () => void;

  // ========================================
  // 回答履歴（カテゴリ分析用）
  // ========================================
  answerHistory: QuizAnswer[];

  // ========================================
  // 苦手リスト
  // ========================================
  weakQuestions: WeakQuestion[];
  addWeakQuestion: (questionId: string) => void;
  removeWeakQuestion: (questionId: string) => void;
  updateWeakQuestionReview: (questionId: string) => void;

  // ========================================
  // 苦手分野分析
  // ========================================
  getCategoryStats: () => CategoryStats[];
  getWeakCategories: () => string[];

  // ========================================
  // 実習モード
  // ========================================
  isPracticumMode: boolean;
  togglePracticumMode: () => void;
  checklist: ChecklistItem[];
  toggleChecklistItem: (id: string) => void;
  addChecklistItem: (text: string) => void;
  removeChecklistItem: (id: string) => void;
  resetChecklist: () => void;

  // ========================================
  // ふりかえり
  // ========================================
  todayReflection: Reflection | null;
  reflectionHistory: Reflection[];
  saveReflection: (mood: Mood, note?: string) => void;

  // ========================================
  // 週間サマリー
  // ========================================
  getWeeklySummary: (weekStart?: string) => WeeklySummary;

  // ========================================
  // SOAP記録
  // ========================================
  soapRecords: SOAPRecord[];
  addSOAPRecord: (record: Omit<SOAPRecord, "id" | "createdAt" | "updatedAt">) => void;
  updateSOAPRecord: (id: string, record: Partial<SOAPRecord>) => void;
  deleteSOAPRecord: (id: string) => void;

  // ========================================
  // 進捗
  // ========================================
  getProgress: () => DailyProgress;

  // ========================================
  // Phase 2: 音声設定
  // ========================================
  voiceSettings: VoiceSettings;
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;

  // ========================================
  // Phase 2: 国試設定
  // ========================================
  examSettings: ExamSettings | null;
  updateExamSettings: (settings: ExamSettings) => void;
  getDaysUntilExam: () => number | null;

  // ========================================
  // Phase 2: 実習施設
  // ========================================
  facilities: Facility[];
  currentFacilityId: string | null;
  addFacility: (name: string, address?: string) => void;
  updateFacility: (id: string, data: Partial<Facility>) => void;
  deleteFacility: (id: string) => void;
  addFacilityNote: (facilityId: string, category: FacilityNote["category"], content: string) => void;
  deleteFacilityNote: (facilityId: string, noteId: string) => void;
  setCurrentFacility: (id: string | null) => void;

  // ========================================
  // Phase 3: 写真メモ
  // ========================================
  photoNotes: PhotoNote[];
  addPhotoNote: (imageData: string, title?: string, tags?: string[]) => void;
  updatePhotoNote: (id: string, data: Partial<PhotoNote>) => void;
  deletePhotoNote: (id: string) => void;

  // ========================================
  // Phase 3: カスタム問題
  // ========================================
  customQuestions: CustomQuestion[];
  addCustomQuestion: (question: Omit<CustomQuestion, "id" | "isCustom" | "createdAt">) => void;
  deleteCustomQuestion: (id: string) => void;

  // ========================================
  // Toast通知
  // ========================================
  toasts: Array<{ id: string; variant: "success" | "info" | "warning"; message: string }>;
  showToast: (variant: "success" | "info" | "warning", message: string) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ========================================
      // 今日のクイズ
      // ========================================
      dailyQuiz: null,

      initDailyQuiz: () => {
        const today = getToday();
        const current = get().dailyQuiz;

        // 日付が違う場合、または問題数が3未満の場合は再生成
        if (current?.date === today && current.questionIds.length >= 3) return;

        const questions = getDailyQuestions(today, 3);
        set({
          dailyQuiz: {
            date: today,
            questionIds: questions.map((q) => q.id),
            answers: [],
            completed: false,
          },
        });
      },

      answerQuestion: (questionId, selectedIndex, isCorrect) => {
        const quiz = get().dailyQuiz;
        if (!quiz) return;

        const question = getQuestionById(questionId);
        const newAnswer: QuizAnswer = {
          questionId,
          selectedIndex,
          isCorrect,
          answeredAt: new Date().toISOString(),
          category: question?.category,
        };

        // 回答履歴にも追加
        set({
          dailyQuiz: {
            ...quiz,
            answers: [...quiz.answers, newAnswer],
          },
          answerHistory: [...get().answerHistory, newAnswer],
        });

        // 間違えた問題は自動で苦手リストに追加
        if (!isCorrect) {
          const existing = get().weakQuestions.find((w) => w.questionId === questionId);
          if (!existing) {
            set({
              weakQuestions: [
                ...get().weakQuestions,
                {
                  questionId,
                  addedAt: new Date().toISOString(),
                  reviewCount: 0,
                },
              ],
            });
          }
        }
      },

      completeDailyQuiz: () => {
        const quiz = get().dailyQuiz;
        if (!quiz) return;

        set({
          dailyQuiz: {
            ...quiz,
            completed: true,
          },
        });
      },

      // ========================================
      // カスタムクイズセッション
      // ========================================
      currentQuizSession: null,

      startQuizSession: (categories, count, mode) => {
        // カテゴリでフィルタリング
        let filteredQuestions = [...questions];

        if (categories.length > 0 && mode !== "all") {
          filteredQuestions = questions.filter((q) =>
            categories.includes(q.category)
          );
        }

        // 苦手モードの場合は苦手問題を優先
        if (mode === "weak") {
          const weakIds = get().weakQuestions.map((w) => w.questionId);
          const weakQs = questions.filter((q) => weakIds.includes(q.id));
          if (weakQs.length > 0) {
            filteredQuestions = weakQs;
          }
        }

        // カスタム問題も含める
        const customQs = get().customQuestions;
        if (categories.length === 0 || mode === "all") {
          filteredQuestions = [...filteredQuestions, ...customQs];
        } else {
          const filteredCustom = customQs.filter((q) =>
            categories.includes(q.category)
          );
          filteredQuestions = [...filteredQuestions, ...filteredCustom];
        }

        // シャッフル
        const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);

        // 指定数だけ取得（0の場合は全問）
        const selected = count > 0 ? shuffled.slice(0, count) : shuffled;

        set({
          currentQuizSession: {
            questionIds: selected.map((q) => q.id),
            answers: [],
            completed: false,
            categories,
            mode,
          },
        });
      },

      answerQuizSession: (questionId, selectedIndex, isCorrect) => {
        const session = get().currentQuizSession;
        if (!session) return;

        const question = getQuestionById(questionId) || get().customQuestions.find((q) => q.id === questionId);
        const newAnswer: QuizAnswer = {
          questionId,
          selectedIndex,
          isCorrect,
          answeredAt: new Date().toISOString(),
          category: question?.category,
        };

        // 回答履歴にも追加
        set({
          currentQuizSession: {
            ...session,
            answers: [...session.answers, newAnswer],
          },
          answerHistory: [...get().answerHistory, newAnswer],
        });

        // 間違えた問題は自動で苦手リストに追加（カスタム問題以外）
        if (!isCorrect && !questionId.startsWith("custom-q-")) {
          const existing = get().weakQuestions.find((w) => w.questionId === questionId);
          if (!existing) {
            set({
              weakQuestions: [
                ...get().weakQuestions,
                {
                  questionId,
                  addedAt: new Date().toISOString(),
                  reviewCount: 0,
                },
              ],
            });
          }
        }
      },

      completeQuizSession: () => {
        const session = get().currentQuizSession;
        if (!session) return;

        set({
          currentQuizSession: {
            ...session,
            completed: true,
          },
        });
      },

      clearQuizSession: () => {
        set({ currentQuizSession: null });
      },

      // ========================================
      // 回答履歴
      // ========================================
      answerHistory: [],

      // ========================================
      // 苦手リスト
      // ========================================
      weakQuestions: [],

      addWeakQuestion: (questionId) => {
        const existing = get().weakQuestions.find((w) => w.questionId === questionId);
        if (existing) return;

        set({
          weakQuestions: [
            ...get().weakQuestions,
            {
              questionId,
              addedAt: new Date().toISOString(),
              reviewCount: 0,
            },
          ],
        });

        get().showToast("success", "復習リストに追加したよ");
      },

      removeWeakQuestion: (questionId) => {
        set({
          weakQuestions: get().weakQuestions.filter((w) => w.questionId !== questionId),
        });
      },

      updateWeakQuestionReview: (questionId) => {
        set({
          weakQuestions: get().weakQuestions.map((w) =>
            w.questionId === questionId
              ? {
                  ...w,
                  lastReviewedAt: new Date().toISOString(),
                  reviewCount: w.reviewCount + 1,
                }
              : w
          ),
        });
      },

      // ========================================
      // 苦手分野分析
      // ========================================
      getCategoryStats: () => {
        const history = get().answerHistory;
        const categoryMap = new Map<string, { total: number; correct: number }>();

        history.forEach((answer) => {
          if (!answer.category) return;
          const current = categoryMap.get(answer.category) || { total: 0, correct: 0 };
          categoryMap.set(answer.category, {
            total: current.total + 1,
            correct: current.correct + (answer.isCorrect ? 1 : 0),
          });
        });

        const stats: CategoryStats[] = [];
        categoryMap.forEach((value, category) => {
          const accuracy = value.total > 0 ? (value.correct / value.total) * 100 : 0;
          stats.push({
            category,
            totalAnswered: value.total,
            correctCount: value.correct,
            accuracy: Math.round(accuracy),
            isWeak: accuracy < 60 && value.total >= 3, // 3問以上回答して60%未満
          });
        });

        return stats.sort((a, b) => a.accuracy - b.accuracy);
      },

      getWeakCategories: () => {
        return get().getCategoryStats()
          .filter((s) => s.isWeak)
          .map((s) => s.category);
      },

      // ========================================
      // 実習モード
      // ========================================
      isPracticumMode: false,

      togglePracticumMode: () => {
        set({ isPracticumMode: !get().isPracticumMode });
      },

      checklist: defaultChecklist,

      toggleChecklistItem: (id) => {
        set({
          checklist: get().checklist.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        });
      },

      addChecklistItem: (text) => {
        const id = `custom-${Date.now()}`;
        set({
          checklist: [...get().checklist, { id, text, checked: false }],
        });
      },

      removeChecklistItem: (id) => {
        set({
          checklist: get().checklist.filter((item) => item.id !== id),
        });
      },

      resetChecklist: () => {
        set({
          checklist: get().checklist.map((item) => ({ ...item, checked: false })),
        });
      },

      // ========================================
      // ふりかえり
      // ========================================
      todayReflection: null,
      reflectionHistory: [],

      saveReflection: (mood, note) => {
        const today = getToday();
        const reflection: Reflection = {
          date: today,
          mood,
          note,
          createdAt: new Date().toISOString(),
        };

        // 今日のふりかえりを更新し、履歴にも追加
        const history = get().reflectionHistory.filter((r) => r.date !== today);
        set({
          todayReflection: reflection,
          reflectionHistory: [...history, reflection],
        });
        get().showToast("success", "今日もおつかれさま");
      },

      // ========================================
      // 週間サマリー
      // ========================================
      getWeeklySummary: (weekStart?: string) => {
        const start = weekStart || getWeekStart(new Date());
        const startDate = new Date(start);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);

        const history = get().reflectionHistory;
        const answers = get().answerHistory;

        // 期間内のデータをフィルタ
        const weekReflections = history.filter((r) => {
          const d = new Date(r.date);
          return d >= startDate && d < endDate;
        });

        const weekAnswers = answers.filter((a) => {
          const d = new Date(a.answeredAt);
          return d >= startDate && d < endDate;
        });

        // クイズ統計
        const totalQuestions = weekAnswers.length;
        const correctAnswers = weekAnswers.filter((a) => a.isCorrect).length;
        const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

        // 気分履歴
        const moodHistory = weekReflections.map((r) => ({
          date: r.date,
          mood: r.mood,
        }));

        // ひとこと
        const reflections = weekReflections.map((r) => ({
          date: r.date,
          note: r.note,
        }));

        // 連続学習日数（簡易計算）
        const streakDays = weekReflections.length;

        return {
          weekStart: start,
          quizStats: {
            totalQuestions,
            correctAnswers,
            accuracy,
          },
          moodHistory,
          reflections,
          streakDays,
        };
      },

      // ========================================
      // SOAP記録
      // ========================================
      soapRecords: [],

      addSOAPRecord: (record) => {
        const now = new Date().toISOString();
        const newRecord: SOAPRecord = {
          ...record,
          id: `soap-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        set({ soapRecords: [...get().soapRecords, newRecord] });
        get().showToast("success", "SOAP記録を保存しました");
      },

      updateSOAPRecord: (id, record) => {
        set({
          soapRecords: get().soapRecords.map((r) =>
            r.id === id
              ? { ...r, ...record, updatedAt: new Date().toISOString() }
              : r
          ),
        });
      },

      deleteSOAPRecord: (id) => {
        set({
          soapRecords: get().soapRecords.filter((r) => r.id !== id),
        });
      },

      // ========================================
      // 進捗
      // ========================================
      getProgress: () => {
        const today = getToday();
        const quiz = get().dailyQuiz;
        const checklist = get().checklist;
        const reflection = get().todayReflection;
        const isPracticumMode = get().isPracticumMode;

        return {
          date: today,
          quizCompleted: quiz?.date === today && quiz.completed,
          practicumCompleted: isPracticumMode
            ? checklist.every((item) => item.checked)
            : true,
          reflectionCompleted: reflection?.date === today,
        };
      },

      // ========================================
      // Phase 2: 音声設定
      // ========================================
      voiceSettings: {
        enabled: false,
        rate: 1.0,
        autoPlay: false,
      },

      updateVoiceSettings: (settings) => {
        set({
          voiceSettings: { ...get().voiceSettings, ...settings },
        });
      },

      // ========================================
      // Phase 2: 国試設定
      // ========================================
      examSettings: null,

      updateExamSettings: (settings) => {
        set({ examSettings: settings });
      },

      getDaysUntilExam: () => {
        const settings = get().examSettings;
        if (!settings) return null;

        const today = new Date();
        const examDate = new Date(settings.examDate);
        const diff = examDate.getTime() - today.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
      },

      // ========================================
      // Phase 2: 実習施設
      // ========================================
      facilities: [],
      currentFacilityId: null,

      addFacility: (name, address) => {
        const newFacility: Facility = {
          id: `facility-${Date.now()}`,
          name,
          address,
          notes: [],
          checklist: [],
          createdAt: new Date().toISOString(),
        };
        set({ facilities: [...get().facilities, newFacility] });
        get().showToast("success", "施設を追加しました");
      },

      updateFacility: (id, data) => {
        set({
          facilities: get().facilities.map((f) =>
            f.id === id ? { ...f, ...data } : f
          ),
        });
      },

      deleteFacility: (id) => {
        set({
          facilities: get().facilities.filter((f) => f.id !== id),
          currentFacilityId: get().currentFacilityId === id ? null : get().currentFacilityId,
        });
      },

      addFacilityNote: (facilityId, category, content) => {
        const newNote: FacilityNote = {
          id: `note-${Date.now()}`,
          category,
          content,
          createdAt: new Date().toISOString(),
        };
        set({
          facilities: get().facilities.map((f) =>
            f.id === facilityId
              ? { ...f, notes: [...f.notes, newNote] }
              : f
          ),
        });
      },

      deleteFacilityNote: (facilityId, noteId) => {
        set({
          facilities: get().facilities.map((f) =>
            f.id === facilityId
              ? { ...f, notes: f.notes.filter((n) => n.id !== noteId) }
              : f
          ),
        });
      },

      setCurrentFacility: (id) => {
        set({ currentFacilityId: id });
      },

      // ========================================
      // Phase 3: 写真メモ
      // ========================================
      photoNotes: [],

      addPhotoNote: (imageData, title, tags = []) => {
        const newNote: PhotoNote = {
          id: `photo-${Date.now()}`,
          imageData,
          title,
          tags,
          createdAt: new Date().toISOString(),
        };
        set({ photoNotes: [...get().photoNotes, newNote] });
        get().showToast("success", "メモを保存しました");
      },

      updatePhotoNote: (id, data) => {
        set({
          photoNotes: get().photoNotes.map((n) =>
            n.id === id ? { ...n, ...data } : n
          ),
        });
      },

      deletePhotoNote: (id) => {
        set({
          photoNotes: get().photoNotes.filter((n) => n.id !== id),
        });
      },

      // ========================================
      // Phase 3: カスタム問題
      // ========================================
      customQuestions: [],

      addCustomQuestion: (question) => {
        const newQuestion: CustomQuestion = {
          ...question,
          id: `custom-q-${Date.now()}`,
          isCustom: true,
          createdAt: new Date().toISOString(),
        };
        set({ customQuestions: [...get().customQuestions, newQuestion] });
        get().showToast("success", "問題を追加しました");
      },

      deleteCustomQuestion: (id) => {
        set({
          customQuestions: get().customQuestions.filter((q) => q.id !== id),
        });
      },

      // ========================================
      // Toast通知
      // ========================================
      toasts: [],

      showToast: (variant, message) => {
        const id = `toast-${Date.now()}`;
        set({ toasts: [...get().toasts, { id, variant, message }] });

        setTimeout(() => {
          get().removeToast(id);
        }, 2000);
      },

      removeToast: (id) => {
        set({ toasts: get().toasts.filter((t) => t.id !== id) });
      },
    }),
    {
      name: "nurse-study-storage",
      partialize: (state) => ({
        dailyQuiz: state.dailyQuiz,
        answerHistory: state.answerHistory,
        weakQuestions: state.weakQuestions,
        isPracticumMode: state.isPracticumMode,
        checklist: state.checklist,
        todayReflection: state.todayReflection,
        reflectionHistory: state.reflectionHistory,
        soapRecords: state.soapRecords,
        voiceSettings: state.voiceSettings,
        examSettings: state.examSettings,
        facilities: state.facilities,
        currentFacilityId: state.currentFacilityId,
        photoNotes: state.photoNotes,
        customQuestions: state.customQuestions,
      }),
    }
  )
);
