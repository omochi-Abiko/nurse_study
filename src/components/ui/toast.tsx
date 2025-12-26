"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Check, Info, AlertCircle, X } from "lucide-react";

const toastVariants = cva(
  "flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-up",
  {
    variants: {
      variant: {
        success: "bg-primary-50 text-primary-700 border border-primary-200",
        info: "bg-secondary-50 text-secondary-700 border border-secondary-200",
        warning: "bg-warning-50 text-warning-700 border border-warning-200",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
);

const icons = {
  success: Check,
  info: Info,
  warning: AlertCircle,
};

interface ToastProps extends VariantProps<typeof toastVariants> {
  message: string;
  onClose?: () => void;
}

function Toast({ variant = "success", message, onClose }: ToastProps) {
  const Icon = icons[variant || "success"];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(toastVariants({ variant }))}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="text-sm font-medium flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-md transition-colors"
          aria-label="閉じる"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    variant: "success" | "info" | "warning";
    message: string;
  }>;
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            variant={toast.variant}
            message={toast.message}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>,
    document.body
  );
}

export { Toast, ToastContainer };
export type { ToastProps };
