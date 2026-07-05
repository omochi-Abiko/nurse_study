/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { useAppStore } from "@/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ChevronLeft, Camera, Plus, Image as ImageIcon, Trash2, Tag } from "lucide-react";

export default function NotesPage() {
  const photoNotes = useAppStore((state) => state.photoNotes);
  const addPhotoNote = useAppStore((state) => state.addPhotoNote);
  const deletePhotoNote = useAppStore((state) => state.deletePhotoNote);
  const showToast = useAppStore((state) => state.showToast);

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 画像をBase64に変換
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setIsAddOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (selectedImage) {
      const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
      addPhotoNote(selectedImage, title || undefined, tagList.length > 0 ? tagList : undefined);
      showToast("success", "写真メモを保存しました");
      setIsAddOpen(false);
      setSelectedImage(null);
      setTitle("");
      setTags("");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("この写真メモを削除しますか？")) {
      deletePhotoNote(id);
      showToast("success", "写真メモを削除しました");
    }
  };

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-100">
        <div className="flex items-center justify-between px-4 h-14">
          <Link
            href="/"
            className="p-2 -ml-2 text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="font-semibold text-neutral-900">ノート</h1>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 -mr-2 text-primary-500 hover:text-primary-700 transition-colors"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="pt-14 pb-8 screen-padding">
        {photoNotes.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {photoNotes.map((note) => (
              <Card key={note.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={note.imageData}
                    alt={note.title || "写真メモ"}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-3">
                  {note.title && (
                    <p className="text-sm font-medium text-neutral-800 line-clamp-1">
                      {note.title}
                    </p>
                  )}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {note.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-neutral-400 mt-1">
                    {new Date(note.createdAt).toLocaleDateString("ja-JP")}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
              <ImageIcon className="h-10 w-10 text-neutral-300" />
            </div>
            <h2 className="text-lg font-medium text-neutral-700 mb-2">
              写真メモがありません
            </h2>
            <p className="text-sm text-neutral-500 mb-6 max-w-[280px] mx-auto">
              教科書やノートを撮影して、いつでも振り返れるようにしよう
            </p>
            <Button
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              写真を撮る
            </Button>
          </div>
        )}
      </div>

      {/* 写真追加BottomSheet */}
      <BottomSheet
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setSelectedImage(null);
          setTitle("");
          setTags("");
        }}
        title="写真メモを追加"
      >
        <div className="space-y-4">
          {selectedImage && (
            <div className="aspect-video rounded-lg overflow-hidden bg-neutral-100">
              <img
                src={selectedImage}
                alt="プレビュー"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">
              タイトル（任意）
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 第5章 循環器系"
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">
              タグ（任意、カンマ区切り）
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="例: 循環器, バイタル"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setIsAddOpen(false);
                setSelectedImage(null);
                setTitle("");
                setTags("");
              }}
            >
              キャンセル
            </Button>
            <Button variant="primary" fullWidth onClick={handleSave}>
              保存
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
