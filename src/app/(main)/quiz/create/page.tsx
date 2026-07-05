"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { questionCategories } from "@/data/questions";
import { ChevronLeft, Plus, Trash2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreateQuestionPage() {
  const router = useRouter();
  const addCustomQuestion = useAppStore((state) => state.addCustomQuestion);
  const customQuestions = useAppStore((state) => state.customQuestions);
  const deleteCustomQuestion = useAppStore((state) => state.deleteCustomQuestion);
  const showToast = useAppStore((state) => state.showToast);

  const [showForm, setShowForm] = React.useState(false);
  const [questionText, setQuestionText] = React.useState("");
  const [options, setOptions] = React.useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = React.useState(0);
  const [explanation, setExplanation] = React.useState("");
  const [category, setCategory] = React.useState<string>(questionCategories[0]);
  const [source, setSource] = React.useState("");

  const handleUpdateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    // バリデーション
    if (!questionText.trim()) {
      showToast("warning", "問題文を入力してください");
      return;
    }
    if (options.some((o) => !o.trim())) {
      showToast("warning", "すべての選択肢を入力してください");
      return;
    }
    if (!explanation.trim()) {
      showToast("warning", "解説を入力してください");
      return;
    }

    addCustomQuestion({
      text: questionText.trim(),
      type: "choice",
      options: options.map((o) => o.trim()),
      correctIndex,
      explanation: explanation.trim(),
      category,
      source: source.trim() || undefined,
    });

    showToast("success", "問題を作成しました");
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    setExplanation("");
    setSource("");
  };

  const handleDelete = (id: string) => {
    if (confirm("この問題を削除しますか？")) {
      deleteCustomQuestion(id);
      showToast("success", "問題を削除しました");
    }
  };

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-100">
        <div className="flex items-center justify-between px-4 h-14">
          <Link
            href="/quiz"
            className="p-2 -ml-2 text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="font-semibold text-neutral-900">カスタム問題</h1>
          <button
            onClick={() => setShowForm(true)}
            className="p-2 -mr-2 text-primary-500 hover:text-primary-700 transition-colors"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </header>

      <div className="pt-14 pb-8 screen-padding">
        {/* 問題作成フォーム */}
        {showForm ? (
          <div className="mt-4 space-y-4 animate-fade-in">
            <Card className="p-4">
              <h2 className="font-semibold text-neutral-900 mb-4">
                新しい問題を作成
              </h2>

              {/* カテゴリ選択 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  カテゴリ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                >
                  {questionCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 問題文 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  問題文 *
                </label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="問題文を入力..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                />
              </div>

              {/* 選択肢 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  選択肢 *（正解をタップ）
                </label>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCorrectIndex(index)}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors shrink-0",
                          correctIndex === index
                            ? "bg-primary-500 text-white"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        )}
                      >
                        {String.fromCharCode(65 + index)}
                      </button>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleUpdateOption(index, e.target.value)}
                        placeholder={`選択肢${String.fromCharCode(65 + index)}`}
                        className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  現在の正解: {String.fromCharCode(65 + correctIndex)}
                </p>
              </div>

              {/* 解説 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  解説 *
                </label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="解説を入力..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                />
              </div>

              {/* 出典（任意） */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  出典（任意）
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="例: 教科書P.123、過去問2023年"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>

              {/* ボタン */}
              <div className="flex gap-3">
                <Button variant="ghost" fullWidth onClick={resetForm}>
                  キャンセル
                </Button>
                <Button variant="primary" fullWidth onClick={handleSubmit}>
                  作成
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="mt-4">
            {customQuestions.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-neutral-500 mb-2">
                  {customQuestions.length}件の問題
                </p>
                {customQuestions.map((q) => (
                  <Card key={q.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <span className="text-xs text-primary-600 font-medium">
                          {q.category}
                        </span>
                        <p className="text-sm text-neutral-800 mt-1 line-clamp-2">
                          {q.text}
                        </p>
                        <p className="text-xs text-neutral-500 mt-2">
                          正解: {String.fromCharCode(65 + q.correctIndex)}
                          {q.source && ` ・ ${q.source}`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-2 text-neutral-400 hover:text-error-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
                  <HelpCircle className="h-10 w-10 text-neutral-300" />
                </div>
                <h2 className="text-lg font-medium text-neutral-700 mb-2">
                  カスタム問題がありません
                </h2>
                <p className="text-sm text-neutral-500 mb-6 max-w-[280px] mx-auto">
                  学校のテスト対策など、自分だけの問題を作成しよう
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  問題を作成
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
