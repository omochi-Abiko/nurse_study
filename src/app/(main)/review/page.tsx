"use client";

import * as React from "react";
import Link from "next/link";
import { useWeakQuestions } from "@/hooks/useApi";
import { getQuestionById } from "@/data/questions";
import { advanceReviewQueue } from "@/lib/review-queue";
import { Button } from "@/components/ui/button";
import { Brain, Loader2, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LocalWeakQuestion } from "@/lib/local-db";

export default function ReviewPage() {
  const { weakQuestions, isLoading, error, answerWeakQuestion } = useWeakQuestions();
  const [queue, setQueue] = React.useState<string[] | null>(null);
  const [category, setCategory] = React.useState("");
  const [showList, setShowList] = React.useState(false);
  const [result, setResult] = React.useState<{ selectedIndex: number; isCorrect: boolean } | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState("");
  const [solvedCount, setSolvedCount] = React.useState(0);
  const submitting = React.useRef(false);

  const available = (weakQuestions as LocalWeakQuestion[])
    .map((item) => getQuestionById(item.questionId))
    .filter((question) => question !== undefined);
  const categories = [...new Set(available.map((question) => question.category))];

  // 出題順は保存リストから切り離す。正解でリストが減っても問題を飛ばさない。
  React.useEffect(() => {
    if (!isLoading && !error && queue === null) {
      setQueue((weakQuestions as LocalWeakQuestion[])
        .map((item) => getQuestionById(item.questionId))
        .filter((question) => question && (!category || question.category === category))
        .map((question) => question!.id));
    }
  }, [weakQuestions, isLoading, error, queue, category]);

  const question = queue?.[0] ? getQuestionById(queue[0]) : undefined;
  const remainingCount = (queue?.length ?? 0) - (result?.isCorrect ? 1 : 0);

  const selectAnswer = async (selectedIndex: number) => {
    if (!question || result || submitting.current) return;
    submitting.current = true;
    setSaving(true);
    setSaveError("");
    try {
      const answer = await answerWeakQuestion(question.id, selectedIndex);
      setResult({ selectedIndex, isCorrect: answer.isCorrect });
      if (answer.isCorrect) setSolvedCount((count) => count + 1);
    } catch {
      setSaveError("回答を保存できませんでした。もう一度選んでください。");
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  };

  const nextQuestion = () => {
    if (!question || !result) return;
    setQueue((current) => advanceReviewQueue(current ?? [], question.id, result.isCorrect));
    setResult(null);
    setSaveError("");
  };

  const changeCategory = (value: string) => {
    setCategory(value);
    setQueue(null);
    setResult(null);
    setShowList(false);
    setSaveError("");
  };

  if (isLoading || (queue === null && !error)) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary-500" aria-label="読み込み中" /></div>;
  }
  if (error) {
    return <p role="alert" className="p-6">苦手問題を読み込めませんでした。ページを再読み込みしてください。</p>;
  }

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      <header className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-xl font-bold text-neutral-900">苦手を復習</h1>
        <span className="text-sm text-neutral-500">あと{remainingCount}問</span>
      </header>
      <p className="text-sm text-neutral-500 mb-4">選択肢を選んで回答。正解は「わかった」、不正解は「まだ」に自動で分類されます。</p>
      <div className="flex items-center gap-3 mb-5">
        <label className="flex-1 text-sm text-neutral-600">
          分野
          <select value={category} disabled={saving || !!result} onChange={(event) => changeCategory(event.target.value)} className="ml-2 max-w-full rounded-lg border border-neutral-200 bg-white p-2">
            <option value="">すべて</option>
            {[...new Set([...categories, ...(category ? [category] : [])])].map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </label>
        {question && <Button variant="secondary" disabled={saving || !!result} onClick={() => setShowList((value) => !value)}><List className="h-4 w-4 mr-1" />{showList ? "問題に戻る" : "問題一覧"}</Button>}
      </div>

      {!question ? (
        <div className="py-12 text-center">
          <Brain className="h-16 w-16 text-primary-500 mx-auto mb-5" />
          <h2 className="text-xl font-bold text-neutral-900">{solvedCount > 0 ? "すべて「わかった」になったよ！" : "復習する問題はないよ"}</h2>
          <p className="text-sm text-neutral-500 my-4">{solvedCount > 0 ? "正解した問題を苦手リストから外しました。" : "クイズで間違えた問題や「あとで復習」を押した問題がここに追加されます。"}</p>
          {category && <Button variant="secondary" onClick={() => changeCategory("")}>すべての分野に戻る</Button>}
          <Link href="/" className="block mt-5 text-primary-600">ホームに戻る</Link>
        </div>
      ) : showList ? (
        <div className="space-y-3">
          {queue?.map((id) => {
            const item = getQuestionById(id);
            return item ? <button key={id} className="w-full rounded-xl border border-neutral-200 bg-white p-4 text-left hover:border-primary-400" onClick={() => {
              setQueue((current) => [id, ...(current ?? []).filter((other) => other !== id)]);
              setShowList(false);
            }}><span className="block text-xs text-primary-600 mb-2">{item.category}</span>{item.text}</button> : null;
          })}
        </div>
      ) : (
        <section className="rounded-2xl bg-white border border-neutral-100 p-5 shadow-card">
          <p className="text-xs text-primary-600 mb-3">{question.category}</p>
          <h2 className="text-lg font-medium text-neutral-900 mb-5 leading-relaxed">{question.text}</h2>
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button key={`${question.id}-${index}`} disabled={saving || !!result} onClick={() => selectAnswer(index)} className={cn(
                "w-full rounded-xl border-2 p-4 text-left transition-colors disabled:cursor-default",
                result && index === question.correctIndex ? "border-success-500 bg-success-50 text-success-700" :
                result && index === result.selectedIndex ? "border-warning-500 bg-warning-50 text-neutral-800" :
                "border-neutral-200 text-neutral-700 enabled:hover:border-primary-400"
              )}>{String.fromCharCode(65 + index)}. {option}</button>
            ))}
          </div>
          {saving && <p role="status" className="mt-4 text-sm text-neutral-500">回答を保存中...</p>}
          {saveError && <p role="alert" className="mt-4 text-error-600">{saveError}</p>}
          {result && <div className="mt-6" aria-live="polite">
            <div className={cn("mb-4 rounded-lg border p-3", result.isCorrect ? "border-success-200 bg-success-50 text-success-700" : "border-error-200 bg-error-50 text-error-700")}>
              <p className="text-sm font-medium mb-1">あなたの回答（{result.isCorrect ? "○ 正解" : "× 不正解"}）</p>
              <p className="font-medium">{String.fromCharCode(65 + result.selectedIndex)}. {question.options?.[result.selectedIndex]}</p>
            </div>
            <h3 className={cn("text-lg font-bold", result.isCorrect ? "text-success-600" : "text-warning-600")}>{result.isCorrect ? "○ 正解！ わかった" : "× 不正解 まだ"}</h3>
            <p className="text-sm text-neutral-600 mt-2">{result.isCorrect ? "苦手リストから外しました。" : "苦手リストに残しました。あとでもう一度出題します。"}</p>
            {!result.isCorrect && (
              <div className="mt-4 rounded-lg border border-success-200 bg-success-50 p-3 text-success-700">
                <p className="text-sm font-medium mb-1">正しい答え（○ 正解）</p>
                <p className="font-medium">{String.fromCharCode(65 + question.correctIndex)}. {question.options?.[question.correctIndex]}</p>
              </div>
            )}
            <p className="text-sm text-neutral-600 mt-2 leading-relaxed">{question.explanation}</p>
            <Button fullWidth className="mt-5" onClick={nextQuestion}>{remainingCount === 0 ? "復習を終える" : queue?.length === 1 && !result.isCorrect ? "もう一度解く" : "次の問題へ"}</Button>
          </div>}
        </section>
      )}
    </div>
  );
}
