"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { useQuizAnswer, useWeakQuestions } from "@/hooks/useApi";
import { getQuestionById } from "@/data/questions";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { VoiceControl, VoiceSettingsSheet } from "@/components/ui/voice-control";
import { speechService } from "@/lib/speech";
import { cn } from "@/lib/utils";
import { X, Check, BookmarkPlus, Trophy, Settings, Share2 } from "lucide-react";
import { shareService } from "@/lib/share";

type QuizState = "question" | "result" | "complete";

export default function QuizSessionPage() {
  const router = useRouter();
  const session = useAppStore((state) => state.currentQuizSession);
  const answerQuizSession = useAppStore((state) => state.answerQuizSession);
  const completeQuizSession = useAppStore((state) => state.completeQuizSession);
  const clearQuizSession = useAppStore((state) => state.clearQuizSession);
  const customQuestions = useAppStore((state) => state.customQuestions);
  const voiceSettings = useAppStore((state) => state.voiceSettings);

  // API hooks
  const { recordAnswer } = useQuizAnswer();
  const { addWeakQuestion } = useWeakQuestions();

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [quizState, setQuizState] = React.useState<QuizState>("question");
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const hasSpokenRef = React.useRef(false);
  // 回答時の問題を保存（結果表示中に別の問題に切り替わるのを防ぐ）
  const [answeredQuestion, setAnsweredQuestion] = React.useState<Question | null>(null);

  // 問題を取得（通常問題 + カスタム問題）
  const getQuestion = React.useCallback(
    (id: string): Question | undefined => {
      return getQuestionById(id) || customQuestions.find((q) => q.id === id);
    },
    [customQuestions]
  );

  const questions = React.useMemo(() => {
    if (!session) return [];
    return session.questionIds
      .map((id) => getQuestion(id))
      .filter(Boolean) as Question[];
  }, [session, getQuestion]);

  // 結果表示中は回答した問題を使用、それ以外は現在の問題
  const currentQuestion = quizState === "result" && answeredQuestion ? answeredQuestion : questions[currentIndex];
  const totalQuestions = questions.length;

  // 選択肢を問題ごとにランダムに並べ替える（同じ問題の間は固定）
  const shuffledOptions = React.useMemo(() => {
    const q = questions[currentIndex];
    if (!q?.options) return [] as { text: string; originalIndex: number }[];
    const arr = q.options.map((text, i) => ({ text, originalIndex: i }));
    // Fisher-Yatesシャッフル
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [questions, currentIndex]);

  // シャッフル後の並びでの正解の位置
  const correctDisplayIndex = currentQuestion
    ? shuffledOptions.findIndex((o) => o.originalIndex === currentQuestion.correctIndex)
    : -1;

  // セッションがない場合はリダイレクト
  React.useEffect(() => {
    if (!session) {
      router.push("/quiz/select");
    }
  }, [session, router]);

  // 初回マウント時のみ：既に回答済みの問題はスキップ
  const initializedRef = React.useRef(false);
  React.useEffect(() => {
    if (!initializedRef.current && session && session.answers.length > 0) {
      initializedRef.current = true;
      setCurrentIndex(session.answers.length);
    }
  }, [session]);

  // 完了チェック
  React.useEffect(() => {
    if (session?.completed) {
      setQuizState("complete");
    }
  }, [session?.completed]);

  // コンポーネントが準備完了したらフラグを立てる
  React.useEffect(() => {
    if (currentQuestion && !isReady) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, isReady]);

  // 問題を読み上げる関数
  const speakQuestion = React.useCallback(async () => {
    if (!currentQuestion || !voiceSettings.enabled) return;
    try {
      await speechService.speakQuestion(
        currentQuestion.text,
        shuffledOptions.map((o) => o.text),
        { rate: voiceSettings.rate }
      );
    } catch (error) {
      console.error("Speech error:", error);
    }
  }, [currentQuestion, voiceSettings.enabled, voiceSettings.rate, shuffledOptions]);

  // 解説を読み上げる関数
  const speakExplanation = React.useCallback(async () => {
    if (!currentQuestion || !voiceSettings.enabled) return;
    const correctLabel = String.fromCharCode(65 + correctDisplayIndex);
    const correctAnswer = shuffledOptions[correctDisplayIndex]?.text || "";
    try {
      await speechService.speakExplanation(
        `${correctLabel}、${correctAnswer}`,
        currentQuestion.explanation,
        { rate: voiceSettings.rate }
      );
    } catch (error) {
      console.error("Speech error:", error);
    }
  }, [currentQuestion, voiceSettings.enabled, voiceSettings.rate, shuffledOptions, correctDisplayIndex]);

  // 自動再生：問題表示時に読み上げ（準備完了後のみ）
  React.useEffect(() => {
    if (
      isReady &&
      voiceSettings.enabled &&
      voiceSettings.autoPlay &&
      quizState === "question" &&
      currentQuestion &&
      !hasSpokenRef.current
    ) {
      hasSpokenRef.current = true;
      speakQuestion();
    }
    return () => {
      speechService.stop();
    };
  }, [isReady, voiceSettings.enabled, voiceSettings.autoPlay, quizState, currentQuestion, speakQuestion]);

  // 結果表示時に解説を読み上げ
  React.useEffect(() => {
    if (isReady && voiceSettings.enabled && voiceSettings.autoPlay && quizState === "result") {
      speakExplanation();
    }
  }, [isReady, voiceSettings.enabled, voiceSettings.autoPlay, quizState, speakExplanation]);

  // 問題が変わったらスピーチフラグをリセット
  React.useEffect(() => {
    hasSpokenRef.current = false;
  }, [currentIndex]);

  const handleSelectOption = async (displayIndex: number) => {
    if (quizState !== "question" || !currentQuestion) return;

    // シャッフル後の表示位置から元の選択肢インデックスに変換
    const originalIndex = shuffledOptions[displayIndex]?.originalIndex ?? displayIndex;

    // 回答時の問題を保存（結果表示中に変わらないように）
    setAnsweredQuestion(currentQuestion);
    setSelectedIndex(displayIndex);
    const correct = originalIndex === currentQuestion.correctIndex;
    setIsCorrect(correct);

    // ローカルストアに記録（元のインデックスで一貫させる）
    answerQuizSession(currentQuestion.id, originalIndex, correct);

    // APIに記録（カスタム問題以外）
    if (!currentQuestion.id.startsWith("custom-")) {
      recordAnswer({
        questionId: currentQuestion.id,
        selectedIndex: originalIndex,
        isCorrect: correct,
        category: currentQuestion.category,
      });
    }

    setQuizState("result");
  };

  const handleNext = () => {
    if (currentIndex >= questions.length - 1) {
      completeQuizSession();
      setQuizState("complete");
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setAnsweredQuestion(null); // 次の問題用にリセット
      setQuizState("question");
    }
  };

  const handleAddToWeak = async () => {
    if (currentQuestion && !currentQuestion.id.startsWith("custom-")) {
      await addWeakQuestion(currentQuestion.id);
    }
  };

  const handleClose = () => {
    clearQuizSession();
    router.push("/");
  };

  const handleFinish = () => {
    clearQuizSession();
    router.push("/");
  };

  const handleRetry = () => {
    clearQuizSession();
    router.push("/quiz/select");
  };

  // 完了画面
  if (quizState === "complete") {
    const correctCount = session?.answers.filter((a) => a.isCorrect).length ?? 0;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const getMessage = () => {
      if (accuracy === 100) return { text: "パーフェクト！", sub: "全問正解おめでとう！" };
      if (accuracy >= 80) return { text: "素晴らしい！", sub: "この調子で頑張ろう" };
      if (accuracy >= 60) return { text: "いい感じ！", sub: "もう少しで完璧だね" };
      if (accuracy >= 40) return { text: "着実に成長中", sub: "復習して力をつけよう" };
      return { text: "今日やっただけでえらい", sub: "続けることが大事だよ" };
    };

    const message = getMessage();

    const handleShare = async () => {
      await shareService.shareDailyResult(correctCount, totalQuestions);
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
            <Trophy className="h-12 w-12 text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {message.text}
          </h1>
          <p className="text-neutral-600 mb-2">{message.sub}</p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">{accuracy}%</p>
              <p className="text-xs text-neutral-500">正答率</p>
            </div>
            <div className="w-px h-10 bg-neutral-200" />
            <div className="text-center">
              <p className="text-3xl font-bold text-neutral-700">
                {correctCount}/{totalQuestions}
              </p>
              <p className="text-xs text-neutral-500">正解</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-[240px] mx-auto">
            <Button variant="primary" size="lg" onClick={handleFinish}>
              ホームに戻る
            </Button>
            <Button variant="secondary" size="lg" onClick={handleRetry}>
              もう一度挑戦
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleShare}
              className="flex items-center justify-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              シェアする
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
        <button
          onClick={handleClose}
          className="p-2 -ml-2 text-neutral-400 hover:text-neutral-600 transition-colors tap-target"
          aria-label="閉じる"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex-1 mx-4">
          <ProgressBar
            current={currentIndex + (quizState === "result" ? 1 : 0)}
            total={totalQuestions}
          />
          <p className="text-xs text-neutral-500 text-center mt-1">
            {currentIndex + 1} / {totalQuestions}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <VoiceControl
            onSpeak={quizState === "question" ? speakQuestion : speakExplanation}
          />
          <button
            onClick={() => setShowVoiceSettings(true)}
            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="音声設定"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* 問題/結果表示 */}
      <div className="flex-1 flex flex-col px-4 py-6">
        {quizState === "question" ? (
          <>
            {/* カテゴリ表示 */}
            <div className="mb-4">
              <span className="text-xs text-primary-600 font-medium px-2 py-1 bg-primary-50 rounded-full">
                {currentQuestion.category}
              </span>
            </div>

            {/* 問題文 */}
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xl font-medium text-neutral-900 text-center leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>

            {/* 選択肢（ランダムに並べ替え済み） */}
            <div className="space-y-3 mt-auto">
              {shuffledOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all tap-target",
                    "bg-white border-neutral-200 hover:border-primary-300 hover:bg-primary-50",
                    "active:scale-[0.99]"
                  )}
                >
                  <span className="font-medium text-neutral-800">
                    {String.fromCharCode(65 + index)}. {option.text}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* 正誤フィードバック */}
            <div className="flex flex-col items-center pt-8 animate-scale-in">
              <div
                className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center mb-4",
                  isCorrect ? "bg-success-100" : "bg-warning-100"
                )}
              >
                {isCorrect ? (
                  <Check className="h-10 w-10 text-success-600" strokeWidth={3} />
                ) : (
                  <X className="h-10 w-10 text-warning-600" strokeWidth={3} />
                )}
              </div>
              <p
                className={cn(
                  "text-xl font-bold",
                  isCorrect ? "text-success-600" : "text-warning-600"
                )}
              >
                {isCorrect ? "○ 正解！" : "× おしい！"}
              </p>
            </div>

            {/* 解説 */}
            <div className="mt-8 p-4 bg-neutral-50 rounded-xl">
              <p className="text-sm font-medium text-neutral-500 mb-2">解説</p>
              <p className="text-neutral-800 leading-relaxed">
                {currentQuestion.explanation}
              </p>
              {!isCorrect && (
                <p className="text-sm text-primary-600 mt-3">
                  正解: {String.fromCharCode(65 + correctDisplayIndex)}.{" "}
                  {shuffledOptions[correctDisplayIndex]?.text}
                </p>
              )}
              {/* 出典情報 */}
              {currentQuestion.source && (
                <div className="mt-4 pt-3 border-t border-neutral-200">
                  <p className="text-xs text-neutral-400">
                    出典: {currentQuestion.source}
                    {currentQuestion.examFrequency &&
                      currentQuestion.examFrequency >= 3 && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-warning-100 text-warning-700 text-xs">
                          頻出
                        </span>
                      )}
                  </p>
                </div>
              )}
            </div>

            {/* 苦手登録ボタン */}
            <button
              onClick={handleAddToWeak}
              className="flex items-center justify-center gap-2 mt-4 py-3 text-neutral-500 hover:text-primary-600 transition-colors"
            >
              <BookmarkPlus className="h-5 w-5" />
              <span className="text-sm">あとで復習する</span>
            </button>

            {/* 次へボタン */}
            <div className="mt-auto pt-6">
              <Button variant="primary" size="lg" fullWidth onClick={handleNext}>
                {currentIndex >= questions.length - 1 ? "結果を見る" : "次の問題へ"}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* 音声設定シート */}
      <VoiceSettingsSheet
        isOpen={showVoiceSettings}
        onClose={() => setShowVoiceSettings(false)}
      />
    </div>
  );
}
