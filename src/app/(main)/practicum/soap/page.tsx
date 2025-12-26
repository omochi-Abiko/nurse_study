"use client";

import * as React from "react";
import Link from "next/link";
import { useAppStore } from "@/store";
import { useSoapRecords } from "@/hooks/useApi";
import { soapTemplates } from "@/data/soap-templates";
import { SOAPForm, SOAPRecordCard } from "@/components/ui/soap-form";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Segment } from "@/components/ui/segment";
import { SOAPRecord } from "@/types";
import { ChevronLeft, Plus, FileText, Loader2 } from "lucide-react";

type TabValue = "new" | "history";

export default function SOAPPage() {
  // API hooks
  const { records: soapRecords, isLoading, createRecord, updateRecord, deleteRecord } = useSoapRecords();
  const showToast = useAppStore((state) => state.showToast);

  const [tab, setTab] = React.useState<TabValue>("new");
  const [editingRecord, setEditingRecord] = React.useState<SOAPRecord | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [recordToDelete, setRecordToDelete] = React.useState<string | null>(null);

  const handleSave = async (data: Omit<SOAPRecord, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingRecord) {
        await updateRecord(editingRecord.id, data);
        showToast("success", "記録を更新しました");
        setEditingRecord(null);
      } else {
        await createRecord(data);
        showToast("success", "記録を保存しました");
      }
      setTab("history");
    } catch {
      showToast("warning", "保存に失敗しました");
    }
  };

  const handleEdit = (record: SOAPRecord) => {
    setEditingRecord(record);
    setTab("new");
  };

  const handleDeleteConfirm = (id: string) => {
    setRecordToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (recordToDelete) {
      try {
        await deleteRecord(recordToDelete);
        showToast("success", "記録を削除しました");
        setRecordToDelete(null);
        setIsDeleteConfirmOpen(false);
      } catch {
        showToast("warning", "削除に失敗しました");
      }
    }
  };

  const handleCancel = () => {
    setEditingRecord(null);
  };

  // 日付でソート（新しい順）
  const sortedRecords = React.useMemo(() => {
    if (!soapRecords) return [];
    return [...soapRecords].sort(
      (a: SOAPRecord, b: SOAPRecord) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [soapRecords]);

  // ローディング中
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-100">
        <div className="flex items-center justify-between px-4 h-14">
          <Link
            href="/practicum"
            className="p-2 -ml-2 text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="font-semibold text-neutral-900">SOAP記録</h1>
          <div className="w-10" /> {/* スペーサー */}
        </div>
      </header>

      <div className="pt-14 pb-8 screen-padding">
        {/* タブ切り替え */}
        <Segment
          options={[
            { value: "new", label: editingRecord ? "編集中" : "新規作成" },
            { value: "history", label: `履歴 (${soapRecords.length})` },
          ]}
          value={tab}
          onChange={(v) => {
            setTab(v as TabValue);
            if (v === "history") {
              setEditingRecord(null);
            }
          }}
          className="mt-4 mb-6"
        />

        {tab === "new" ? (
          <div>
            {/* SOAP入力フォーム */}
            <SOAPForm
              initialData={editingRecord || undefined}
              templates={soapTemplates}
              onSave={handleSave}
              onCancel={editingRecord ? handleCancel : undefined}
            />
          </div>
        ) : (
          <div>
            {sortedRecords.length > 0 ? (
              <div className="space-y-3">
                {sortedRecords.map((record) => (
                  <SOAPRecordCard
                    key={record.id}
                    record={record}
                    onEdit={() => handleEdit(record)}
                    onDelete={() => handleDeleteConfirm(record.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 mb-4">まだ記録がありません</p>
                <Button
                  variant="secondary"
                  onClick={() => setTab("new")}
                  className="inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  最初の記録を作成
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 削除確認BottomSheet */}
      <BottomSheet
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="記録を削除しますか？"
      >
        <div className="space-y-4">
          <p className="text-neutral-600 text-sm">
            この操作は取り消せません。
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleDelete}
              className="bg-error-500 hover:bg-error-600"
            >
              削除する
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
