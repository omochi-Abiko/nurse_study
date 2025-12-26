"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwipeCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export function SwipeCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  className,
}: SwipeCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [offsetX, setOffsetX] = React.useState(0);

  const SWIPE_THRESHOLD = 100;
  const MAX_ROTATION = 15;

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setOffsetX(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (offsetX > SWIPE_THRESHOLD && onSwipeRight) {
      onSwipeRight();
    } else if (offsetX < -SWIPE_THRESHOLD && onSwipeLeft) {
      onSwipeLeft();
    }

    setOffsetX(0);
  };

  const rotation = (offsetX / SWIPE_THRESHOLD) * MAX_ROTATION;
  const opacity = 1 - Math.abs(offsetX) / 300;

  const leftIndicatorOpacity = Math.max(0, -offsetX / SWIPE_THRESHOLD);
  const rightIndicatorOpacity = Math.max(0, offsetX / SWIPE_THRESHOLD);

  return (
    <div className="relative">
      {/* Swipe indicators */}
      <div
        className="absolute inset-0 flex items-center justify-start pl-8 pointer-events-none"
        style={{ opacity: leftIndicatorOpacity }}
      >
        <div className="bg-warning-500 text-white px-4 py-2 rounded-lg font-medium">
          まだ
        </div>
      </div>
      <div
        className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none"
        style={{ opacity: rightIndicatorOpacity }}
      >
        <div className="bg-success-500 text-white px-4 py-2 rounded-lg font-medium">
          わかった
        </div>
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        className={cn(
          "bg-white rounded-xl shadow-lg p-6 cursor-grab active:cursor-grabbing touch-none select-none",
          isDragging ? "" : "transition-transform duration-200",
          className
        )}
        style={{
          transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
          opacity: isDragging ? opacity : 1,
        }}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {children}
      </div>
    </div>
  );
}
