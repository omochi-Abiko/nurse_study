"use client";

import * as React from "react";
import Link from "next/link";
import { useAppStore } from "@/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, Volume2, Users, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const isPracticumMode = useAppStore((state) => state.isPracticumMode);
  const togglePracticumMode = useAppStore((state) => state.togglePracticumMode);
  const examSettings = useAppStore((state) => state.examSettings);
  const updateExamSettings = useAppStore((state) => state.updateExamSettings);
  const voiceSettings = useAppStore((state) => state.voiceSettings);
  const updateVoiceSettings = useAppStore((state) => state.updateVoiceSettings);
  const showToast = useAppStore((state) => state.showToast);

  const [examDate, setExamDate] = React.useState(examSettings?.examDate || "");

  const handleSaveExamDate = () => {
    if (examDate) {
      updateExamSettings({
        examDate,
        targetYear: new Date(examDate).getFullYear(),
      });
      showToast("success", "国試日付を保存しました");
    }
  };

  const handleClearData = () => {
    if (confirm("すべてのデータを削除しますか？この操作は取り消せません。")) {
      localStorage.clear();
      showToast("success", "データを削除しました");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-100">
        <div className="flex items-center justify-between px-4 h-14">
          <Link
            href="/"
            className="p-2 -ml-2 text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="font-semibold text-neutral-900">設定</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="pt-14 pb-8 screen-padding">
        <div className="space-y-6 mt-4">
          {/* 国試日付設定 */}
          <section>
            <h2 className="text-sm font-medium text-neutral-600 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              国試カウントダウン
            </h2>
            <Card className="p-4">
              <label className="block text-sm text-neutral-700 mb-2">
                国家試験日
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
                <Button variant="primary" onClick={handleSaveExamDate}>
                  保存
                </Button>
              </div>
              {examSettings?.examDate && (
                <p className="text-xs text-neutral-500 mt-2">
                  現在の設定: {examSettings.examDate}
                </p>
              )}
            </Card>
          </section>

          {/* 音声設定 */}
          <section>
            <h2 className="text-sm font-medium text-neutral-600 mb-3 flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              音声読み上げ
            </h2>
            <Card className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">読み上げ機能</span>
                <button
                  onClick={() =>
                    updateVoiceSettings({
                      enabled: !voiceSettings.enabled,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors ${
                    voiceSettings.enabled ? "bg-primary-500" : "bg-neutral-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      voiceSettings.enabled ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {voiceSettings.enabled && (
                <>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">
                      読み上げ速度
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={voiceSettings.rate}
                      onChange={(e) =>
                        updateVoiceSettings({
                          rate: parseFloat(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>遅い</span>
                      <span>{voiceSettings.rate}x</span>
                      <span>速い</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-700">自動再生</span>
                    <button
                      onClick={() =>
                        updateVoiceSettings({
                          autoPlay: !voiceSettings.autoPlay,
                        })
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        voiceSettings.autoPlay ? "bg-primary-500" : "bg-neutral-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          voiceSettings.autoPlay
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </>
              )}
            </Card>
          </section>

          {/* 実習モード */}
          <section>
            <h2 className="text-sm font-medium text-neutral-600 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              実習モード
            </h2>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-700">実習モード</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    実習チェックリストを表示
                  </p>
                </div>
                <button
                  onClick={togglePracticumMode}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isPracticumMode ? "bg-primary-500" : "bg-neutral-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      isPracticumMode ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </Card>
          </section>

          {/* データ削除 */}
          <section>
            <h2 className="text-sm font-medium text-neutral-600 mb-3 flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              データ管理
            </h2>
            <Card className="p-4">
              <p className="text-sm text-neutral-600 mb-3">
                すべての学習データを削除します。この操作は取り消せません。
              </p>
              <Button
                variant="ghost"
                onClick={handleClearData}
                className="text-error-600 hover:bg-error-50"
              >
                すべてのデータを削除
              </Button>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
