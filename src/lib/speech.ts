/**
 * Web Speech API ラッパー
 * ブラウザの音声合成機能を使って問題を読み上げる
 */

interface SpeechOptions {
  rate?: number; // 読み上げ速度 (0.5 - 2.0)
  pitch?: number; // 音の高さ (0 - 2)
  volume?: number; // 音量 (0 - 1)
  lang?: string; // 言語コード
}

class SpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSupported: boolean = false;
  private japaneseVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synthesis = window.speechSynthesis;
      this.isSupported = true;
      this.loadVoices();
    }
  }

  /**
   * 利用可能な音声を読み込む
   */
  private loadVoices(): void {
    if (!this.synthesis) return;

    const setJapaneseVoice = () => {
      const voices = this.synthesis!.getVoices();
      // 日本語音声を優先的に選択
      this.japaneseVoice =
        voices.find((v) => v.lang === "ja-JP") ||
        voices.find((v) => v.lang.startsWith("ja")) ||
        voices[0] ||
        null;
    };

    // 音声リストが非同期で読み込まれる場合に対応
    if (this.synthesis.getVoices().length > 0) {
      setJapaneseVoice();
    } else {
      this.synthesis.addEventListener("voiceschanged", setJapaneseVoice, {
        once: true,
      });
    }
  }

  /**
   * 音声合成がサポートされているかチェック
   */
  isAvailable(): boolean {
    return this.isSupported;
  }

  /**
   * テキストを読み上げる
   */
  speak(text: string, options: SpeechOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error("Speech synthesis not supported"));
        return;
      }

      // 既存の読み上げを停止
      this.stop();

      // 少し遅延を入れてから読み上げ開始（最初が切れる問題を回避）
      setTimeout(() => {
        if (!this.synthesis) {
          resolve();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        this.utterance = utterance;

        // オプション設定
        utterance.rate = options.rate ?? 1.0;
        utterance.pitch = options.pitch ?? 1.0;
        utterance.volume = options.volume ?? 1.0;
        utterance.lang = options.lang ?? "ja-JP";

        // 日本語音声を設定
        if (this.japaneseVoice) {
          utterance.voice = this.japaneseVoice;
        }

        // イベントハンドラ
        utterance.onend = () => {
          this.utterance = null;
          resolve();
        };

        utterance.onerror = (event) => {
          this.utterance = null;
          // ユーザーによる中断は正常終了とする
          if (event.error === "interrupted" || event.error === "canceled") {
            resolve();
          } else {
            reject(new Error(`Speech error: ${event.error}`));
          }
        };

        this.synthesis.speak(utterance);
      }, 100);
    });
  }

  /**
   * 問題と選択肢を順番に読み上げる
   */
  async speakQuestion(
    questionText: string,
    options: string[],
    speechOptions: SpeechOptions = {}
  ): Promise<void> {
    // 問題文を読み上げ
    await this.speak(questionText, speechOptions);

    // 少し間を置く
    await this.pause(500);

    // 選択肢を読み上げ
    for (let i = 0; i < options.length; i++) {
      const label = String.fromCharCode(65 + i); // A, B, C, D
      await this.speak(`${label}。${options[i]}`, speechOptions);
      await this.pause(300);
    }
  }

  /**
   * 解説を読み上げる
   */
  async speakExplanation(
    correctAnswer: string,
    explanation: string,
    speechOptions: SpeechOptions = {}
  ): Promise<void> {
    await this.speak(`正解は${correctAnswer}です。`, speechOptions);
    await this.pause(500);
    await this.speak(explanation, speechOptions);
  }

  /**
   * 読み上げを一時停止
   */
  pause(ms: number = 0): Promise<void> {
    return new Promise((resolve) => {
      if (ms > 0) {
        setTimeout(resolve, ms);
      } else {
        if (this.synthesis) {
          this.synthesis.pause();
        }
        resolve();
      }
    });
  }

  /**
   * 一時停止から再開
   */
  resume(): void {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  /**
   * 読み上げを停止
   */
  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    this.utterance = null;
  }

  /**
   * 現在読み上げ中かどうか
   */
  isSpeaking(): boolean {
    return this.synthesis?.speaking ?? false;
  }

  /**
   * 一時停止中かどうか
   */
  isPaused(): boolean {
    return this.synthesis?.paused ?? false;
  }

  /**
   * 利用可能な音声リストを取得
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis?.getVoices() ?? [];
  }

  /**
   * 日本語音声のリストを取得
   */
  getJapaneseVoices(): SpeechSynthesisVoice[] {
    return this.getVoices().filter(
      (v) => v.lang === "ja-JP" || v.lang.startsWith("ja")
    );
  }
}

// シングルトンインスタンス
export const speechService = new SpeechService();

// カスタムフック
export function useSpeech() {
  return {
    isAvailable: speechService.isAvailable(),
    speak: speechService.speak.bind(speechService),
    speakQuestion: speechService.speakQuestion.bind(speechService),
    speakExplanation: speechService.speakExplanation.bind(speechService),
    stop: speechService.stop.bind(speechService),
    pause: speechService.pause.bind(speechService),
    resume: speechService.resume.bind(speechService),
    isSpeaking: speechService.isSpeaking.bind(speechService),
    isPaused: speechService.isPaused.bind(speechService),
  };
}
