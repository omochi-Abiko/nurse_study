"use client";

import * as React from "react";
import { SOAPRecord, SOAPTemplate } from "@/types";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Copy, FileText, ChevronDown } from "lucide-react";

interface SOAPFormProps {
  initialData?: Partial<SOAPRecord>;
  templates?: SOAPTemplate[];
  onSave: (data: Omit<SOAPRecord, "id" | "createdAt" | "updatedAt">) => void;
  onCancel?: () => void;
  className?: string;
}

export function SOAPForm({
  initialData,
  templates = [],
  onSave,
  onCancel,
  className,
}: SOAPFormProps) {
  const [date, setDate] = React.useState(
    initialData?.date || new Date().toISOString().split("T")[0]
  );
  const [patientId, setPatientId] = React.useState(initialData?.patientId || "");
  const [subjective, setSubjective] = React.useState(initialData?.subjective || "");
  const [objective, setObjective] = React.useState(initialData?.objective || "");
  const [assessment, setAssessment] = React.useState(initialData?.assessment || "");
  const [plan, setPlan] = React.useState(initialData?.plan || "");
  const [showTemplates, setShowTemplates] = React.useState(false);

  const handleApplyTemplate = (template: SOAPTemplate) => {
    setSubjective(template.subjective);
    setObjective(template.objective);
    setAssessment(template.assessment);
    setPlan(template.plan);
    setShowTemplates(false);
  };

  const handleSave = () => {
    onSave({
      date,
      patientId: patientId || undefined,
      subjective,
      objective,
      assessment,
      plan,
    });
  };

  const handleCopyAll = async () => {
    const text = `【SOAP記録】${date}
${patientId ? `患者: ${patientId}\n` : ""}
S（主観的データ）:
${subjective}

O（客観的データ）:
${objective}

A（アセスメント）:
${assessment}

P（計画）:
${plan}`;

    await navigator.clipboard.writeText(text);
  };

  const isValid = subjective.trim() || objective.trim() || assessment.trim() || plan.trim();

  return (
    <div className={cn("space-y-4", className)}>
      {/* 日付と患者ID */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            日付
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            患者ID（任意）
          </label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="A様"
            className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
          />
        </div>
      </div>

      {/* テンプレート選択 */}
      {templates.length > 0 && (
        <div>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
          >
            <FileText className="h-4 w-4" />
            テンプレートから入力
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                showTemplates && "rotate-180"
              )}
            />
          </button>
          {showTemplates && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleApplyTemplate(template)}
                  className="text-left p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
                >
                  <p className="text-sm font-medium text-neutral-800">
                    {template.name}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {template.category}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* S: 主観的データ */}
      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-1">
          <span className="text-primary-600 font-bold">S</span> 主観的データ（患者の訴え）
        </label>
        <textarea
          value={subjective}
          onChange={(e) => setSubjective(e.target.value)}
          placeholder="患者さんの訴えや症状を記載..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
        />
      </div>

      {/* O: 客観的データ */}
      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-1">
          <span className="text-primary-600 font-bold">O</span> 客観的データ（観察結果）
        </label>
        <textarea
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="バイタルサイン、観察結果を記載..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
        />
      </div>

      {/* A: アセスメント */}
      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-1">
          <span className="text-primary-600 font-bold">A</span> アセスメント
        </label>
        <textarea
          value={assessment}
          onChange={(e) => setAssessment(e.target.value)}
          placeholder="分析・評価を記載..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
        />
      </div>

      {/* P: 計画 */}
      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-1">
          <span className="text-primary-600 font-bold">P</span> 計画
        </label>
        <textarea
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          placeholder="看護計画を記載..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
        />
      </div>

      {/* ボタン */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="secondary"
          onClick={handleCopyAll}
          disabled={!isValid}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          コピー
        </Button>
        <div className="flex-1" />
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            キャンセル
          </Button>
        )}
        <Button variant="primary" onClick={handleSave} disabled={!isValid}>
          保存
        </Button>
      </div>
    </div>
  );
}

interface SOAPRecordCardProps {
  record: SOAPRecord;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function SOAPRecordCard({
  record,
  onEdit,
  onDelete,
  className,
}: SOAPRecordCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-card p-4 border border-neutral-100",
        className
      )}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <p className="font-medium text-neutral-800">
            {record.date}
            {record.patientId && (
              <span className="text-neutral-500 ml-2">{record.patientId}</span>
            )}
          </p>
          <p className="text-sm text-neutral-500 mt-0.5 line-clamp-1">
            {record.subjective || record.objective || "記録なし"}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-neutral-400 transition-transform",
            expanded && "rotate-180"
          )}
        />
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 text-sm border-t border-neutral-100 pt-4">
          {record.subjective && (
            <div>
              <p className="font-medium text-primary-600">S: 主観的データ</p>
              <p className="text-neutral-700 mt-1">{record.subjective}</p>
            </div>
          )}
          {record.objective && (
            <div>
              <p className="font-medium text-primary-600">O: 客観的データ</p>
              <p className="text-neutral-700 mt-1">{record.objective}</p>
            </div>
          )}
          {record.assessment && (
            <div>
              <p className="font-medium text-primary-600">A: アセスメント</p>
              <p className="text-neutral-700 mt-1">{record.assessment}</p>
            </div>
          )}
          {record.plan && (
            <div>
              <p className="font-medium text-primary-600">P: 計画</p>
              <p className="text-neutral-700 mt-1">{record.plan}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit}>
                編集
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete}>
                削除
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
