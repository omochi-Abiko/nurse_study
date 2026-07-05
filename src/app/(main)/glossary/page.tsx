"use client";

import * as React from "react";
import Link from "next/link";
import {
  glossaryTerms,
  glossaryCategoryInfo,
  GlossaryCategory,
  searchGlossary,
} from "@/data/glossary";
import { cn } from "@/lib/utils";
import { ChevronLeft, Search, Book } from "lucide-react";

// 50音順ソート用の比較関数
const sortByReading = (a: { reading: string }, b: { reading: string }) =>
  a.reading.localeCompare(b.reading, "ja");

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] =
    React.useState<GlossaryCategory | "all">("all");

  // フィルタリングと検索
  const filteredTerms = React.useMemo(() => {
    let terms = glossaryTerms;

    // カテゴリフィルタ
    if (selectedCategory !== "all") {
      terms = terms.filter((term) => term.category === selectedCategory);
    }

    // 検索フィルタ
    if (searchQuery.trim()) {
      terms = searchGlossary(searchQuery.trim()).filter(
        (term) => selectedCategory === "all" || term.category === selectedCategory
      );
    }

    // 50音順ソート
    return [...terms].sort(sortByReading);
  }, [searchQuery, selectedCategory]);

  // 50音のインデックス生成
  const indexedTerms = React.useMemo(() => {
    const index: Record<string, typeof filteredTerms> = {};
    filteredTerms.forEach((term) => {
      // ひらがなの最初の文字でグループ化
      const firstChar = term.reading.charAt(0);
      if (!index[firstChar]) {
        index[firstChar] = [];
      }
      index[firstChar].push(term);
    });
    return index;
  }, [filteredTerms]);

  const categoryColors: Record<GlossaryCategory, string> = {
    anatomy: "bg-primary-500",
    vital: "bg-secondary-500",
    nursing: "bg-success-500",
    disease: "bg-warning-500",
    drug: "bg-neutral-500",
  };

  const categoryBgColors: Record<GlossaryCategory, string> = {
    anatomy: "bg-primary-50 text-primary-700",
    vital: "bg-secondary-50 text-secondary-700",
    nursing: "bg-success-50 text-success-700",
    disease: "bg-warning-50 text-warning-700",
    drug: "bg-neutral-100 text-neutral-700",
  };

  return (
    <div className="min-h-screen pb-8 bg-neutral-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-neutral-100 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 -ml-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Book className="h-5 w-5 text-primary-500" />
              用語集
            </h1>
            <p className="text-xs text-neutral-500">
              {filteredTerms.length}語 / {glossaryTerms.length}語
            </p>
          </div>
        </div>
      </header>

      {/* 検索バー */}
      <div className="px-4 py-3 bg-white border-b border-neutral-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="用語を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
          />
        </div>
      </div>

      {/* カテゴリタブ */}
      <div className="px-4 py-3 bg-white border-b border-neutral-100 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              selectedCategory === "all"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            )}
          >
            すべて
          </button>
          {(Object.keys(glossaryCategoryInfo) as GlossaryCategory[]).map(
            (category) => {
              const info = glossaryCategoryInfo[category];
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5",
                    selectedCategory === category
                      ? categoryBgColors[category]
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  )}
                >
                  <span>{info.icon}</span>
                  {info.name}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* 用語一覧 */}
      <div className="px-4 py-4">
        {filteredTerms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">
              {searchQuery ? "該当する用語がありません" : "用語がありません"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(indexedTerms).map(([char, terms]) => (
              <div key={char}>
                {/* 50音インデックス */}
                <div className="sticky top-[110px] z-5 bg-neutral-50 py-1">
                  <span className="text-sm font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                    {char}
                  </span>
                </div>

                {/* 用語リスト */}
                <div className="mt-2 space-y-2">
                  {terms.map((term) => {
                    const categoryInfo = glossaryCategoryInfo[term.category];
                    return (
                      <Link
                        key={term.id}
                        href={`/glossary/${term.id}`}
                        className="block bg-white rounded-xl shadow-card hover:shadow-md transition-shadow p-3"
                      >
                        <div className="flex items-start gap-3">
                          {/* カテゴリアイコン */}
                          <span
                            className={cn(
                              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg",
                              categoryBgColors[term.category]
                            )}
                          >
                            {categoryInfo.icon}
                          </span>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-neutral-900">
                                {term.term}
                              </h3>
                              <span className="text-xs text-neutral-400">
                                {term.reading}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600 line-clamp-2 mt-0.5">
                              {term.definition}
                            </p>

                            {/* タグ */}
                            {term.tags && term.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {term.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
