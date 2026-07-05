"use client";

import * as React from "react";
import Link from "next/link";
import { useAppStore } from "@/store";
import { templateGroups } from "@/data/templates";
import { Segment } from "@/components/ui/segment";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Copy, Check, Settings, FileText, Building2, ChevronRight, ChevronDown } from "lucide-react";

type TabValue = "checklist" | "templates";

export default function PracticumPage() {
  const isPracticumMode = useAppStore((state) => state.isPracticumMode);
  const togglePracticumMode = useAppStore((state) => state.togglePracticumMode);
  const checklist = useAppStore((state) => state.checklist);
  const toggleChecklistItem = useAppStore((state) => state.toggleChecklistItem);
  const addChecklistItem = useAppStore((state) => state.addChecklistItem);
  const resetChecklist = useAppStore((state) => state.resetChecklist);
  const showToast = useAppStore((state) => state.showToast);
  const soapRecords = useAppStore((state) => state.soapRecords);
  const facilities = useAppStore((state) => state.facilities);

  const [tab, setTab] = React.useState<TabValue>("checklist");
  const [expandedGroup, setExpandedGroup] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [newItemText, setNewItemText] = React.useState("");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const allChecked = checklist.every((item) => item.checked);

  // 選択されたカテゴリを取得
  const currentCategory = React.useMemo(() => {
    if (!selectedCategory) return null;
    for (const group of templateGroups) {
      const found = group.categories.find((c) => c.id === selectedCategory);
      if (found) return found;
    }
    return null;
  }, [selectedCategory]);

  const handleAddItem = () => {
    if (newItemText.trim()) {
      addChecklistItem(newItemText.trim());
      setNewItemText("");
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast("success", "コピーしました");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast("warning", "コピーできませんでした");
    }
  };

  return (
    <div className="min-h-screen screen-padding pt-6">
      {/* ヘッダー */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-neutral-900">実習サポート</h1>
        <button
          onClick={togglePracticumMode}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
            isPracticumMode
              ? "bg-primary-100 text-primary-700"
              : "bg-neutral-100 text-neutral-600"
          )}
        >
          <Settings className="h-4 w-4" />
          {isPracticumMode ? "実習モードON" : "実習モードOFF"}
        </button>
      </header>

      {/* 実習サポートリンク */}
      <div className="space-y-3 mb-4">
        {/* SOAP記録リンク */}
        <Link
          href="/practicum/soap"
          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-card hover:bg-neutral-50 transition-colors"
        >
          <div className="p-2 bg-primary-100 rounded-lg">
            <FileText className="h-5 w-5 text-primary-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-neutral-800">SOAP記録</p>
            <p className="text-xs text-neutral-500">
              {soapRecords.length > 0
                ? `${soapRecords.length}件の記録`
                : "実習記録を作成"}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-neutral-400" />
        </Link>

        {/* 施設管理リンク */}
        <Link
          href="/practicum/facilities"
          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-card hover:bg-neutral-50 transition-colors"
        >
          <div className="p-2 bg-secondary-100 rounded-lg">
            <Building2 className="h-5 w-5 text-secondary-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-neutral-800">施設管理</p>
            <p className="text-xs text-neutral-500">
              {facilities.length > 0
                ? `${facilities.length}件の施設`
                : "施設別の注意事項を管理"}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-neutral-400" />
        </Link>
      </div>

      {/* タブ切り替え */}
      <Segment
        options={[
          { value: "checklist", label: "チェックリスト" },
          { value: "templates", label: "テンプレ文章" },
        ]}
        value={tab}
        onChange={(v) => setTab(v as TabValue)}
        className="mb-6"
      />

      {tab === "checklist" ? (
        <div>
          {/* ステータス */}
          {allChecked && (
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-4 text-center animate-fade-in">
              <p className="text-primary-700 font-medium">
                準備OK！いってらっしゃい 👋
              </p>
            </div>
          )}

          {/* チェックリスト */}
          <div className="bg-white rounded-xl shadow-card divide-y divide-neutral-100">
            {checklist.map((item) => (
              <Checkbox
                key={item.id}
                checked={item.checked}
                onChange={() => toggleChecklistItem(item.id)}
              >
                {item.text}
              </Checkbox>
            ))}
          </div>

          {/* 項目追加 */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="項目を追加..."
              className="flex-1 px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
            />
            <Button
              variant="secondary"
              size="icon"
              onClick={handleAddItem}
              disabled={!newItemText.trim()}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* リセットボタン */}
          <div className="mt-6 text-center">
            <button
              onClick={resetChecklist}
              className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              チェックをリセット
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* アコーディオン形式のグループ */}
          {templateGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl shadow-card overflow-hidden">
              {/* グループヘッダー */}
              <button
                onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors tap-target"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{group.icon}</span>
                  <div className="text-left">
                    <p className="font-medium text-neutral-900">{group.name}</p>
                    <p className="text-xs text-neutral-500">
                      {group.categories.map((c) => c.name).join(" / ")}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-neutral-400 transition-transform",
                    expandedGroup === group.id && "rotate-180"
                  )}
                />
              </button>

              {/* 展開時のコンテンツ */}
              {expandedGroup === group.id && (
                <div className="border-t border-neutral-100">
                  {/* サブカテゴリタブ */}
                  <div className="flex gap-2 p-3 bg-neutral-50 overflow-x-auto">
                    {group.categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(
                          selectedCategory === category.id ? null : category.id
                        )}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                          selectedCategory === category.id
                            ? "bg-primary-500 text-white"
                            : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                        )}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>

                  {/* テンプレート一覧 */}
                  {currentCategory && group.categories.some((c) => c.id === selectedCategory) && (
                    <div className="p-3 space-y-2">
                      {currentCategory.templates.map((template) => (
                        <div
                          key={template.id}
                          className="bg-neutral-50 rounded-lg p-3"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-medium text-neutral-800">
                              {template.title}
                            </h4>
                            <button
                              onClick={() => handleCopy(template.content, template.id)}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors tap-target flex-shrink-0",
                                copiedId === template.id
                                  ? "bg-success-100 text-success-600"
                                  : "bg-white text-neutral-500 hover:bg-neutral-100"
                              )}
                              aria-label="コピー"
                            >
                              {copiedId === template.id ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-neutral-600 leading-relaxed">
                            {template.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* カテゴリ未選択時のヒント */}
                  {!selectedCategory && (
                    <div className="p-4 text-center text-sm text-neutral-500">
                      上のボタンをタップしてテンプレートを表示
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
