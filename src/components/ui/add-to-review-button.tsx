"use client";

import { useRef, useState } from "react";
import { BookmarkPlus, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AddToReviewButton({ onAdd }: { onAdd: () => void | Promise<void> }) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const locked = useRef(false);

  const handleClick = async () => {
    if (locked.current) return;
    locked.current = true;
    setStatus("saving");
    try {
      await onAdd();
      setStatus("saved");
    } catch {
      locked.current = false;
      setStatus("error");
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        aria-label={status === "saved" ? "復習に追加済み" : status === "saving" ? "追加中" : "あとで復習する"}
        onClick={handleClick}
        disabled={status === "saving" || status === "saved"}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 motion-safe:active:scale-95",
          status === "saved"
            ? "border-success-200 bg-success-50 text-success-700 motion-safe:animate-bounce-soft"
            : "border-transparent text-neutral-500 hover:bg-primary-50 hover:text-primary-600"
        )}
      >
        {status === "saved" ? <Check className="h-5 w-5" aria-hidden="true" /> :
          status === "saving" ? <Loader2 className="h-5 w-5 motion-safe:animate-spin" aria-hidden="true" /> :
          <BookmarkPlus className="h-5 w-5" aria-hidden="true" />}
        <span className="text-sm" role="status" aria-live="polite">
          {status === "saved" ? "復習に追加済み" : status === "saving" ? "追加中..." : "あとで復習する"}
        </span>
      </button>
      {status === "error" && <p role="alert" className="mt-2 text-center text-sm text-error-600">追加できませんでした。もう一度押してください。</p>}
    </div>
  );
}
