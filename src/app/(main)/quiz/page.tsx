"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { getQuestionsByIds } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { ProgressDots } from "@/components/ui/progress";
import { VoiceControl, VoiceSettingsSheet } from "@/components/ui/voice-control";
import { speechService } from "@/lib/speech";
import { cn } from "@/lib/utils";
import { shareService } from "@/lib/share";
import { X, Check, BookmarkPlus, Stethoscope, Settings, Share2 } from "lucide-react";

type QuizState = "question" | "result" | "complete";

export default function QuizPage() {
  const router = useRouter();
  const dailyQuiz = useAppStore((state) => state.dailyQuiz);
  const answerQuestion = useAppStore((state) => state.answerQuestion);
  const completeDailyQuiz = useAppStore((state) => state.completeDailyQuiz);
  const addWeakQuestion = useAppStore((state) => state.addWeakQuestion);
  const voiceSettings = useAppStore((state) => state.voiceSettings);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [quizState, setQuizState] = React.useState<QuizState>("question");
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const hasSpokenRef = React.useRef(false);
  // 回答時の問題を保存（結果表示中に別の問題に切り替わるのを防ぐ）
  const [answeredQuestion, setAnsweredQuestion] = React.useState<ReturnType<typeof getQuestionsByIds>[0] | null>(null);

  const initDailyQuiz = useAppStore((state) => state.initDailyQuiz);

  const questions = React.useMemo(() => {
    if (!dailyQuiz) return [];
    return getQuestionsByIds(dailyQuiz.questionIds);
  }, [dailyQuiz]);

  // 有効な問題が3未満なら再生成
  React.useEffect(() => {
    if (dailyQuiz && questions.length < 3) {
      initDailyQuiz();
    }
  }, [dailyQuiz, questions.length, initDailyQuiz]);

  // 結果表示中は回答した問題を使用、それ以外は現在の問題
  const currentQuestion = quizState === "result" && answeredQuestion ? answeredQuestion : questions[currentIndex];
  const answeredCount = dailyQuiz?.answers.length ?? 0;

  // 初回マウント時のみ：既に回答済みの問題はスキップ
  // quizState が "question" のときのみ実行（結果表示中はスキップしない）
  const initializedRef = React.useRef(false);
  React.useEffect(() => {
    if (!initializedRef.current && dailyQuiz && quizState === "question") {
      initializedRef.current = true;
      if (answeredCount > 0 && answeredCount < questions.length) {
        setCurrentIndex(answeredCount);
      }
    }
  }, [dailyQuiz, answeredCount, quizState, questions.length]);

  // 全問回答済みなら完了画面へ
  React.useEffect(() => {
    if (dailyQuiz?.completed) {
      setQuizState("complete");
    }
  }, [dailyQuiz?.completed]);

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
        currentQuestion.options || [],
        { rate: voiceSettings.rate }
      );
    } catch (error) {
      console.error("Speech error:", error);
    }
  }, [currentQuestion, voiceSettings.enabled, voiceSettings.rate]);

  // 解説を読み上げる関数
  const speakExplanation = React.useCallback(async () => {
    if (!currentQuestion || !voiceSettings.enabled) return;

    const correctLabel = String.fromCharCode(65 + currentQuestion.correctIndex);
    const correctAnswer = currentQuestion.options?.[currentQuestion.correctIndex] || "";

    try {
      await speechService.speakExplanation(
        `${correctLabel}、${correctAnswer}`,
        currentQuestion.explanation,
        { rate: voiceSettings.rate }
      );
    } catch (error) {
      console.error("Speech error:", error);
    }
  }, [currentQuestion, voiceSettings.enabled, voiceSettings.rate]);

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
    // コンポーネントがアンマウントされるときに停止
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

  const handleSelectOption = (index: number) => {
    if (quizState !== "question" || !currentQuestion) return;

    // 回答時の問題を保存（結果表示中に変わらないように）
    setAnsweredQuestion(currentQuestion);
    setSelectedIndex(index);
    const correct = index === currentQuestion.correctIndex;
    setIsCorrect(correct);

    // 回答を記録
    answerQuestion(currentQuestion.id, index, correct);

    setQuizState("result");
  };

  const handleNext = () => {
    if (currentIndex >= questions.length - 1) {
      completeDailyQuiz();
      setQuizState("complete");
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setAnsweredQuestion(null);
      setQuizState("question");
    }
  };

  const handleAddToWeak = () => {
    if (currentQuestion) {
      addWeakQuestion(currentQuestion.id);
    }
  };

  const handleClose = () => {
    router.push("/");
  };

  const handleFinish = () => {
    router.push("/");
  };

  // 完了画面
  if (quizState === "complete") {
    const correctCount = dailyQuiz?.answers.filter((a) => a.isCorrect).length ?? 0;
    const messages = [
      { min: 3, text: "パーフェクト！", sub: "すごい！全問正解だよ" },
      { min: 2, text: "いい調子！", sub: "もう少しで完璧だね" },
      { min: 1, text: "復習すれば大丈夫", sub: "少しずつ覚えていこう" },
      { min: 0, text: "今日やっただけでえらい", sub: "続けることが大事だよ" },
    ];
    const message = messages.find((m) => correctCount >= m.min) ?? messages[3];

    const handleShare = async () => {
      const success = await shareService.shareDailyResult(correctCount, 3);
      if (success) {
        // シェア成功（またはクリップボードにコピー成功）
      }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
            <Stethoscope className="h-12 w-12 text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {message.text}
          </h1>
          <p className="text-neutral-600 mb-2">{message.sub}</p>
          <p className="text-lg font-medium text-primary-600 mb-8">
            {correctCount}/3 正解
          </p>
          <div className="flex flex-col gap-3 w-full max-w-[200px] mx-auto">
            <Button variant="primary" size="lg" onClick={handleFinish}>
              ホームに戻る
            </Button>
            <Button
              variant="secondary"
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
        <ProgressDots total={3} current={currentIndex + (quizState === "result" ? 1 : 0)} />
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
            {/* 問題文 */}
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xl font-medium text-neutral-900 text-center leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>

            {/* 選択肢 */}
            <div className="space-y-3 mt-auto">
              {currentQuestion.options?.map((option, index) => (
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
                    {String.fromCharCode(65 + index)}. {option}
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
                  正解: {String.fromCharCode(65 + currentQuestion.correctIndex)}.{" "}
                  {currentQuestion.options?.[currentQuestion.correctIndex]}
                </p>
              )}
              {/* 出典情報 */}
              {currentQuestion.source && (
                <div className="mt-4 pt-3 border-t border-neutral-200">
                  <p className="text-xs text-neutral-400">
                    出典: {currentQuestion.source}
                    {currentQuestion.examFrequency && currentQuestion.examFrequency >= 3 && (
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
