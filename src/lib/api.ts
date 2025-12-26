// API Client Helper with SWR hooks

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "APIエラーが発生しました");
  }
  return res.json();
};

// 汎用的なAPI呼び出しヘルパー
export async function apiPost<T>(url: string, data: object): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "APIエラーが発生しました");
  }
  return res.json();
}

export async function apiPut<T>(url: string, data: object): Promise<T> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "APIエラーが発生しました");
  }
  return res.json();
}

export async function apiPatch<T>(url: string, data: object): Promise<T> {
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "APIエラーが発生しました");
  }
  return res.json();
}

export async function apiDelete(url: string): Promise<void> {
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "APIエラーが発生しました");
  }
}

// ========== Quiz API ==========

export const quizApi = {
  // 回答を記録
  async recordAnswer(data: {
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
    category?: string;
  }) {
    return apiPost("/api/quiz/answer", data);
  },

  // 回答履歴を取得
  async getAnswers(questionId?: string, limit?: number) {
    let url = "/api/quiz/answer";
    const params = new URLSearchParams();
    if (questionId) params.set("questionId", questionId);
    if (limit) params.set("limit", limit.toString());
    if (params.toString()) url += `?${params.toString()}`;
    return fetch(url).then((r) => r.json());
  },
};

// ========== Weak Questions API ==========

export const weakApi = {
  // 苦手問題一覧を取得
  async getWeakQuestions() {
    return fetch("/api/quiz/weak").then((r) => r.json());
  },

  // 苦手問題を追加
  async addWeakQuestion(questionId: string) {
    return apiPost("/api/quiz/weak", { questionId });
  },

  // 苦手問題を削除
  async removeWeakQuestion(questionId: string) {
    return apiDelete(`/api/quiz/weak?questionId=${questionId}`);
  },

  // 復習回数を更新
  async reviewWeakQuestion(questionId: string) {
    return apiPatch("/api/quiz/weak", { questionId });
  },
};

// ========== Reflection API ==========

export const reflectionApi = {
  // ふりかえり一覧を取得
  async getReflections(limit?: number) {
    let url = "/api/reflection";
    if (limit) url += `?limit=${limit}`;
    return fetch(url).then((r) => r.json());
  },

  // 特定日のふりかえりを取得
  async getReflection(date: string) {
    return fetch(`/api/reflection?date=${date}`).then((r) => r.json());
  },

  // ふりかえりを保存
  async saveReflection(data: { date: string; mood: string; note?: string }) {
    return apiPost("/api/reflection", data);
  },
};

// ========== SOAP API ==========

export const soapApi = {
  // SOAP記録一覧を取得
  async getRecords(date?: string, limit?: number) {
    let url = "/api/soap";
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (limit) params.set("limit", limit.toString());
    if (params.toString()) url += `?${params.toString()}`;
    return fetch(url).then((r) => r.json());
  },

  // 特定のSOAP記録を取得
  async getRecord(id: string) {
    return fetch(`/api/soap?id=${id}`).then((r) => r.json());
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
    return apiPost("/api/soap", data);
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
    return apiPut("/api/soap", { id, ...data });
  },

  // SOAP記録を削除
  async deleteRecord(id: string) {
    return apiDelete(`/api/soap?id=${id}`);
  },
};

// ========== Facility API ==========

export const facilityApi = {
  // 施設一覧を取得
  async getFacilities() {
    return fetch("/api/facility").then((r) => r.json());
  },

  // 特定の施設を取得
  async getFacility(id: string) {
    return fetch(`/api/facility?id=${id}`).then((r) => r.json());
  },

  // 施設を作成
  async createFacility(data: { name: string; address?: string }) {
    return apiPost("/api/facility", data);
  },

  // 施設を更新
  async updateFacility(id: string, data: { name?: string; address?: string }) {
    return apiPut("/api/facility", { id, ...data });
  },

  // 施設を削除
  async deleteFacility(id: string) {
    return apiDelete(`/api/facility?id=${id}`);
  },

  // ノートを追加
  async addNote(data: {
    facilityId: string;
    category: string;
    content: string;
  }) {
    return apiPost("/api/facility/note", data);
  },

  // ノートを更新
  async updateNote(
    id: string,
    data: { category?: string; content?: string }
  ) {
    return apiPut("/api/facility/note", { id, ...data });
  },

  // ノートを削除
  async deleteNote(id: string) {
    return apiDelete(`/api/facility/note?id=${id}`);
  },
};

// ========== Settings API ==========

export const settingsApi = {
  // 設定を取得
  async getSettings() {
    return fetch("/api/settings").then((r) => r.json());
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
    return apiPut("/api/settings", data);
  },
};

// ========== Stats API ==========

export const statsApi = {
  // 統計を取得
  async getStats() {
    return fetch("/api/stats").then((r) => r.json());
  },
};

// SWR用のfetcher
export { fetcher };

// SWR key定数
export const SWR_KEYS = {
  WEAK_QUESTIONS: "/api/quiz/weak",
  REFLECTIONS: "/api/reflection",
  SOAP_RECORDS: "/api/soap",
  FACILITIES: "/api/facility",
  SETTINGS: "/api/settings",
  STATS: "/api/stats",
};
