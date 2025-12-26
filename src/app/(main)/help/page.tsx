"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronDown, Stethoscope, Brain, ClipboardCheck, PenLine, BarChart3, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "毎日何問解けばいいの？",
    answer: "毎日3問だけでOK！継続することが大切だよ。スキマ時間に少しずつ進めていこう。",
  },
  {
    question: "苦手な問題はどうやって復習するの？",
    answer: "クイズで「あとで復習」ボタンを押すと復習リストに追加されるよ。復習タブから確認できます。また、分野別の成績も自動で分析されるので、苦手分野がわかりやすくなっています。",
  },
  {
    question: "SOAP記録の使い方は？",
    answer: "実習タブからSOAP記録を作成できます。テンプレートから選択すると、よくある症状の記録例が入力されるので、それをベースに編集してください。",
  },
  {
    question: "実習モードって何？",
    answer: "設定から実習モードをONにすると、ホーム画面に実習チェックリストが表示されます。実習の準備確認に使ってね。",
  },
  {
    question: "データはどこに保存されるの？",
    answer: "すべてのデータはあなたのスマートフォン内に保存されます。サーバーには送信されないので安心してね。ただし、アプリを削除するとデータも消えてしまうので注意！",
  },
  {
    question: "音声読み上げはどう使うの？",
    answer: "設定から音声読み上げをONにすると、クイズ画面で問題を読み上げてくれます。通学中や身支度中にハンズフリーで学習できるよ。",
  },
];

interface FeatureGuide {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const featureGuides: FeatureGuide[] = [
  {
    icon: <Stethoscope className="h-5 w-5" />,
    title: "今日の3問",
    description: "毎日3問のクイズで基礎知識を身につけよう",
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: "復習",
    description: "スワイプで苦手問題を効率的に復習",
  },
  {
    icon: <ClipboardCheck className="h-5 w-5" />,
    title: "実習チェック",
    description: "実習の準備漏れを防ぐチェックリスト",
  },
  {
    icon: <PenLine className="h-5 w-5" />,
    title: "1行ふりかえり",
    description: "今日の気持ちを記録して振り返ろう",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "週間サマリー",
    description: "1週間の学習状況をグラフで確認",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "SOAP記録",
    description: "テンプレートで実習記録を効率化",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

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
          <h1 className="font-semibold text-neutral-900">ヘルプ</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="pt-14 pb-8 screen-padding">
        {/* 機能ガイド */}
        <section className="mt-4 mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            機能ガイド
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {featureGuides.map((guide, index) => (
              <Card key={index} className="p-4">
                <div className="text-primary-500 mb-2">{guide.icon}</div>
                <h3 className="font-medium text-neutral-800 text-sm">
                  {guide.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {guide.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* よくある質問 */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            よくある質問
          </h2>
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-medium text-neutral-800 text-sm pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-neutral-400 transition-transform shrink-0",
                      openIndex === index && "rotate-180"
                    )}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 pt-0 animate-fade-in">
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* アプリ情報 */}
        <section className="mt-8 text-center">
          <p className="text-xs text-neutral-400">
            NurseStudy v1.0.0
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            © 2024 さいとうテックプラス
          </p>
        </section>
      </div>
    </div>
  );
}
