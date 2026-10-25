"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/store";

export function ResumeQuiz() {
  const session = useAppStore((state) => state.currentQuizSession);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !session || session.completed || session.questionIds.length === 0) return null;

  const answeredCount = new Set(session.answers.map((answer) => answer.questionId)).size;
  const allAnswered = answeredCount >= session.questionIds.length;
  const name = session.questionIds.every((id) => id.startsWith("anatomy-final-"))
    ? "解剖学・期末"
    : session.categories.join("・") || "クイズ";

  return (
    <aside className="my-4 rounded-2xl border border-primary-200 bg-primary-50 p-4">
      <p className="font-semibold text-neutral-900">{name}</p>
      <p className="mt-1 text-sm text-neutral-600">{session.questionIds.length}問中{answeredCount}問解答済み</p>
      <Link href="/quiz/session" className="mt-3 inline-flex min-h-11 items-center rounded-full bg-primary-500 px-5 py-2 font-medium text-white hover:bg-primary-600">
        {allAnswered ? "結果を見る" : "途中から再開"}
      </Link>
    </aside>
  );
}
