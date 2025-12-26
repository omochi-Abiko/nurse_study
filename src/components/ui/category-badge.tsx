"use client";

import * as React from "react";
import { CategoryStats } from "@/types";
import { cn } from "@/lib/utils";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

interface CategoryBadgeProps {
  stat: CategoryStats;
  onClick?: () => void;
  className?: string;
}

export function CategoryBadge({ stat, onClick, className }: CategoryBadgeProps) {
  const isClickable = !!onClick;

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
        stat.isWeak
          ? "bg-warning-50 text-warning-700 border border-warning-200"
          : stat.accuracy >= 80
          ? "bg-success-50 text-success-700 border border-success-200"
          : "bg-neutral-100 text-neutral-700 border border-neutral-200",
        isClickable && "hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
        !isClickable && "cursor-default",
        className
      )}
    >
      {stat.isWeak ? (
        <AlertTriangle className="h-4 w-4" />
      ) : stat.accuracy >= 80 ? (
        <TrendingUp className="h-4 w-4" />
      ) : (
        <TrendingDown className="h-4 w-4" />
      )}
      <span className="font-medium">{stat.category}</span>
      <span className="text-xs opacity-75">{stat.accuracy}%</span>
    </button>
  );
}

interface CategoryStatsListProps {
  stats: CategoryStats[];
  onCategoryClick?: (category: string) => void;
  className?: string;
}

export function CategoryStatsList({
  stats,
  onCategoryClick,
  className,
}: CategoryStatsListProps) {
  if (stats.length === 0) {
    return (
      <div className={cn("text-center py-4 text-neutral-400 text-sm", className)}>
        まだ回答履歴がありません
      </div>
    );
  }

  const weakCategories = stats.filter((s) => s.isWeak);
  const strongCategories = stats.filter((s) => s.accuracy >= 80);
  const otherCategories = stats.filter((s) => !s.isWeak && s.accuracy < 80);

  return (
    <div className={cn("space-y-4", className)}>
      {/* 苦手分野 */}
      {weakCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-warning-600 mb-2 flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            苦手な分野
          </h4>
          <div className="flex flex-wrap gap-2">
            {weakCategories.map((stat) => (
              <CategoryBadge
                key={stat.category}
                stat={stat}
                onClick={onCategoryClick ? () => onCategoryClick(stat.category) : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* 得意分野 */}
      {strongCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-success-600 mb-2 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            得意な分野
          </h4>
          <div className="flex flex-wrap gap-2">
            {strongCategories.map((stat) => (
              <CategoryBadge
                key={stat.category}
                stat={stat}
                onClick={onCategoryClick ? () => onCategoryClick(stat.category) : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* その他 */}
      {otherCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-neutral-600 mb-2">その他</h4>
          <div className="flex flex-wrap gap-2">
            {otherCategories.map((stat) => (
              <CategoryBadge
                key={stat.category}
                stat={stat}
                onClick={onCategoryClick ? () => onCategoryClick(stat.category) : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface WeakCategoryAlertProps {
  categories: string[];
  className?: string;
}

export function WeakCategoryAlert({ categories, className }: WeakCategoryAlertProps) {
  if (categories.length === 0) return null;

  return (
    <div
      className={cn(
        "bg-warning-50 border border-warning-200 rounded-xl p-4",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-warning-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-warning-700">
            {categories.length === 1
              ? `${categories[0]}が苦手みたい`
              : `${categories.slice(0, 2).join("と")}が苦手みたい`}
          </p>
          <p className="text-xs text-warning-600 mt-1">
            復習で克服しよう！
          </p>
        </div>
      </div>
    </div>
  );
}
