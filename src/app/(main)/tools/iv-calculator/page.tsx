"use client";

import * as React from "react";
import Link from "next/link";
import {
  calculateIV,
  IVSetType,
  VOLUME_PRESETS,
  TIME_PRESETS,
  DROP_FACTORS,
} from "@/lib/iv-calculator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, Droplets, Clock, Calculator, Info } from "lucide-react";

export default function IVCalculatorPage() {
  const [volume, setVolume] = React.useState<number>(500);
  const [hours, setHours] = React.useState<number>(2);
  const [minutes, setMinutes] = React.useState<number>(0);
  const [setType, setSetType] = React.useState<IVSetType>("adult");

  const result = React.useMemo(() => {
    return calculateIV({ volume, hours, minutes, setType });
  }, [volume, hours, minutes, setType]);

  return (
    <div className="min-h-screen pb-8">
      {/* ヘッダー */}
      <header className="bg-white border-b border-neutral-100 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 -ml-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-neutral-900">点滴計算</h1>
            <p className="text-xs text-neutral-500">
              滴下数・投与速度を計算
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-6">
        {/* 点滴セットの種類 */}
        <section className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Droplets className="h-5 w-5 text-primary-500" />
            <h2 className="font-medium text-neutral-900">点滴セットの種類</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSetType("adult")}
              className={cn(
                "p-3 rounded-lg border-2 transition-all text-left",
                setType === "adult"
                  ? "border-primary-500 bg-primary-50"
                  : "border-neutral-200 bg-white"
              )}
            >
              <p className="font-medium text-neutral-900">一般成人用</p>
              <p className="text-xs text-neutral-500">{DROP_FACTORS.adult}滴/mL</p>
            </button>
            <button
              onClick={() => setSetType("pediatric")}
              className={cn(
                "p-3 rounded-lg border-2 transition-all text-left",
                setType === "pediatric"
                  ? "border-primary-500 bg-primary-50"
                  : "border-neutral-200 bg-white"
              )}
            >
              <p className="font-medium text-neutral-900">小児・微量用</p>
              <p className="text-xs text-neutral-500">{DROP_FACTORS.pediatric}滴/mL</p>
            </button>
          </div>
        </section>

        {/* 輸液量 */}
        <section className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Droplets className="h-5 w-5 text-secondary-500" />
            <h2 className="font-medium text-neutral-900">輸液量</h2>
          </div>

          {/* プリセットボタン */}
          <div className="flex flex-wrap gap-2 mb-3">
            {VOLUME_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setVolume(preset.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-all",
                  volume === preset.value
                    ? "bg-secondary-500 text-white"
                    : "bg-secondary-50 text-secondary-700 hover:bg-secondary-100"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* カスタム入力 */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value) || 0)}
              min={1}
              max={10000}
              className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-lg font-medium text-center focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            />
            <span className="text-neutral-600 font-medium">mL</span>
          </div>
        </section>

        {/* 投与時間 */}
        <section className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-warning-500" />
            <h2 className="font-medium text-neutral-900">投与時間</h2>
          </div>

          {/* プリセットボタン */}
          <div className="flex flex-wrap gap-2 mb-3">
            {TIME_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setHours(preset.hours);
                  setMinutes(preset.minutes);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-all",
                  hours === preset.hours && minutes === preset.minutes
                    ? "bg-warning-500 text-white"
                    : "bg-warning-50 text-warning-700 hover:bg-warning-100"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* カスタム入力 */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-1">
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value) || 0)}
                min={0}
                max={99}
                className="w-16 px-2 py-2 border border-neutral-200 rounded-lg text-lg font-medium text-center focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
              />
              <span className="text-neutral-600">時間</span>
            </div>
            <div className="flex-1 flex items-center gap-1">
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value) || 0)}
                min={0}
                max={59}
                className="w-16 px-2 py-2 border border-neutral-200 rounded-lg text-lg font-medium text-center focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
              />
              <span className="text-neutral-600">分</span>
            </div>
          </div>
        </section>

        {/* 計算結果 */}
        {result && (
          <section className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg p-5 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5" />
              <h2 className="font-medium">計算結果</h2>
            </div>

            <div className="space-y-4">
              {/* メイン結果：滴下数 */}
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <p className="text-sm opacity-80 mb-1">滴下数</p>
                <p className="text-4xl font-bold">
                  {result.dropsPerMinute}
                  <span className="text-lg font-normal ml-1">滴/分</span>
                </p>
              </div>

              {/* サブ結果 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-xs opacity-70 mb-1">1滴あたり</p>
                  <p className="text-xl font-bold">
                    {result.secondsPerDrop}
                    <span className="text-sm font-normal ml-1">秒</span>
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-xs opacity-70 mb-1">1時間あたり</p>
                  <p className="text-xl font-bold">
                    {result.mlPerHour}
                    <span className="text-sm font-normal ml-1">mL</span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 計算式の説明 */}
        <section className="bg-neutral-50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
              <Info className="h-4 w-4 text-neutral-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">計算式</p>
              <div className="text-xs text-neutral-600 space-y-1">
                <p>滴下数（滴/分）= 輸液量(mL) × 滴下係数 ÷ 時間(分)</p>
                <p className="text-neutral-500">
                  ・一般成人用セット: 20滴/mL
                </p>
                <p className="text-neutral-500">
                  ・小児・微量用セット: 60滴/mL
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
