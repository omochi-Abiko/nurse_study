// ローカルAPIクライアント
// 静的サイト化に伴い、サーバーAPIの代わりにlocalStorageへ読み書きする。
// 既存のSWR hooks（useApi.ts）と互換のインターフェース・レスポンス形状を維持している。

import {
  DB_KEYS,
  DEFAULT_SETTINGS,
  generateId,
  getSettings as readSettings,
  localDateStr,
  readCollection,
  writeCollection,
  writeObject,
  type LocalFacility,
  type LocalFacilityNote,
  type LocalQuizAnswer,
  type LocalReflection,
  type LocalReviewSchedule,
  type LocalSettings,
  type LocalSoapRecord,
  type LocalWeakQuestion,
} from "@/lib/local-db";
import { calculateNextReview, type AnswerQuality } from "@/lib/spaced-repetition";

// ========== Quiz API ==========

export const quizApi = {
  // 回答を記録
  async recordAnswer(data: {
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
    category?: string;
  }) {
    const answers = readCollection<LocalQuizAnswer>(DB_KEYS.QUIZ_ANSWERS);
    const answer: LocalQuizAnswer = {
      id: generateId(),
      questionId: data.questionId,
      selectedIndex: data.selectedIndex,
      isCorrect: data.isCorrect,
      category: data.category,
      answeredAt: new Date().toISOString(),
    };
    answers.push(answer);
    writeCollection(DB_KEYS.QUIZ_ANSWERS, answers);

    // 間違えた問題は自動で苦手リストに追加
    if (!data.isCorrect) {
      const weak = readCollection<LocalWeakQuestion>(DB_KEYS.WEAK_QUESTIONS);
      if (!weak.some((w) => w.questionId === data.questionId)) {
        weak.push({
          id: generateId(),
          questionId: data.questionId,
          addedAt: new Date().toISOString(),
          reviewCount: 0,
          lastReviewedAt: null,
        });
        writeCollection(DB_KEYS.WEAK_QUESTIONS, weak);
      }
    }

    return { answer };
  },

  // 回答履歴を取得
  async getAnswers(questionId?: string, limit?: number) {
    let answers = readCollection<LocalQuizAnswer>(DB_KEYS.QUIZ_ANSWERS);
    if (questionId) {
      answers = answers.filter((a) => a.questionId === questionId);
    }
    answers = answers
      .slice()
      .sort((a, b) => b.answeredAt.localeCompare(a.answeredAt))
      .slice(0, limit ?? 100);
    return { answers };
  },
};

// ========== Weak Questions API ==========

export const weakApi = {
  // 苦手問題一覧を取得
  async getWeakQuestions() {
    return getWeakQuestionsData();
  },

  // 苦手問題を追加
  async addWeakQuestion(questionId: string) {
    const weak = readCollection<LocalWeakQuestion>(DB_KEYS.WEAK_QUESTIONS);
    const existing = weak.find((w) => w.questionId === questionId);
    if (existing) {
      return { weakQuestion: existing };
    }
    const weakQuestion: LocalWeakQuestion = {
      id: generateId(),
      questionId,
      addedAt: new Date().toISOString(),
      reviewCount: 0,
      lastReviewedAt: null,
    };
    weak.push(weakQuestion);
    writeCollection(DB_KEYS.WEAK_QUESTIONS, weak);
    return { weakQuestion };
  },

  // 苦手問題を削除
  async removeWeakQuestion(questionId: string) {
    const weak = readCollection<LocalWeakQuestion>(DB_KEYS.WEAK_QUESTIONS);
    writeCollection(
      DB_KEYS.WEAK_QUESTIONS,
      weak.filter((w) => w.questionId !== questionId)
    );
  },

  // 復習回数を更新
  async reviewWeakQuestion(questionId: string) {
    const weak = readCollection<LocalWeakQuestion>(DB_KEYS.WEAK_QUESTIONS);
    const target = weak.find((w) => w.questionId === questionId);
    if (target) {
      target.reviewCount += 1;
      target.lastReviewedAt = new Date().toISOString();
      writeCollection(DB_KEYS.WEAK_QUESTIONS, weak);
    }
    return { weakQuestion: target };
  },
};

function getWeakQuestionsData() {
  const weakQuestions = readCollection<LocalWeakQuestion>(DB_KEYS.WEAK_QUESTIONS)
    .slice()
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  return { weakQuestions };
}

// ========== Reflection API ==========

export const reflectionApi = {
  // ふりかえり一覧を取得
  async getReflections(limit?: number) {
    return getReflectionsData(limit);
  },

  // 特定日のふりかえりを取得
  async getReflection(date: string) {
    const reflections = readCollection<LocalReflection>(DB_KEYS.REFLECTIONS);
    return { reflection: reflections.find((r) => r.date === date) ?? null };
  },

  // ふりかえりを保存（同じ日付があれば上書き）
  async saveReflection(data: { date: string; mood: string; note?: string }) {
    const reflections = readCollection<LocalReflection>(DB_KEYS.REFLECTIONS);
    const existing = reflections.find((r) => r.date === data.date);
    if (existing) {
      existing.mood = data.mood;
      existing.note = data.note;
      writeCollection(DB_KEYS.REFLECTIONS, reflections);
      return { reflection: existing };
    }
    const reflection: LocalReflection = {
      id: generateId(),
      date: data.date,
      mood: data.mood,
      note: data.note,
      createdAt: new Date().toISOString(),
    };
    reflections.push(reflection);
    writeCollection(DB_KEYS.REFLECTIONS, reflections);
    return { reflection };
  },
};

function getReflectionsData(limit?: number) {
  const reflections = readCollection<LocalReflection>(DB_KEYS.REFLECTIONS)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit ?? 30);
  return { reflections };
}

// ========== SOAP API ==========

export const soapApi = {
  // SOAP記録一覧を取得
  async getRecords(date?: string, limit?: number) {
    return getSoapRecordsData(date, limit);
  },

  // 特定のSOAP記録を取得
  async getRecord(id: string) {
    const records = readCollection<LocalSoapRecord>(DB_KEYS.SOAP_RECORDS);
    return { record: records.find((r) => r.id === id) ?? null };
  },

  // SOAP記録を作成
  async createRecord(data: {
    date: string;
    patientId?: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }) {
    const records = readCollection<LocalSoapRecord>(DB_KEYS.SOAP_RECORDS);
    const now = new Date().toISOString();
    const record: LocalSoapRecord = {
      id: generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    records.push(record);
    writeCollection(DB_KEYS.SOAP_RECORDS, records);
    return { record };
  },

  // SOAP記録を更新
  async updateRecord(
    id: string,
    data: {
      date?: string;
      patientId?: string;
      subjective?: string;
      objective?: string;
      assessment?: string;
      plan?: string;
    }
  ) {
    const records = readCollection<LocalSoapRecord>(DB_KEYS.SOAP_RECORDS);
    const record = records.find((r) => r.id === id);
    if (record) {
      Object.assign(record, data, { updatedAt: new Date().toISOString() });
      writeCollection(DB_KEYS.SOAP_RECORDS, records);
    }
    return { record };
  },

  // SOAP記録を削除
  async deleteRecord(id: string) {
    const records = readCollection<LocalSoapRecord>(DB_KEYS.SOAP_RECORDS);
    writeCollection(
      DB_KEYS.SOAP_RECORDS,
      records.filter((r) => r.id !== id)
    );
  },
};

function getSoapRecordsData(date?: string, limit?: number) {
  let records = readCollection<LocalSoapRecord>(DB_KEYS.SOAP_RECORDS);
  if (date) {
    records = records.filter((r) => r.date === date);
  }
  records = records
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit ?? 100);
  return { records };
}

// ========== Facility API ==========

type FacilityWithNotes = LocalFacility & { notes: LocalFacilityNote[] };

function attachNotes(facility: LocalFacility): FacilityWithNotes {
  const notes = readCollection<LocalFacilityNote>(DB_KEYS.FACILITY_NOTES)
    .filter((n) => n.facilityId === facility.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { ...facility, notes };
}

export const facilityApi = {
  // 施設一覧を取得
  async getFacilities() {
    return getFacilitiesData();
  },

  // 特定の施設を取得
  async getFacility(id: string) {
    const facilities = readCollection<LocalFacility>(DB_KEYS.FACILITIES);
    const facility = facilities.find((f) => f.id === id);
    return { facility: facility ? attachNotes(facility) : null };
  },

  // 施設を作成
  async createFacility(data: { name: string; address?: string }) {
    const facilities = readCollection<LocalFacility>(DB_KEYS.FACILITIES);
    const facility: LocalFacility = {
      id: generateId(),
      name: data.name,
      address: data.address,
      createdAt: new Date().toISOString(),
    };
    facilities.push(facility);
    writeCollection(DB_KEYS.FACILITIES, facilities);
    return { facility: attachNotes(facility) };
  },

  // 施設を更新
  async updateFacility(id: string, data: { name?: string; address?: string }) {
    const facilities = readCollection<LocalFacility>(DB_KEYS.FACILITIES);
    const facility = facilities.find((f) => f.id === id);
    if (facility) {
      Object.assign(facility, data);
      writeCollection(DB_KEYS.FACILITIES, facilities);
    }
    return { facility: facility ? attachNotes(facility) : null };
  },

  // 施設を削除（紐づくノートも削除）
  async deleteFacility(id: string) {
    const facilities = readCollection<LocalFacility>(DB_KEYS.FACILITIES);
    writeCollection(
      DB_KEYS.FACILITIES,
      facilities.filter((f) => f.id !== id)
    );
    const notes = readCollection<LocalFacilityNote>(DB_KEYS.FACILITY_NOTES);
    writeCollection(
      DB_KEYS.FACILITY_NOTES,
      notes.filter((n) => n.facilityId !== id)
    );
  },

  // ノートを追加
  async addNote(data: { facilityId: string; category: string; content: string }) {
    const notes = readCollection<LocalFacilityNote>(DB_KEYS.FACILITY_NOTES);
    const note: LocalFacilityNote = {
      id: generateId(),
      facilityId: data.facilityId,
      category: data.category,
      content: data.content,
      createdAt: new Date().toISOString(),
    };
    notes.push(note);
    writeCollection(DB_KEYS.FACILITY_NOTES, notes);
    return { note };
  },

  // ノートを更新
  async updateNote(id: string, data: { category?: string; content?: string }) {
    const notes = readCollection<LocalFacilityNote>(DB_KEYS.FACILITY_NOTES);
    const note = notes.find((n) => n.id === id);
    if (note) {
      Object.assign(note, data);
      writeCollection(DB_KEYS.FACILITY_NOTES, notes);
    }
    return { note };
  },

  // ノートを削除
  async deleteNote(id: string) {
    const notes = readCollection<LocalFacilityNote>(DB_KEYS.FACILITY_NOTES);
    writeCollection(
      DB_KEYS.FACILITY_NOTES,
      notes.filter((n) => n.id !== id)
    );
  },
};

function getFacilitiesData() {
  const facilities = readCollection<LocalFacility>(DB_KEYS.FACILITIES)
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(attachNotes);
  return { facilities };
}

// ========== Settings API ==========

export const settingsApi = {
  // 設定を取得
  async getSettings() {
    return { settings: readSettings() };
  },

  // 設定を更新
  async updateSettings(data: {
    name?: string;
    examDate?: string | null;
    examYear?: number | null;
    voiceEnabled?: boolean;
    voiceRate?: number;
    voiceAutoPlay?: boolean;
  }) {
    const current = readSettings();
    const settings: LocalSettings = { ...DEFAULT_SETTINGS, ...current };
    if (data.name !== undefined) settings.name = data.name;
    if (data.examDate !== undefined) settings.examDate = data.examDate;
    if (data.examYear !== undefined) settings.examYear = data.examYear;
    if (data.voiceEnabled !== undefined) settings.voiceEnabled = data.voiceEnabled;
    if (data.voiceRate !== undefined) settings.voiceRate = data.voiceRate;
    if (data.voiceAutoPlay !== undefined) settings.voiceAutoPlay = data.voiceAutoPlay;
    writeObject(DB_KEYS.SETTINGS, settings);
    return { settings };
  },
};

// ========== Stats API ==========

export const statsApi = {
  // 統計を取得
  async getStats() {
    return getStatsData();
  },
};

function getStatsData() {
  const answers = readCollection<LocalQuizAnswer>(DB_KEYS.QUIZ_ANSWERS);
  const weakQuestions = readCollection<LocalWeakQuestion>(DB_KEYS.WEAK_QUESTIONS);

  const totalAnswers = answers.length;
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const correctRate =
    totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  // カテゴリ別統計
  const categoryMap = new Map<string, { total: number; correct: number }>();
  for (const a of answers) {
    const category = a.category || "unknown";
    const entry = categoryMap.get(category) ?? { total: 0, correct: 0 };
    entry.total += 1;
    if (a.isCorrect) entry.correct += 1;
    categoryMap.set(category, entry);
  }
  const categoryStats = [...categoryMap.entries()].map(([category, c]) => ({
    category,
    total: c.total,
    correct: c.correct,
    rate: c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0,
  }));

  // ストリーク計算（連続学習日数）
  const today = localDateStr();
  const activeDays = new Set(answers.map((a) => localDateStr(new Date(a.answeredAt))));

  let streak = 0;
  const checkDate = new Date();
  for (;;) {
    const dateStr = localDateStr(checkDate);
    if (activeDays.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (dateStr === today) {
      // 今日まだ学習していない場合は昨日から数える
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // 今日の学習状況
  const todayAnswers = answers.filter(
    (a) => localDateStr(new Date(a.answeredAt)) === today
  );

  const stats = {
    totalAnswers,
    correctAnswers,
    correctRate,
    weakQuestionsCount: weakQuestions.length,
    streak,
    todayAnswers: todayAnswers.length,
    todayCorrect: todayAnswers.filter((a) => a.isCorrect).length,
    categoryStats,
  };

  return { stats };
}

// ========== Learning API ==========

export const learningApi = {
  // 学習進捗を取得
  async getProgress() {
    return { skillIds: readCollection<string>(DB_KEYS.LEARNING_PROGRESS) };
  },

  // 学習完了をトグル
  async toggleComplete(skillId: string) {
    const skillIds = readCollection<string>(DB_KEYS.LEARNING_PROGRESS);
    if (skillIds.includes(skillId)) {
      writeCollection(
        DB_KEYS.LEARNING_PROGRESS,
        skillIds.filter((id) => id !== skillId)
      );
      return { completed: false, skillId };
    }
    skillIds.push(skillId);
    writeCollection(DB_KEYS.LEARNING_PROGRESS, skillIds);
    return { completed: true, skillId };
  },
};

// ========== Review Schedule API (Spaced Repetition) ==========

export const reviewScheduleApi = {
  // 復習スケジュール一覧を取得
  async getSchedules(dueOnly: boolean = false) {
    return getSchedulesData(dueOnly);
  },

  // 復習結果を記録（スケジュール更新）
  async recordReview(questionId: string, quality: "correct" | "incorrect") {
    const schedules = readCollection<LocalReviewSchedule>(DB_KEYS.REVIEW_SCHEDULES);
    const existing = schedules.find((s) => s.questionId === questionId);

    const currentState = existing
      ? {
          interval: existing.interval,
          easeFactor: existing.easeFactor,
          reviewCount: existing.reviewCount,
          nextReviewDate: new Date(existing.nextReviewDate),
        }
      : null;

    const nextState = calculateNextReview(currentState, quality as AnswerQuality);
    const now = new Date().toISOString();

    if (existing) {
      existing.interval = nextState.interval;
      existing.easeFactor = nextState.easeFactor;
      existing.reviewCount = nextState.reviewCount;
      existing.nextReviewDate = nextState.nextReviewDate.toISOString();
      existing.lastReviewedAt = now;
      writeCollection(DB_KEYS.REVIEW_SCHEDULES, schedules);
      return { schedule: existing };
    }

    const schedule: LocalReviewSchedule = {
      id: generateId(),
      questionId,
      interval: nextState.interval,
      easeFactor: nextState.easeFactor,
      reviewCount: nextState.reviewCount,
      nextReviewDate: nextState.nextReviewDate.toISOString(),
      lastReviewedAt: now,
    };
    schedules.push(schedule);
    writeCollection(DB_KEYS.REVIEW_SCHEDULES, schedules);
    return { schedule };
  },

  // 復習スケジュールを削除
  async deleteSchedule(questionId: string) {
    const schedules = readCollection<LocalReviewSchedule>(DB_KEYS.REVIEW_SCHEDULES);
    writeCollection(
      DB_KEYS.REVIEW_SCHEDULES,
      schedules.filter((s) => s.questionId !== questionId)
    );
  },
};

function getSchedulesData(dueOnly: boolean) {
  let schedules = readCollection<LocalReviewSchedule>(DB_KEYS.REVIEW_SCHEDULES);
  if (dueOnly) {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    schedules = schedules.filter((s) => new Date(s.nextReviewDate) <= endOfToday);
  }
  schedules = schedules
    .slice()
    .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
  return { schedules };
}

// ========== SWR用のfetcher ==========
// SWRキー（"/api/xxx?query" 形式）をパースしてローカルデータを返す

// SWRのdata型を従来のfetch実装（res.json()）と同じanyに揃える
// eslint-disable-next-line
const fetcher = async (url: string): Promise<any> => {
  const [path, queryString] = url.split("?");
  const params = new URLSearchParams(queryString ?? "");

  switch (path) {
    case "/api/quiz/weak":
      return getWeakQuestionsData();

    case "/api/reflection": {
      const date = params.get("date");
      if (date) {
        return reflectionApi.getReflection(date);
      }
      const limit = params.get("limit");
      return getReflectionsData(limit ? parseInt(limit, 10) : undefined);
    }

    case "/api/soap": {
      const id = params.get("id");
      if (id) {
        return soapApi.getRecord(id);
      }
      const date = params.get("date") ?? undefined;
      const limit = params.get("limit");
      return getSoapRecordsData(date, limit ? parseInt(limit, 10) : undefined);
    }

    case "/api/facility": {
      const id = params.get("id");
      if (id) {
        return facilityApi.getFacility(id);
      }
      return getFacilitiesData();
    }

    case "/api/settings":
      return { settings: readSettings() };

    case "/api/stats":
      return getStatsData();

    case "/api/learning":
      return { skillIds: readCollection<string>(DB_KEYS.LEARNING_PROGRESS) };

    case "/api/review/schedule":
      return getSchedulesData(params.get("due") === "true");

    default:
      throw new Error(`不明なデータキーです: ${url}`);
  }
};

export { fetcher };

// SWR key定数
export const SWR_KEYS = {
  WEAK_QUESTIONS: "/api/quiz/weak",
  REFLECTIONS: "/api/reflection",
  SOAP_RECORDS: "/api/soap",
  FACILITIES: "/api/facility",
  SETTINGS: "/api/settings",
  STATS: "/api/stats",
  LEARNING: "/api/learning",
  REVIEW_SCHEDULE: "/api/review/schedule",
  REVIEW_SCHEDULE_DUE: "/api/review/schedule?due=true",
};
