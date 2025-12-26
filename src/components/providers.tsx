"use client";

import * as React from "react";
import { useAppStore } from "@/store";
import { ToastContainer } from "@/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const toasts = useAppStore((state) => state.toasts);
  const removeToast = useAppStore((state) => state.removeToast);
  const initDailyQuiz = useAppStore((state) => state.initDailyQuiz);

  // アプリ起動時に今日のクイズを初期化
  React.useEffect(() => {
    initDailyQuiz();
  }, [initDailyQuiz]);

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
