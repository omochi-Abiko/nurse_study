"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getTermById,
  glossaryCategoryInfo,
  getTermsByCategory,
  GlossaryTerm,
} from "@/data/glossary";
import { getSkillById } from "@/data/freshman-skills";
import { cn } from "@/lib/utils";
import { ChevronLeft, Book, ArrowRight } from "lucide-react";

export default function GlossaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const term = getTermById(id);

  if (!term) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500">用語が見つかりません</p>
      </div>
    );
  }

  const categoryInfo = glossaryCategoryInfo[term.category];

  // 関連スキルを取得
  const relatedSkills = term.relatedSkillIds
    ?.map((skillId) => getSkillById(skillId))
    .filter(Boolean);

  // 同じカテゴリの他の用語（最大5件）
  const relatedTerms = getTermsByCategory(term.category)
    .filter((t) => t.id !== term.id)
    .slice(0, 5);

  const categoryBgColors: Record<string, string> = {
    anatomy: "bg-primary-50 text-primary-700 border-primary-200",
    vital: "bg-secondary-50 text-secondary-700 border-secondary-200",
    nursing: "bg-success-50 text-success-700 border-success-200",
    disease: "bg-warning-50 text-warning-700 border-warning-200",
    drug: "bg-neutral-100 text-neutral-700 border-neutral-200",
  };

  const categoryAccentColors: Record<string, string> = {
    anatomy: "bg-primary-500",
    vital: "bg-secondary-500",
    nursing: "bg-success-500",
    disease: "bg-warning-500",
    drug: "bg-neutral-500",
  };

  return (
    <div className="min-h-screen pb-8 bg-neutral-50">
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
            <h1 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <span className="text-xl">{categoryInfo.icon}</span>
              {term.term}
            </h1>
            <p className="text-xs text-neutral-500">{term.reading}</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* カテゴリバッジ */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium border",
              categoryBgColors[term.category]
            )}
          >
            {categoryInfo.icon} {categoryInfo.name}
          </span>
        </div>

        {/* 定義 */}
        <section>
          <h2 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <span
              className={cn(
                "w-1 h-4 rounded-full",
                categoryAccentColors[term.category]
              )}
            />
            定義
          </h2>
          <div className="bg-white rounded-xl shadow-card p-4">
            <p className="text-neutral-700 leading-relaxed">{term.definition}</p>
          </div>
        </section>

        {/* タグ */}
        {term.tags && term.tags.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <span
                className={cn(
                  "w-1 h-4 rounded-full",
                  categoryAccentColors[term.category]
                )}
              />
              関連キーワード
            </h2>
            <div className="flex flex-wrap gap-2">
              {term.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-white rounded-full text-sm text-neutral-600 shadow-card"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 関連スキル */}
        {relatedSkills && relatedSkills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <span
                className={cn(
                  "w-1 h-4 rounded-full",
                  categoryAccentColors[term.category]
                )}
              />
              関連する学習
            </h2>
            <div className="space-y-2">
              {relatedSkills.map((skill) => (
                <Link
                  key={skill!.id}
                  href={`/learning/${skill!.id}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-card hover:shadow-md transition-shadow"
                >
                  <span className="text-xl">{skill!.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-800">{skill!.title}</p>
                    <p className="text-xs text-neutral-500 line-clamp-1">
                      {skill!.overview}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-400" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 同じカテゴリの用語 */}
        {relatedTerms.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <span
                className={cn(
                  "w-1 h-4 rounded-full",
                  categoryAccentColors[term.category]
                )}
              />
              同じカテゴリの用語
            </h2>
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              {relatedTerms.map((relatedTerm, index) => (
                <Link
                  key={relatedTerm.id}
                  href={`/glossary/${relatedTerm.id}`}
                  className={cn(
                    "flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors",
                    index !== relatedTerms.length - 1 && "border-b border-neutral-50"
                  )}
                >
                  <span className="text-lg">{categoryInfo.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-800">
                        {relatedTerm.term}
                      </p>
                      <span className="text-xs text-neutral-400">
                        {relatedTerm.reading}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 line-clamp-1">
                      {relatedTerm.definition}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-400" />
                </Link>
              ))}
            </div>

            {/* 全ての用語を見る */}
            <Link
              href="/glossary"
              className="mt-3 flex items-center justify-center gap-2 text-sm text-primary-600 hover:text-primary-700"
            >
              <Book className="h-4 w-4" />
              用語集一覧を見る
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
