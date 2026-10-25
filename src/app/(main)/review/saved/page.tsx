"use client";

import * as React from "react";
import Link from "next/link";
import { useWeakQuestions } from "@/hooks/useApi";
import { useAppStore } from "@/store";
import { getQuestionById } from "@/data/questions";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import type { Question } from "@/types";

export default function SavedReviewPage() {
  const { weakQuestions, isLoading, error } = useWeakQuestions();
  const legacyQuestions = useAppStore((state) => state.weakQuestions);
  const customQuestions = useAppStore((state) => state.customQuestions);
  const [mounted, setMounted] = React.useState(false);
  const [category, setCategory] = React.useState("");
  const [search, setSearch] = React.useState("");
  React.useEffect(() => setMounted(true), []);

  // Include earlier daily-quiz saves as well as the current review collection.
  const ids = new Set<string>([
    ...weakQuestions.map((item: { questionId: string }) => item.questionId),
    ...legacyQuestions.map((item) => item.questionId),
  ]);
  const saved = [...ids]
    .map((id) => getQuestionById(id) ?? customQuestions.find((item) => item.id === id))
    .filter((item): item is Question => !!item);
  const categories = [...new Set(saved.map((item) => item.category))].sort((a, b) => a.localeCompare(b, "ja"));
  const query = search.trim().toLocaleLowerCase();
  const filtered = saved.filter((item) =>
    (!category || item.category === category) &&
    (!query || [item.text, item.explanation, ...(item.options ?? [])].join(" ").toLocaleLowerCase().includes(query))
  );

  return (
    <main className="mx-auto max-w-3xl px-4 pt-6 pb-8">
      <Link href="/" className="inline-flex min-h-11 items-center gap-1 text-sm text-primary-600"><ArrowLeft className="h-4 w-4" />ホーム</Link>
      <h1 className="mt-2 text-xl font-bold text-neutral-900">復習に保存した問題</h1>
      <p className="mt-2 text-sm text-neutral-600">分野ごとに問題を確認できます。「答え・解説を見る」で内容を読めます。</p>
      {!mounted || isLoading ? (
        <div role="status" className="flex items-center gap-2 py-12 text-neutral-500"><Loader2 className="h-5 w-5 animate-spin" />読み込み中...</div>
      ) : error ? (
        <p role="alert" className="mt-6 text-error-700">保存した問題を読み込めませんでした。ページを再読み込みしてください。</p>
      ) : saved.length === 0 ? (
        <div className="py-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-primary-400" />
          <h2 className="mt-4 font-bold">保存した問題はまだありません</h2>
          <p className="mt-2 text-sm text-neutral-600">解説ページの「あとで復習する」を押した問題や、間違えた問題が表示されます。</p>
          <Link href="/quiz/select" className="mt-5 inline-flex min-h-11 items-center text-primary-600">問題を選ぶ</Link>
        </div>
      ) : (
        <>
          <div className="my-5 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-neutral-700">分野
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white p-3">
                <option value="">すべての分野（{saved.length}問）</option>
                {categories.map((name) => <option key={name} value={name}>{name}（{saved.filter((item) => item.category === name).length}問）</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-neutral-700">キーワード
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="問題・答え・解説を検索" className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white p-3" />
            </label>
          </div>
          <p role="status" className="mb-4 text-sm text-neutral-500">{filtered.length}問を表示</p>
          {filtered.length === 0 && <p className="py-8 text-center text-neutral-600">条件に合う問題はありません。</p>}
          {categories.map((name) => {
            const items = filtered.filter((item) => item.category === name);
            return items.length > 0 ? (
              <section key={name} aria-label={name} className="mb-7">
                <h2 className="mb-3 font-bold text-primary-700">{name}<span className="ml-2 text-sm font-normal text-neutral-500">{items.length}問</span></h2>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
                      <h3 className="font-medium leading-relaxed text-neutral-900">{item.text}</h3>
                      <details className="mt-3">
                        <summary className="cursor-pointer py-2 text-sm font-medium text-primary-600">答え・解説を見る</summary>
                        <div className="mt-2 rounded-xl border border-success-200 bg-success-50 p-3 text-success-700">
                          <p className="text-xs font-medium">正しい答え</p>
                          <p className="mt-1 font-medium">{item.options?.[item.correctIndex] ?? "解説を確認してください"}</p>
                        </div>
                        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-700">{item.explanation}</p>
                        {item.source && <p className="mt-3 text-xs text-neutral-500">出典：{item.source}</p>}
                      </details>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null;
          })}
          <Link href="/review" className="inline-flex min-h-11 items-center text-sm font-medium text-primary-600">問題を解いて復習する →</Link>
        </>
      )}
    </main>
  );
}
