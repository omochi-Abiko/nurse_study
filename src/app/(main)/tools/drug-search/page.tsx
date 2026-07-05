"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Search,
  Pill,
  Syringe,
  Droplets,
  X,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import {
  searchDrugs,
  getDrugCategories,
  getTotalDrugsCount,
  type Drug,
} from "@/lib/drugs-client";

// カテゴリのアイコンと色
const categoryConfig: Record<
  string,
  { icon: React.ReactNode; color: string; bgColor: string }
> = {
  内用薬: {
    icon: <Pill className="h-4 w-4" />,
    color: "text-primary-600",
    bgColor: "bg-primary-100",
  },
  注射薬: {
    icon: <Syringe className="h-4 w-4" />,
    color: "text-secondary-600",
    bgColor: "bg-secondary-100",
  },
  外用薬: {
    icon: <Droplets className="h-4 w-4" />,
    color: "text-success-600",
    bgColor: "bg-success-100",
  },
};

const ITEMS_PER_PAGE = 20;

export default function DrugSearchPage() {
  // 検索状態
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  // データ状態
  const [drugs, setDrugs] = React.useState<Drug[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [totalDrugs, setTotalDrugs] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);
  const [offset, setOffset] = React.useState(0);

  // UI状態
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [selectedDrug, setSelectedDrug] = React.useState<Drug | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // 無限スクロール用のref
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  // デバウンス処理
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // 検索実行
  const fetchDrugs = React.useCallback(
    async (searchQuery: string, category: string | null, currentOffset: number, append: boolean = false) => {
      // 検索条件がない場合
      if (!searchQuery.trim() && !category) {
        setDrugs([]);
        setTotal(0);
        setHasMore(false);
        setHasSearched(false);
        return;
      }

      try {
        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
          setHasSearched(true);
        }
        setError(null);

        const data = await searchDrugs({
          query: searchQuery.trim() || undefined,
          category: category ?? undefined,
          limit: ITEMS_PER_PAGE,
          offset: currentOffset,
        });

        if (append) {
          setDrugs((prev) => [...prev, ...data.drugs]);
        } else {
          setDrugs(data.drugs);
        }

        setTotal(data.total);
        setHasMore(data.hasMore);
        setOffset(currentOffset + ITEMS_PER_PAGE);
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  // 検索条件が変更されたら新規検索
  React.useEffect(() => {
    setOffset(0);
    fetchDrugs(debouncedQuery, selectedCategory, 0, false);
  }, [debouncedQuery, selectedCategory, fetchDrugs]);

  // 初回読み込み時にカテゴリ情報を取得
  React.useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cats, count] = await Promise.all([
          getDrugCategories(),
          getTotalDrugsCount(),
        ]);
        setCategories(cats);
        setTotalDrugs(count);
      } catch {
        // メタデータ取得失敗は無視
      }
    };
    fetchMetadata();
  }, []);

  // 無限スクロール（IntersectionObserver）
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          fetchDrugs(debouncedQuery, selectedCategory, offset, true);
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoading, isLoadingMore, offset, debouncedQuery, selectedCategory, fetchDrugs]);

  return (
    <div className="min-h-screen pb-8">
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
            <h1 className="text-lg font-bold text-neutral-900">薬剤検索</h1>
            <p className="text-xs text-neutral-500">
              {totalDrugs > 0 ? `${totalDrugs.toLocaleString()}件の薬剤を収録` : "読み込み中..."}
            </p>
          </div>
        </div>
      </header>

      {/* 検索バー */}
      <div className="bg-white px-4 py-3 border-b border-neutral-100 sticky top-[60px] z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="薬品名・成分名・メーカー名で検索"
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* カテゴリフィルター */}
        <div className="flex gap-2 mt-3">
          {categories.map((category) => {
            const config = categoryConfig[category] || {
              icon: <Pill className="h-4 w-4" />,
              color: "text-neutral-600",
              bgColor: "bg-neutral-100",
            };
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(isSelected ? null : category)
                }
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  isSelected
                    ? `${config.bgColor} ${config.color}`
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                )}
              >
                {config.icon}
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* 検索結果 */}
      <div className="px-4 py-4">
        {error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-error-100 flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-error-500" />
            </div>
            <p className="text-neutral-600 font-medium mb-1">{error}</p>
            <p className="text-neutral-500 text-sm">
              もう一度お試しください
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-3" />
            <p className="text-neutral-500 text-sm">検索中...</p>
          </div>
        ) : hasSearched ? (
          <>
            {drugs.length > 0 ? (
              <>
                <p className="text-sm text-neutral-500 mb-3">
                  {total.toLocaleString()}件の結果
                </p>
                <div className="space-y-2">
                  {drugs.map((drug) => {
                    const config = categoryConfig[drug.category] || {
                      icon: <Pill className="h-4 w-4" />,
                      color: "text-neutral-600",
                      bgColor: "bg-neutral-100",
                    };
                    return (
                      <button
                        key={drug.id}
                        onClick={() => setSelectedDrug(drug)}
                        className="w-full bg-white rounded-xl p-4 shadow-sm border border-neutral-100 text-left hover:border-primary-200 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                              config.bgColor
                            )}
                          >
                            <span className={config.color}>{config.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 truncate">
                              {drug.name || drug.ingredient}
                            </p>
                            <p className="text-sm text-neutral-500 truncate">
                              {drug.ingredient}
                              {drug.specification && ` / ${drug.specification}`}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-neutral-400">
                                {drug.manufacturer || "メーカー不明"}
                              </span>
                              {drug.isOriginal && (
                                <span className="text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded">
                                  先発品
                                </span>
                              )}
                              {drug.isGeneric && (
                                <span className="text-xs bg-secondary-100 text-secondary-600 px-1.5 py-0.5 rounded">
                                  後発品
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-neutral-300 flex-shrink-0" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 追加読み込みトリガー */}
                <div ref={loadMoreRef} className="py-4 flex justify-center">
                  {isLoadingMore && (
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm">読み込み中...</span>
                    </div>
                  )}
                  {!hasMore && drugs.length > 0 && (
                    <p className="text-sm text-neutral-400">
                      すべての結果を表示しました
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-neutral-400" />
                </div>
                <p className="text-neutral-600 font-medium mb-1">
                  見つかりませんでした
                </p>
                <p className="text-neutral-500 text-sm">
                  別のキーワードで検索してみてください
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <Pill className="h-8 w-8 text-primary-500" />
            </div>
            <p className="text-neutral-600 font-medium mb-1">
              薬剤を検索しよう
            </p>
            <p className="text-neutral-500 text-sm">
              薬品名や成分名を入力して検索
            </p>
          </div>
        )}
      </div>

      {/* 薬剤詳細BottomSheet */}
      <BottomSheet
        isOpen={!!selectedDrug}
        onClose={() => setSelectedDrug(null)}
        title="薬剤詳細"
      >
        {selectedDrug && (
          <div className="space-y-4">
            {/* 薬品名 */}
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {selectedDrug.name || selectedDrug.ingredient}
              </p>
              {selectedDrug.name && selectedDrug.name !== selectedDrug.ingredient && (
                <p className="text-neutral-500 mt-1">{selectedDrug.ingredient}</p>
              )}
            </div>

            {/* タグ */}
            <div className="flex flex-wrap gap-2">
              {categoryConfig[selectedDrug.category] && (
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    categoryConfig[selectedDrug.category].bgColor,
                    categoryConfig[selectedDrug.category].color
                  )}
                >
                  {selectedDrug.category}
                </span>
              )}
              {selectedDrug.isOriginal && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-600">
                  先発品
                </span>
              )}
              {selectedDrug.isGeneric && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-600">
                  後発品
                </span>
              )}
            </div>

            {/* 詳細情報 */}
            <div className="space-y-3 bg-neutral-50 rounded-xl p-4">
              <div className="flex justify-between">
                <span className="text-neutral-500 text-sm">規格</span>
                <span className="text-neutral-900 font-medium">
                  {selectedDrug.specification || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 text-sm">メーカー</span>
                <span className="text-neutral-900 font-medium">
                  {selectedDrug.manufacturer || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 text-sm">薬価</span>
                <span className="text-neutral-900 font-medium">
                  {selectedDrug.price ? `${selectedDrug.price.toLocaleString()}円` : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 text-sm">薬価基準コード</span>
                <span className="text-neutral-900 font-mono text-sm">
                  {selectedDrug.code || "-"}
                </span>
              </div>
              {selectedDrug.deadline && (
                <div className="flex justify-between">
                  <span className="text-neutral-500 text-sm">経過措置期限</span>
                  <span className="text-warning-600 font-medium">
                    {selectedDrug.deadline}
                  </span>
                </div>
              )}
              {selectedDrug.note && (
                <div>
                  <span className="text-neutral-500 text-sm block mb-1">備考</span>
                  <span className="text-neutral-700 text-sm">
                    {selectedDrug.note}
                  </span>
                </div>
              )}
            </div>

            {/* 出典 */}
            <p className="text-xs text-neutral-400 text-center">
              出典: 厚生労働省 薬価基準収載品目リスト
            </p>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
