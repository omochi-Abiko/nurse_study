"use client";

import * as React from "react";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { speechService } from "@/lib/speech";
import { useAppStore } from "@/store";

interface VoiceControlProps {
  onSpeak?: () => void;
  className?: string;
}

export function VoiceControl({ onSpeak, className }: VoiceControlProps) {
  const voiceSettings = useAppStore((state) => state.voiceSettings);
  const updateVoiceSettings = useAppStore((state) => state.updateVoiceSettings);

  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  // スピーキング状態を監視
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(speechService.isSpeaking());
      setIsPaused(speechService.isPaused());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleToggleVoice = () => {
    if (!voiceSettings.enabled) {
      updateVoiceSettings({ enabled: true });
      if (onSpeak) {
        onSpeak();
      }
    } else {
      speechService.stop();
      updateVoiceSettings({ enabled: false });
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      speechService.resume();
    } else {
      speechService.pause();
    }
  };

  const handleSpeak = () => {
    if (onSpeak) {
      onSpeak();
    }
  };

  if (!speechService.isAvailable()) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {voiceSettings.enabled && isSpeaking && (
        <button
          onClick={handlePauseResume}
          className="p-2 text-primary-500 hover:text-primary-700 transition-colors rounded-lg hover:bg-primary-50"
          aria-label={isPaused ? "再開" : "一時停止"}
        >
          {isPaused ? (
            <Play className="h-5 w-5" />
          ) : (
            <Pause className="h-5 w-5" />
          )}
        </button>
      )}

      {voiceSettings.enabled && !isSpeaking && onSpeak && (
        <button
          onClick={handleSpeak}
          className="p-2 text-primary-500 hover:text-primary-700 transition-colors rounded-lg hover:bg-primary-50"
          aria-label="読み上げ"
        >
          <Play className="h-5 w-5" />
        </button>
      )}

      <button
        onClick={handleToggleVoice}
        className={cn(
          "p-2 transition-colors rounded-lg",
          voiceSettings.enabled
            ? "text-primary-500 hover:text-primary-700 hover:bg-primary-50"
            : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
        )}
        aria-label={voiceSettings.enabled ? "音声OFF" : "音声ON"}
      >
        {voiceSettings.enabled ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

interface VoiceSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceSettingsSheet({ isOpen, onClose }: VoiceSettingsSheetProps) {
  const voiceSettings = useAppStore((state) => state.voiceSettings);
  const updateVoiceSettings = useAppStore((state) => state.updateVoiceSettings);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative w-full max-w-lg bg-white rounded-t-2xl p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          音声設定
        </h3>

        <div className="space-y-4">
          {/* 読み上げ機能ON/OFF */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700">読み上げ機能</span>
            <button
              onClick={() =>
                updateVoiceSettings({ enabled: !voiceSettings.enabled })
              }
              className={cn(
                "w-12 h-6 rounded-full transition-colors",
                voiceSettings.enabled ? "bg-primary-500" : "bg-neutral-300"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 bg-white rounded-full shadow-sm transition-transform",
                  voiceSettings.enabled ? "translate-x-6" : "translate-x-0.5"
                )}
              />
            </button>
          </div>

          {/* 読み上げ速度 */}
          {voiceSettings.enabled && (
            <>
              <div>
                <label className="block text-sm text-neutral-600 mb-2">
                  読み上げ速度: {voiceSettings.rate}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.rate}
                  onChange={(e) =>
                    updateVoiceSettings({ rate: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neutral-400 mt-1">
                  <span>遅い</span>
                  <span>速い</span>
                </div>
              </div>

              {/* 自動再生 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-700">自動再生</p>
                  <p className="text-xs text-neutral-500">
                    問題表示時に自動で読み上げ
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateVoiceSettings({ autoPlay: !voiceSettings.autoPlay })
                  }
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors",
                    voiceSettings.autoPlay ? "bg-primary-500" : "bg-neutral-300"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 bg-white rounded-full shadow-sm transition-transform",
                      voiceSettings.autoPlay ? "translate-x-6" : "translate-x-0.5"
                    )}
                  />
                </button>
              </div>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-medium hover:bg-neutral-200 transition-colors"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
