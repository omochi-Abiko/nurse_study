"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  House,
  Stethoscope,
  Brain,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

interface TabItem {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

const tabs: TabItem[] = [
  { href: "/", icon: House, label: "ホーム" },
  { href: "/quiz", icon: Stethoscope, label: "クイズ" },
  { href: "/review", icon: Brain, label: "復習" },
  { href: "/practicum", icon: ClipboardList, label: "実習" },
];

export function TabBar() {
  const pathname = usePathname();

  // Quiz画面では非表示（集中モード）
  if (pathname.startsWith("/quiz/")) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href));
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-full transition-colors tap-target",
                isActive ? "text-primary-500" : "text-neutral-400"
              )}
            >
              <div className="relative">
                <Icon className="h-6 w-6" strokeWidth={1.5} />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-warning-500 text-white text-[10px] font-medium min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
