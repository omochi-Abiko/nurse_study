"use client";

import * as React from "react";
import Link from "next/link";
import { useAppStore } from "@/store";
import { useFacilities } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Facility, FacilityNote } from "@/types";
import {
  ChevronLeft,
  Plus,
  Building2,
  Trash2,
  AlertTriangle,
  Lightbulb,
  Info,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const noteCategories = [
  { value: "rule" as const, label: "ルール", icon: AlertTriangle, color: "text-warning-600" },
  { value: "tip" as const, label: "Tips", icon: Lightbulb, color: "text-primary-600" },
  { value: "warning" as const, label: "注意", icon: Info, color: "text-error-600" },
];

export default function FacilitiesPage() {
  // API hooks
  const {
    facilities,
    isLoading,
    createFacility,
    deleteFacility,
    addNote,
    deleteNote,
  } = useFacilities();
  const showToast = useAppStore((state) => state.showToast);

  const [isAddFacilityOpen, setIsAddFacilityOpen] = React.useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = React.useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = React.useState<string | null>(null);
  const [expandedFacilityId, setExpandedFacilityId] = React.useState<string | null>(null);

  // Form states
  const [facilityName, setFacilityName] = React.useState("");
  const [facilityAddress, setFacilityAddress] = React.useState("");
  const [noteContent, setNoteContent] = React.useState("");
  const [noteCategory, setNoteCategory] = React.useState<FacilityNote["category"]>("tip");

  const handleAddFacility = async () => {
    if (facilityName.trim()) {
      try {
        await createFacility(facilityName.trim(), facilityAddress.trim() || undefined);
        showToast("success", "施設を追加しました");
        setIsAddFacilityOpen(false);
        setFacilityName("");
        setFacilityAddress("");
      } catch {
        showToast("warning", "追加に失敗しました");
      }
    }
  };

  const handleDeleteFacility = async (id: string) => {
    if (confirm("この施設を削除しますか？")) {
      try {
        await deleteFacility(id);
        showToast("success", "施設を削除しました");
      } catch {
        showToast("warning", "削除に失敗しました");
      }
    }
  };

  const handleAddNote = async () => {
    if (selectedFacilityId && noteContent.trim()) {
      try {
        await addNote(selectedFacilityId, noteCategory, noteContent.trim());
        showToast("success", "メモを追加しました");
        setIsAddNoteOpen(false);
        setNoteContent("");
        setNoteCategory("tip");
      } catch {
        showToast("warning", "追加に失敗しました");
      }
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      showToast("success", "メモを削除しました");
    } catch {
      showToast("warning", "削除に失敗しました");
    }
  };

  const openAddNote = (facilityId: string) => {
    setSelectedFacilityId(facilityId);
    setIsAddNoteOpen(true);
  };

  // ローディング中
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-100">
        <div className="flex items-center justify-between px-4 h-14">
          <Link
            href="/practicum"
            className="p-2 -ml-2 text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="font-semibold text-neutral-900">実習施設</h1>
          <button
            onClick={() => setIsAddFacilityOpen(true)}
            className="p-2 -mr-2 text-primary-500 hover:text-primary-700 transition-colors"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </header>

      <div className="pt-14 pb-8 screen-padding">
        {facilities.length > 0 ? (
          <div className="space-y-4 mt-4">
            {facilities.map((facility: Facility) => (
              <Card key={facility.id} className="overflow-hidden">
                {/* 施設ヘッダー */}
                <button
                  onClick={() =>
                    setExpandedFacilityId(
                      expandedFacilityId === facility.id ? null : facility.id
                    )
                  }
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-800">{facility.name}</p>
                    {facility.address && (
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {facility.address}
                      </p>
                    )}
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {facility.notes.length}件のメモ
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-neutral-400 transition-transform",
                      expandedFacilityId === facility.id && "rotate-180"
                    )}
                  />
                </button>

                {/* 展開時の詳細 */}
                {expandedFacilityId === facility.id && (
                  <div className="border-t border-neutral-100 animate-fade-in">
                    {/* メモ一覧 */}
                    {facility.notes.length > 0 ? (
                      <div className="divide-y divide-neutral-100">
                        {facility.notes.map((note) => {
                          const categoryInfo = noteCategories.find(
                            (c) => c.value === note.category
                          );
                          const IconComponent = categoryInfo?.icon || Info;

                          return (
                            <div
                              key={note.id}
                              className="flex items-start gap-3 p-4"
                            >
                              <IconComponent
                                className={cn(
                                  "h-4 w-4 mt-0.5 shrink-0",
                                  categoryInfo?.color
                                )}
                              />
                              <p className="flex-1 text-sm text-neutral-700">
                                {note.content}
                              </p>
                              <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="p-1 text-neutral-400 hover:text-error-500 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="p-4 text-sm text-neutral-400 text-center">
                        まだメモがありません
                      </p>
                    )}

                    {/* アクションボタン */}
                    <div className="flex gap-2 p-4 pt-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openAddNote(facility.id)}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        メモ追加
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFacility(facility.id)}
                        className="text-error-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
              <Building2 className="h-10 w-10 text-neutral-300" />
            </div>
            <h2 className="text-lg font-medium text-neutral-700 mb-2">
              施設が登録されていません
            </h2>
            <p className="text-sm text-neutral-500 mb-6 max-w-[280px] mx-auto">
              実習先の施設を登録して、注意事項やTipsをメモしておこう
            </p>
            <Button
              variant="primary"
              onClick={() => setIsAddFacilityOpen(true)}
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              施設を追加
            </Button>
          </div>
        )}
      </div>

      {/* 施設追加BottomSheet */}
      <BottomSheet
        isOpen={isAddFacilityOpen}
        onClose={() => {
          setIsAddFacilityOpen(false);
          setFacilityName("");
          setFacilityAddress("");
        }}
        title="施設を追加"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">
              施設名 *
            </label>
            <input
              type="text"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              placeholder="○○総合病院"
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">
              住所（任意）
            </label>
            <input
              type="text"
              value={facilityAddress}
              onChange={(e) => setFacilityAddress(e.target.value)}
              placeholder="東京都○○区..."
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setIsAddFacilityOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleAddFacility}
              disabled={!facilityName.trim()}
            >
              追加
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* メモ追加BottomSheet */}
      <BottomSheet
        isOpen={isAddNoteOpen}
        onClose={() => {
          setIsAddNoteOpen(false);
          setNoteContent("");
          setNoteCategory("tip");
        }}
        title="メモを追加"
      >
        <div className="space-y-4">
          {/* カテゴリ選択 */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              種類
            </label>
            <div className="flex gap-2">
              {noteCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setNoteCategory(cat.value)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    noteCategory === cat.value
                      ? "bg-primary-100 text-primary-700"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  )}
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 内容 */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">
              内容 *
            </label>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="メモ内容を入力..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setIsAddNoteOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleAddNote}
              disabled={!noteContent.trim()}
            >
              追加
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
