"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ChevronRight, Check, Sparkles } from "lucide-react";

const cardVariants = cva(
  "rounded-2xl p-5 transition-all duration-200 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-white shadow-card",
        interactive:
          "bg-white shadow-card hover:shadow-lg hover:-translate-y-0.5 cursor-pointer active:scale-[0.98]",
        completed: "bg-gradient-to-br from-primary-50 to-primary-100/50 border border-primary-200",
        muted: "bg-neutral-100",
        // 新しいグラデーションバリアント
        gradient: "bg-gradient-to-br shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer active:scale-[0.98]",
        glass: "bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer",
      },
      colorScheme: {
        primary: "",
        secondary: "",
        success: "",
        warning: "",
        neutral: "",
      },
    },
    compoundVariants: [
      {
        variant: "gradient",
        colorScheme: "primary",
        className: "from-primary-500 to-primary-600 text-white",
      },
      {
        variant: "gradient",
        colorScheme: "secondary",
        className: "from-secondary-400 to-secondary-500 text-white",
      },
      {
        variant: "gradient",
        colorScheme: "success",
        className: "from-success-400 to-success-500 text-white",
      },
    ],
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, colorScheme, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, colorScheme, className }))}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

// 大きなフィーチャーカード用
interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: string;
  completed?: boolean;
  variant?: "primary" | "secondary" | "neutral" | "accent";
  badge?: string;
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, icon, title, description, action, completed, variant = "primary", badge, ...props }, ref) => {
    const gradients = {
      primary: "from-primary-500 to-primary-600",
      secondary: "from-secondary-400 to-secondary-500",
      neutral: "from-neutral-600 to-neutral-700",
      accent: "from-primary-400 via-secondary-400 to-warning-400",
    };

    const iconBgs = {
      primary: "bg-primary-400/30",
      secondary: "bg-secondary-300/30",
      neutral: "bg-neutral-500/30",
      accent: "bg-white/20",
    };

    if (completed) {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-2xl p-5 relative overflow-hidden",
            "bg-gradient-to-br from-success-50 to-success-100/50",
            "border-2 border-success-200",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-success-100 flex items-center justify-center">
              <Check className="h-7 w-7 text-success-600" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-success-700">{title}</h3>
              <p className="text-sm text-success-600 mt-0.5">{description}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-success-500 flex items-center justify-center">
              <Check className="h-5 w-5 text-white" strokeWidth={3} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-5 relative overflow-hidden",
          "bg-gradient-to-br text-white",
          gradients[variant],
          "shadow-lg hover:shadow-xl hover:-translate-y-0.5",
          "cursor-pointer active:scale-[0.98]",
          "transition-all duration-200",
          className
        )}
        {...props}
      >
        {/* 装飾用の背景パターン */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className="absolute top-2 right-2 w-20 h-20 rounded-full border-4 border-white" />
          <div className="absolute top-6 right-6 w-12 h-12 rounded-full border-4 border-white" />
        </div>

        {badge && (
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
            {badge}
          </div>
        )}

        <div className="flex items-center gap-4 relative z-10">
          <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center", iconBgs[variant])}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm opacity-90 mt-0.5">{description}</p>
          </div>
          {action && (
            <div className="flex items-center gap-1 text-sm font-medium opacity-90">
              <span>{action}</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    );
  }
);
FeatureCard.displayName = "FeatureCard";

// シンプルなアクションカード
interface ActionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description?: string;
  iconBg?: string;
}

const ActionCard = React.forwardRef<HTMLDivElement, ActionCardProps>(
  ({ className, icon, title, description, iconBg = "bg-primary-100", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl p-4 bg-white shadow-card",
          "hover:shadow-md hover:-translate-y-0.5",
          "cursor-pointer active:scale-[0.98]",
          "transition-all duration-200",
          "flex items-center gap-3",
          className
        )}
        {...props}
      >
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", iconBg)}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-neutral-800">{title}</h4>
          {description && (
            <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-neutral-400" />
      </div>
    );
  }
);
ActionCard.displayName = "ActionCard";

// 統計表示用カード
interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, icon, trend, trendValue, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl p-4 bg-white shadow-card text-center",
          className
        )}
        {...props}
      >
        {icon && (
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary-100 flex items-center justify-center">
            {icon}
          </div>
        )}
        <p className="text-2xl font-bold text-neutral-800">{value}</p>
        <p className="text-xs text-neutral-500 mt-1">{label}</p>
        {trend && trendValue && (
          <p className={cn(
            "text-xs mt-1 font-medium",
            trend === "up" ? "text-success-600" : trend === "down" ? "text-error-600" : "text-neutral-500"
          )}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </p>
        )}
      </div>
    );
  }
);
StatCard.displayName = "StatCard";

const CardIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-2xl mb-2", className)}
    {...props}
  />
));
CardIcon.displayName = "CardIcon";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold text-neutral-900", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-neutral-600 mt-1", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

interface CardActionProps extends React.HTMLAttributes<HTMLDivElement> {
  showArrow?: boolean;
}

const CardAction = React.forwardRef<HTMLDivElement, CardActionProps>(
  ({ className, showArrow = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end gap-1 mt-3 text-sm font-medium text-primary-600",
        className
      )}
      {...props}
    >
      {children}
      {showArrow && <ChevronRight className="h-4 w-4" />}
    </div>
  )
);
CardAction.displayName = "CardAction";

export {
  Card,
  CardIcon,
  CardTitle,
  CardDescription,
  CardAction,
  FeatureCard,
  ActionCard,
  StatCard,
};
