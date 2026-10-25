"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Bone, BookOpen } from "lucide-react";
import { questions } from "@/data/questions";
import { anatomyFinalQuestions } from "@/data/anatomy-final";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResumeQuiz } from "@/components/ui/resume-quiz";

const category = "解剖学（1年生）";
const collections = [
  {
    name: "期末",
    description: "解剖学認定試験の全70問。正解は添付の解答用紙に準拠しています。",
    questions: anatomyFinalQuestions,
  },
  {
    name: "ポイントチェック",
    description: "細胞・組織、生殖・発生、骨格、筋、神経系の基礎を復習。",
    questions: questions.filter((q) => q.category === category && !q.id.startsWith("anatomy-final-")),
  },
];

export default function AnatomyQuizPage() {
  const router = useRouter();
  const startQuizSession = useAppStore((state) => state.startQuizSession);

  const startCollection = (ids: string[]) => {
    const saved = useAppStore.getState().currentQuizSession;
    if (saved && !saved.completed && saved.questionIds.length === ids.length && saved.questionIds.every((id) => ids.includes(id))) {
      router.push("/quiz/session");
      return;
    }
    startQuizSession([category], 0, "category", ids);
    router.push("/quiz/session");
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-neutral-100">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" aria-label="ホームへ戻る" className="p-2 text-neutral-500">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="font-semibold text-neutral-900">解剖学（1年生）</h1>
          <Bone className="h-6 w-6 text-primary-500" />
        </div>
      </header>
      <main className="screen-padding py-6 space-y-4">
        <ResumeQuiz />
        <p className="text-sm text-neutral-500">問題集を選んで始めましょう。問題・選択肢はランダムに出題されます。</p>
        {collections.map((collection) => (
          <Card key={collection.name} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">{collection.name}</h2>
              <span className="text-sm text-primary-600">{collection.questions.length}問</span>
            </div>
            <p className="text-sm text-neutral-500">{collection.description}</p>
            <Button fullWidth onClick={() => startCollection(collection.questions.map((q) => q.id))}>
              <BookOpen className="h-5 w-5 mr-2" />
              {collection.name}を始める
            </Button>
          </Card>
        ))}
      </main>
    </div>
  );
}
