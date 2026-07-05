"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  flashcardCategories,
  getAllFlashcards,
  getFlashcardsByCategory,
  getCategoryById,
  shuffleCards,
  Flashcard as FlashcardType,
} from "@/data/flashcards";
import { Flashcard, FlashcardProgress } from "@/components/ui/flashcard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  X,
  Check,
  Loader2,
} from "lucide-react";

function FlashcardStudyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const isAllCards = searchParams.get("all") === "true";

  // カードの取得
  const category = categoryId ? getCategoryById(categoryId) : null;
  const initialCards = React.useMemo(() => {
    if (isAllCards) {
      return shuffleCards(getAllFlashcards());
    }
    if (categoryId) {
      return shuffleCards(getFlashcardsByCategory(categoryId));
    }
    return [];
  }, [isAllCards, categoryId]);

  const [cards, setCards] = React.useState<FlashcardType[]>(initialCards);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = React.useState<"left" | "right" | null>(null);

  const currentCard = cards[currentIndex];
  const cardCategory = currentCard
    ? flashcardCategories.find((cat) => cat.id === currentCard.category)
    : null;

  // スワイプ処理
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < cards.length - 1) {
      setSwipeDirection("left");
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
        setSwipeDirection(null);
      }, 150);
    }

    if (isRightSwipe && currentIndex > 0) {
      setSwipeDirection("right");
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setIsFlipped(false);
        setSwipeDirection(null);
      }, 150);
    }
  };

  // ボタンでの移動
  const goNext = () => {
    if (currentIndex < cards.length - 1) {
      setSwipeDirection("left");
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
        setSwipeDirection(null);
      }, 150);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setSwipeDirection("right");
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setIsFlipped(false);
        setSwipeDirection(null);
      }, 150);
    }
  };

  // シャッフル
  const handleShuffle = () => {
    setCards(shuffleCards([...cards]));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // リセット
  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-neutral-500 mb-4">カードが見つかりません</p>
        <Button variant="secondary" onClick={() => router.back()}>
          戻る
        </Button>
      </div>
    );
  }

  const isComplete = currentIndex === cards.length - 1 && isFlipped;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-neutral-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-neutral-900">
              {isAllCards ? "全カード" : category?.name ?? "フラッシュカード"}
            </h1>
            <p className="text-xs text-neutral-500">
              {currentIndex + 1} / {cards.length}
            </p>
          </div>
          <button
            onClick={handleShuffle}
            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <Shuffle className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* 進捗バー */}
      <div className="px-4 py-2 bg-neutral-50">
        <FlashcardProgress current={currentIndex + 1} total={cards.length} />
      </div>

      {/* カード表示エリア */}
      <div
        className="flex-1 flex items-center justify-center p-6"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={cn(
            "w-full max-w-sm transition-transform duration-150",
            swipeDirection === "left" && "-translate-x-4 opacity-50",
            swipeDirection === "right" && "translate-x-4 opacity-50"
          )}
        >
          {currentCard && (
            <Flashcard
              term={currentCard.term}
              reading={currentCard.reading}
              definition={currentCard.definition}
              example={currentCard.example}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
              color={cardCategory?.color}
            />
          )}
        </div>
      </div>

      {/* ナビゲーションボタン */}
      <div className="p-4 bg-white border-t border-neutral-100">
        {isComplete ? (
          <div className="space-y-3">
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-100 mb-3">
                <Check className="h-8 w-8 text-success-600" />
              </div>
              <p className="text-lg font-bold text-neutral-900">完了！</p>
              <p className="text-sm text-neutral-500">
                {cards.length}枚のカードを学習しました
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="h-5 w-5" />
                もう一度
              </Button>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => router.push("/flashcards")}
              >
                終了
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="flex-shrink-0"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="flex-1 text-center">
              <p className="text-sm text-neutral-500">
                {isFlipped ? "タップで表に戻る" : "タップで意味を見る"}
              </p>
            </div>

            <Button
              variant="ghost"
              size="lg"
              onClick={goNext}
              disabled={currentIndex === cards.length - 1}
              className="flex-shrink-0"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-4" />
      <p className="text-neutral-500 text-sm">読み込み中...</p>
    </div>
  );
}

export default function FlashcardStudyPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FlashcardStudyContent />
    </Suspense>
  );
}
