"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useLearningProgress } from "@/hooks/useApi";
import { getSkillById, getCategoryBySkillId, referenceSourceInfo } from "@/data/freshman-skills";
import { getTermsBySkillId, glossaryCategoryInfo } from "@/data/glossary";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, Check, Circle, AlertTriangle, Lightbulb, Loader2, ExternalLink, Book } from "lucide-react";
import Link from "next/link";

export default function LearningDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const skill = getSkillById(id);
  const category = getCategoryBySkillId(id);
  const relatedTerms = getTermsBySkillId(id);

  const { isComplete, toggleComplete, isLoading } = useLearningProgress();

  const isCompleted = isComplete(id);

  if (!skill || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500">コンテンツが見つかりません</p>
      </div>
    );
  }

  // カテゴリの色を取得
  const getCategoryColors = () => {
    switch (category.color) {
      case "primary":
        return {
          bg: "bg-primary-100",
          text: "text-primary-700",
          badge: "bg-primary-500",
        };
      case "secondary":
        return {
          bg: "bg-secondary-100",
          text: "text-secondary-700",
          badge: "bg-secondary-500",
        };
      case "warning":
        return {
          bg: "bg-warning-100",
          text: "text-warning-700",
          badge: "bg-warning-500",
        };
    }
  };

  const colors = getCategoryColors();

  return (
    <div className="min-h-screen pb-32">
      {/* ヘッダー */}
      <header className="bg-white border-b border-neutral-100 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">{skill.icon}</span>
              <h1 className="text-lg font-bold text-neutral-900 line-clamp-1">
                {skill.title}
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full text-white",
                  colors.badge
                )}
              >
                {category.name}
              </span>
              {isCompleted && (
                <span className="text-xs text-success-600 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  学習済み
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* コンテンツ */}
      <div className="px-4 py-6 space-y-6">
        {/* メイン画像 */}
        {skill.image && (
          <section>
            <div className="rounded-xl overflow-hidden shadow-card">
              <img
                src={skill.image}
                alt={skill.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </section>
        )}

        {/* 概要 */}
        <section>
          <p className="text-neutral-700 leading-relaxed">{skill.overview}</p>
        </section>

        {/* ポイント */}
        <section>
          <h2 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <span className={cn("w-1 h-4 rounded-full", colors.badge)} />
            ポイント
          </h2>
          <div className="bg-white rounded-xl shadow-card p-4 space-y-2">
            {skill.keyPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className={cn("text-sm font-bold mt-0.5", colors.text)}>
                  {index + 1}.
                </span>
                <p className="text-sm text-neutral-700 flex-1">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 手順（実技のみ） */}
        {skill.steps && skill.steps.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <span className={cn("w-1 h-4 rounded-full", colors.badge)} />
              手順
            </h2>
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              {skill.steps.map((step, index) => {
                const stepImage = skill.stepImages?.[index];
                return (
                  <div
                    key={index}
                    className="border-b border-neutral-50 last:border-b-0"
                  >
                    <div className="flex items-start gap-3 p-3">
                      <span
                        className={cn(
                          "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                          colors.badge
                        )}
                      >
                        {index + 1}
                      </span>
                      <p className="text-sm text-neutral-700 pt-0.5">{step}</p>
                    </div>
                    {stepImage && (
                      <div className="px-3 pb-3">
                        <img
                          src={stepImage}
                          alt={`手順${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* よくある失敗 */}
        {skill.commonMistakes && skill.commonMistakes.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning-500" />
              よくある失敗
            </h2>
            <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 space-y-2">
              {skill.commonMistakes.map((mistake, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-warning-500 mt-0.5">×</span>
                  <p className="text-sm text-warning-800">{mistake}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* コツ・対策 */}
        {skill.tips && skill.tips.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-success-500" />
              コツ・対策
            </h2>
            <div className="bg-success-50 border border-success-200 rounded-xl p-4 space-y-2">
              {skill.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-success-500 mt-0.5">✓</span>
                  <p className="text-sm text-success-800">{tip}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 関連用語 */}
        {relatedTerms.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <Book className="h-4 w-4 text-secondary-500" />
              関連用語
            </h2>
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              {relatedTerms.map((term, index) => {
                const termCategoryInfo = glossaryCategoryInfo[term.category];
                return (
                  <Link
                    key={term.id}
                    href={`/glossary/${term.id}`}
                    className={cn(
                      "flex items-start gap-3 p-3 hover:bg-neutral-50 transition-colors",
                      index !== relatedTerms.length - 1 && "border-b border-neutral-50"
                    )}
                  >
                    <span className="text-lg flex-shrink-0">{termCategoryInfo.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-neutral-800">{term.term}</p>
                        <span className="text-xs text-neutral-400">{term.reading}</span>
                      </div>
                      <p className="text-xs text-neutral-500 line-clamp-2 mt-0.5">
                        {term.definition}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 参考リンク */}
        {skill.references && skill.references.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-primary-500" />
              もっと学ぶ
            </h2>
            <div className="space-y-2">
              {skill.references.map((ref, index) => {
                const sourceInfo = referenceSourceInfo[ref.source];
                return (
                  <a
                    key={index}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-card hover:shadow-md transition-shadow"
                  >
                    <span className="text-xl">{sourceInfo.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800 line-clamp-1">
                        {ref.title}
                      </p>
                      <p className="text-xs text-neutral-500">{sourceInfo.name}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* 固定フッター（タブバーの上） */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-neutral-100 p-4">
        <Button
          variant={isCompleted ? "secondary" : "primary"}
          size="lg"
          fullWidth
          onClick={() => toggleComplete(id)}
          disabled={isLoading}
          className="flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isCompleted ? (
            <>
              <Check className="h-5 w-5" />
              学習済み（タップで解除）
            </>
          ) : (
            <>
              <Circle className="h-5 w-5" />
              学習済みにする
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
