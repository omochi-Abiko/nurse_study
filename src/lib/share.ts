/**
 * Web Share API ラッパー
 * SNSへの学習成果シェア機能
 */

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

class ShareService {
  private isSupported: boolean = false;

  constructor() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      this.isSupported = true;
    }
  }

  /**
   * Web Share APIがサポートされているかチェック
   */
  isAvailable(): boolean {
    return this.isSupported;
  }

  /**
   * コンテンツを共有する
   */
  async share(data: ShareData): Promise<boolean> {
    if (!this.isSupported) {
      // フォールバック: クリップボードにコピー
      return this.copyToClipboard(data.text || data.title || "");
    }

    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      // ユーザーがキャンセルした場合も含む
      if ((error as Error).name !== "AbortError") {
        console.error("Share failed:", error);
      }
      return false;
    }
  }

  /**
   * クリップボードにコピー（フォールバック）
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 今日の学習成果を共有
   */
  async shareDailyResult(
    correctCount: number,
    totalCount: number
  ): Promise<boolean> {
    const emoji = correctCount === totalCount ? "🎉" : correctCount >= 2 ? "💪" : "📚";
    const message = `${emoji} 今日も看護師国試の勉強やりました！\n\n正解: ${correctCount}/${totalCount}問\n\n#NurseStudy #看護師国試 #勉強垢`;

    return this.share({
      title: "NurseStudy",
      text: message,
    });
  }

  /**
   * 週間サマリーを共有
   */
  async shareWeeklySummary(
    accuracy: number,
    streakDays: number
  ): Promise<boolean> {
    const streakEmoji = streakDays >= 7 ? "🔥" : streakDays >= 3 ? "⭐" : "✨";
    const message = `${streakEmoji} 今週の看護師国試勉強まとめ！\n\n📊 正答率: ${accuracy}%\n🎯 連続学習: ${streakDays}日\n\nコツコツ頑張ってます！\n\n#NurseStudy #看護師国試 #勉強垢`;

    return this.share({
      title: "NurseStudy 週間レポート",
      text: message,
    });
  }

  /**
   * 連続学習日数を共有
   */
  async shareStreak(days: number): Promise<boolean> {
    let emoji = "📚";
    let celebration = "";

    if (days >= 30) {
      emoji = "🏆";
      celebration = "1ヶ月継続！";
    } else if (days >= 14) {
      emoji = "🎊";
      celebration = "2週間継続！";
    } else if (days >= 7) {
      emoji = "🎉";
      celebration = "1週間継続！";
    } else if (days >= 3) {
      emoji = "💪";
      celebration = "3日継続！";
    }

    const message = `${emoji} ${celebration ? celebration + "\n\n" : ""}看護師国試の勉強を${days}日連続でやっています！\n\n#NurseStudy #看護師国試 #勉強垢`;

    return this.share({
      title: "NurseStudy",
      text: message,
    });
  }
}

// シングルトンインスタンス
export const shareService = new ShareService();

// カスタムフック
export function useShare() {
  return {
    isAvailable: shareService.isAvailable(),
    share: shareService.share.bind(shareService),
    shareDailyResult: shareService.shareDailyResult.bind(shareService),
    shareWeeklySummary: shareService.shareWeeklySummary.bind(shareService),
    shareStreak: shareService.shareStreak.bind(shareService),
    copyToClipboard: shareService.copyToClipboard.bind(shareService),
  };
}
