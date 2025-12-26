"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SegmentOption {
  value: string;
  label: string;
}

interface SegmentProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Segment({ options, value, onChange, className }: SegmentProps) {
  return (
    <div
      className={cn(
        "flex bg-neutral-100 rounded-lg p-1 gap-1",
        className
      )}
      role="tablist"
    >
      {options.map((option) => (
        <button
          key={option.value}
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-150 tap-target",
            value === option.value
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-600 hover:text-neutral-800"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
