"use client";

import * as React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import {
  Menu as MenuIcon,
  X,
  BarChart3,
  Camera,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
}

const menuItems: MenuItem[] = [
  {
    href: "/summary",
    icon: <BarChart3 className="h-5 w-5" />,
    label: "週間サマリー",
    description: "今週の学習を振り返る",
  },
  {
    href: "/notes",
    icon: <Camera className="h-5 w-5" />,
    label: "ノート",
    description: "写真メモを管理",
  },
  {
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    label: "設定",
    description: "国試日付・音声設定など",
  },
  {
    href: "/help",
    icon: <HelpCircle className="h-5 w-5" />,
    label: "ヘルプ",
    description: "使い方ガイド",
  },
];

interface MenuButtonProps {
  className?: string;
}

export function MenuButton({ className }: MenuButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const menuContent = (
    <div
      className={cn(
        "fixed inset-0 z-[70] transition-opacity duration-200",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Panel */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-xl transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h2 className="font-semibold text-neutral-900">メニュー</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-neutral-400 hover:text-neutral-600 transition-colors tap-target"
            aria-label="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <div className="text-primary-500">{item.icon}</div>
              <div className="flex-1">
                <p className="font-medium text-neutral-800">{item.label}</p>
                {item.description && (
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-300" />
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-100">
          <p className="text-xs text-neutral-400 text-center">
            NurseStudy v1.0.0
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 transition-colors text-base font-medium",
          className
        )}
        aria-label="メニューを開く"
      >
        <MenuIcon className="h-5 w-5" />
        <span>メニュー</span>
      </button>

      {mounted && createPortal(menuContent, document.body)}
    </>
  );
}
