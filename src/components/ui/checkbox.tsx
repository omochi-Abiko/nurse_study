"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function Checkbox({
  checked,
  onChange,
  children,
  className,
  disabled = false,
}: CheckboxProps) {
  const id = React.useId();

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center gap-3 py-3 px-4 cursor-pointer transition-colors tap-target",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={cn(
            "w-6 h-6 rounded-md border-2 transition-all duration-150 flex items-center justify-center",
            checked
              ? "bg-primary-500 border-primary-500"
              : "bg-white border-neutral-300 peer-hover:border-neutral-400"
          )}
        >
          <Check
            className={cn(
              "h-4 w-4 text-white transition-transform duration-150",
              checked ? "scale-100" : "scale-0"
            )}
            strokeWidth={3}
          />
        </div>
      </div>
      <span
        className={cn(
          "text-base transition-colors",
          checked ? "text-neutral-600 line-through" : "text-neutral-800"
        )}
      >
        {children}
      </span>
    </label>
  );
}
