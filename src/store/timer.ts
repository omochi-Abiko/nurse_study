import { create } from "zustand";
import { persist } from "zustand/middleware";

// タイマーのモード
export type TimerMode = "work" | "shortBreak" | "longBreak" | "idle";

// デフォルトの時間設定（秒）
export const TIMER_DEFAULTS = {
  work: 25 * 60,           // 25分
  shortBreak: 5 * 60,      // 5分
  longBreak: 15 * 60,      // 15分
  pomodorosUntilLong: 4,   // 長休憩までのポモドーロ数
};

interface TimerState {
  // 状態
  mode: TimerMode;
  timeLeft: number;        // 残り秒数
  isRunning: boolean;
  pomodoroCount: number;   // 完了したポモドーロ数
  todayCount: number;      // 今日のポモドーロ数
  lastDate: string;        // 最後に使用した日付

  // 設定
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;

  // アクション
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  setMode: (mode: TimerMode) => void;
  skipToNext: () => void;

  // 設定変更
  setWorkDuration: (seconds: number) => void;
  setShortBreakDuration: (seconds: number) => void;
  setLongBreakDuration: (seconds: number) => void;
}

// 今日の日付を取得
const getToday = () => new Date().toISOString().split("T")[0];

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      // 初期状態
      mode: "idle",
      timeLeft: TIMER_DEFAULTS.work,
      isRunning: false,
      pomodoroCount: 0,
      todayCount: 0,
      lastDate: getToday(),

      // 設定
      workDuration: TIMER_DEFAULTS.work,
      shortBreakDuration: TIMER_DEFAULTS.shortBreak,
      longBreakDuration: TIMER_DEFAULTS.longBreak,

      // タイマー開始
      startTimer: () => {
        const state = get();
        const today = getToday();

        // 日付が変わっていたらカウントをリセット
        if (state.lastDate !== today) {
          set({ todayCount: 0, lastDate: today });
        }

        // idle状態から開始する場合はworkモードに
        if (state.mode === "idle") {
          set({
            mode: "work",
            timeLeft: state.workDuration,
            isRunning: true,
          });
        } else {
          set({ isRunning: true });
        }
      },

      // タイマー一時停止
      pauseTimer: () => {
        set({ isRunning: false });
      },

      // タイマーリセット
      resetTimer: () => {
        const state = get();
        let newTime = state.workDuration;

        if (state.mode === "shortBreak") {
          newTime = state.shortBreakDuration;
        } else if (state.mode === "longBreak") {
          newTime = state.longBreakDuration;
        }

        set({ timeLeft: newTime, isRunning: false });
      },

      // 1秒経過
      tick: () => {
        const state = get();
        if (!state.isRunning || state.timeLeft <= 0) return;

        const newTime = state.timeLeft - 1;

        if (newTime <= 0) {
          // タイマー終了
          if (state.mode === "work") {
            // ポモドーロ完了
            const newCount = state.pomodoroCount + 1;
            const newTodayCount = state.todayCount + 1;

            // 長休憩か短休憩かを決定
            const isLongBreak = newCount % TIMER_DEFAULTS.pomodorosUntilLong === 0;
            const nextMode = isLongBreak ? "longBreak" : "shortBreak";
            const nextTime = isLongBreak
              ? state.longBreakDuration
              : state.shortBreakDuration;

            set({
              mode: nextMode,
              timeLeft: nextTime,
              isRunning: false,
              pomodoroCount: newCount,
              todayCount: newTodayCount,
            });

            // 通知音を再生（ブラウザAPI）
            playNotification();
          } else {
            // 休憩終了 → 作業モードへ
            set({
              mode: "work",
              timeLeft: state.workDuration,
              isRunning: false,
            });

            playNotification();
          }
        } else {
          set({ timeLeft: newTime });
        }
      },

      // モード変更
      setMode: (mode: TimerMode) => {
        const state = get();
        let newTime = state.workDuration;

        if (mode === "shortBreak") {
          newTime = state.shortBreakDuration;
        } else if (mode === "longBreak") {
          newTime = state.longBreakDuration;
        } else if (mode === "idle") {
          newTime = state.workDuration;
        }

        set({ mode, timeLeft: newTime, isRunning: false });
      },

      // 次のモードにスキップ
      skipToNext: () => {
        const state = get();

        if (state.mode === "work") {
          const isLongBreak =
            (state.pomodoroCount + 1) % TIMER_DEFAULTS.pomodorosUntilLong === 0;
          const nextMode = isLongBreak ? "longBreak" : "shortBreak";
          const nextTime = isLongBreak
            ? state.longBreakDuration
            : state.shortBreakDuration;

          set({
            mode: nextMode,
            timeLeft: nextTime,
            isRunning: false,
          });
        } else {
          set({
            mode: "work",
            timeLeft: state.workDuration,
            isRunning: false,
          });
        }
      },

      // 設定変更
      setWorkDuration: (seconds: number) => {
        set((state) => ({
          workDuration: seconds,
          timeLeft: state.mode === "work" ? seconds : state.timeLeft,
        }));
      },

      setShortBreakDuration: (seconds: number) => {
        set((state) => ({
          shortBreakDuration: seconds,
          timeLeft: state.mode === "shortBreak" ? seconds : state.timeLeft,
        }));
      },

      setLongBreakDuration: (seconds: number) => {
        set((state) => ({
          longBreakDuration: seconds,
          timeLeft: state.mode === "longBreak" ? seconds : state.timeLeft,
        }));
      },
    }),
    {
      name: "nurse-study-timer",
      partialize: (state) => ({
        pomodoroCount: state.pomodoroCount,
        todayCount: state.todayCount,
        lastDate: state.lastDate,
        workDuration: state.workDuration,
        shortBreakDuration: state.shortBreakDuration,
        longBreakDuration: state.longBreakDuration,
      }),
    }
  )
);

// 通知音を再生
function playNotification() {
  if (typeof window !== "undefined" && "Audio" in window) {
    try {
      // Web Audio APIでビープ音を生成
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      // オーディオ再生に失敗した場合は無視
    }
  }
}

// 時間をフォーマット（mm:ss）
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// モードのラベル
export function getModeLabel(mode: TimerMode): string {
  switch (mode) {
    case "work":
      return "作業中";
    case "shortBreak":
      return "小休憩";
    case "longBreak":
      return "長休憩";
    case "idle":
      return "準備OK";
  }
}

// モードの色
export function getModeColor(mode: TimerMode): string {
  switch (mode) {
    case "work":
      return "primary";
    case "shortBreak":
      return "secondary";
    case "longBreak":
      return "success";
    case "idle":
      return "neutral";
  }
}
