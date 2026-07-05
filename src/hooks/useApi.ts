"use client";

import useSWR, { mutate } from "swr";
import {
  fetcher,
  SWR_KEYS,
  weakApi,
  quizApi,
  reflectionApi,
  soapApi,
  facilityApi,
  settingsApi,
  learningApi,
  reviewScheduleApi,
} from "@/lib/api";
import { TOTAL_SKILLS } from "@/data/freshman-skills";
import type { AnswerQuality } from "@/lib/spaced-repetition";

// ========== 苦手問題 hooks ==========

export function useWeakQuestions() {
  const { data, error, isLoading } = useSWR(SWR_KEYS.WEAK_QUESTIONS, fetcher);

  const addWeakQuestion = async (questionId: string) => {
    await weakApi.addWeakQuestion(questionId);
    mutate(SWR_KEYS.WEAK_QUESTIONS);
  };

  const removeWeakQuestion = async (questionId: string) => {
    await weakApi.removeWeakQuestion(questionId);
    mutate(SWR_KEYS.WEAK_QUESTIONS);
  };

  const reviewWeakQuestion = async (questionId: string) => {
    await weakApi.reviewWeakQuestion(questionId);
    mutate(SWR_KEYS.WEAK_QUESTIONS);
  };

  return {
    weakQuestions: data?.weakQuestions || [],
    isLoading,
    error,
    addWeakQuestion,
    removeWeakQuestion,
    reviewWeakQuestion,
  };
}

// ========== ふりかえり hooks ==========

export function useReflections(limit?: number) {
  const key = limit
    ? `${SWR_KEYS.REFLECTIONS}?limit=${limit}`
    : SWR_KEYS.REFLECTIONS;
  const { data, error, isLoading } = useSWR(key, fetcher);

  const saveReflection = async (
    date: string,
    mood: string,
    note?: string
  ) => {
    await reflectionApi.saveReflection({ date, mood, note });
    mutate(key);
    mutate(SWR_KEYS.REFLECTIONS);
  };

  return {
    reflections: data?.reflections || [],
    isLoading,
    error,
    saveReflection,
  };
}

export function useReflection(date: string) {
  const key = `${SWR_KEYS.REFLECTIONS}?date=${date}`;
  const { data, error, isLoading } = useSWR(key, fetcher);

  const saveReflection = async (mood: string, note?: string) => {
    await reflectionApi.saveReflection({ date, mood, note });
    mutate(key);
    mutate(SWR_KEYS.REFLECTIONS);
  };

  return {
    reflection: data?.reflection,
    isLoading,
    error,
    saveReflection,
  };
}

// ========== SOAP記録 hooks ==========

export function useSoapRecords(date?: string, limit?: number) {
  const params = new URLSearchParams();
  if (date) params.set("date", date);
  if (limit) params.set("limit", limit.toString());
  const key = params.toString()
    ? `${SWR_KEYS.SOAP_RECORDS}?${params.toString()}`
    : SWR_KEYS.SOAP_RECORDS;

  const { data, error, isLoading } = useSWR(key, fetcher);

  const createRecord = async (record: {
    date: string;
    patientId?: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }) => {
    await soapApi.createRecord(record);
    mutate(key);
    mutate(SWR_KEYS.SOAP_RECORDS);
  };

  const updateRecord = async (
    id: string,
    record: {
      date?: string;
      patientId?: string;
      subjective?: string;
      objective?: string;
      assessment?: string;
      plan?: string;
    }
  ) => {
    await soapApi.updateRecord(id, record);
    mutate(key);
    mutate(SWR_KEYS.SOAP_RECORDS);
  };

  const deleteRecord = async (id: string) => {
    await soapApi.deleteRecord(id);
    mutate(key);
    mutate(SWR_KEYS.SOAP_RECORDS);
  };

  return {
    records: data?.records || [],
    isLoading,
    error,
    createRecord,
    updateRecord,
    deleteRecord,
  };
}

// ========== 施設 hooks ==========

export function useFacilities() {
  const { data, error, isLoading } = useSWR(SWR_KEYS.FACILITIES, fetcher);

  const createFacility = async (name: string, address?: string) => {
    await facilityApi.createFacility({ name, address });
    mutate(SWR_KEYS.FACILITIES);
  };

  const updateFacility = async (
    id: string,
    data: { name?: string; address?: string }
  ) => {
    await facilityApi.updateFacility(id, data);
    mutate(SWR_KEYS.FACILITIES);
  };

  const deleteFacility = async (id: string) => {
    await facilityApi.deleteFacility(id);
    mutate(SWR_KEYS.FACILITIES);
  };

  const addNote = async (
    facilityId: string,
    category: string,
    content: string
  ) => {
    await facilityApi.addNote({ facilityId, category, content });
    mutate(SWR_KEYS.FACILITIES);
  };

  const updateNote = async (
    id: string,
    data: { category?: string; content?: string }
  ) => {
    await facilityApi.updateNote(id, data);
    mutate(SWR_KEYS.FACILITIES);
  };

  const deleteNote = async (id: string) => {
    await facilityApi.deleteNote(id);
    mutate(SWR_KEYS.FACILITIES);
  };

  return {
    facilities: data?.facilities || [],
    isLoading,
    error,
    createFacility,
    updateFacility,
    deleteFacility,
    addNote,
    updateNote,
    deleteNote,
  };
}

// ========== 設定 hooks ==========

export function useSettings() {
  const { data, error, isLoading } = useSWR(SWR_KEYS.SETTINGS, fetcher);

  const updateSettings = async (settings: {
    name?: string;
    examDate?: string | null;
    examYear?: number | null;
    voiceEnabled?: boolean;
    voiceRate?: number;
    voiceAutoPlay?: boolean;
  }) => {
    await settingsApi.updateSettings(settings);
    mutate(SWR_KEYS.SETTINGS);
  };

  return {
    settings: data?.settings,
    isLoading,
    error,
    updateSettings,
  };
}

// ========== 統計 hooks ==========

export function useStats() {
  const { data, error, isLoading } = useSWR(SWR_KEYS.STATS, fetcher);

  return {
    stats: data?.stats,
    isLoading,
    error,
    refresh: () => mutate(SWR_KEYS.STATS),
  };
}

// ========== クイズ回答記録 ==========

export function useQuizAnswer() {
  const recordAnswer = async (data: {
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
    category?: string;
  }) => {
    await quizApi.recordAnswer(data);
    // 苦手問題と統計を更新
    mutate(SWR_KEYS.WEAK_QUESTIONS);
    mutate(SWR_KEYS.STATS);
  };

  return { recordAnswer };
}

// ========== 学習進捗 hooks ==========

export function useLearningProgress() {
  const { data, error, isLoading } = useSWR(SWR_KEYS.LEARNING, fetcher);

  const skillIds: string[] = data?.skillIds || [];

  const toggleComplete = async (skillId: string) => {
    await learningApi.toggleComplete(skillId);
    mutate(SWR_KEYS.LEARNING);
  };

  const isComplete = (skillId: string) => {
    return skillIds.includes(skillId);
  };

  const getStats = () => ({
    completed: skillIds.length,
    total: TOTAL_SKILLS,
  });

  return {
    skillIds,
    isLoading,
    error,
    toggleComplete,
    isComplete,
    getStats,
  };
}

// ========== 復習スケジュール hooks (Spaced Repetition) ==========

interface ReviewSchedule {
  id: string;
  questionId: string;
  nextReviewDate: string;
  interval: number;
  easeFactor: number;
  reviewCount: number;
  lastReviewedAt: string;
}

export function useReviewSchedule(dueOnly: boolean = false) {
  const key = dueOnly ? SWR_KEYS.REVIEW_SCHEDULE_DUE : SWR_KEYS.REVIEW_SCHEDULE;
  const { data, error, isLoading } = useSWR(key, fetcher);

  const schedules: ReviewSchedule[] = data?.schedules || [];

  // 今日復習が必要な問題数
  const dueCount = schedules.filter((s) => {
    const reviewDate = new Date(s.nextReviewDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return reviewDate <= today;
  }).length;

  // 復習結果を記録
  const recordReview = async (questionId: string, quality: AnswerQuality) => {
    await reviewScheduleApi.recordReview(questionId, quality);
    mutate(SWR_KEYS.REVIEW_SCHEDULE);
    mutate(SWR_KEYS.REVIEW_SCHEDULE_DUE);
  };

  // スケジュールを削除
  const deleteSchedule = async (questionId: string) => {
    await reviewScheduleApi.deleteSchedule(questionId);
    mutate(SWR_KEYS.REVIEW_SCHEDULE);
    mutate(SWR_KEYS.REVIEW_SCHEDULE_DUE);
  };

  // 問題のスケジュールを取得
  const getSchedule = (questionId: string): ReviewSchedule | undefined => {
    return schedules.find((s) => s.questionId === questionId);
  };

  return {
    schedules,
    dueCount,
    isLoading,
    error,
    recordReview,
    deleteSchedule,
    getSchedule,
  };
}
