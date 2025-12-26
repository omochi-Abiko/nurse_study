// 実習テンプレート文章集

export interface Template {
  id: string;
  title: string;
  content: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  templates: Template[];
}

export const templateCategories: TemplateCategory[] = [
  {
    id: "sbar",
    name: "SBAR",
    templates: [
      {
        id: "sbar-s",
        title: "S: 状況（Situation）",
        content:
          "〇〇さんの担当の△△です。現在〜の状態です。",
      },
      {
        id: "sbar-b",
        title: "B: 背景（Background）",
        content:
          "〇〇の既往があり、昨日から〜の症状が見られています。",
      },
      {
        id: "sbar-a",
        title: "A: 評価（Assessment）",
        content: "〜と考えられます。/〜の可能性が考えられます。",
      },
      {
        id: "sbar-r",
        title: "R: 提案（Recommendation）",
        content:
          "〜を確認させてください。/〜の指示をいただきたいです。",
      },
    ],
  },
  {
    id: "report",
    name: "報告",
    templates: [
      {
        id: "report-morning",
        title: "朝の申し送り",
        content:
          "〇〇号室の△△さん、昨夜は〜でした。バイタルは〜、本日の予定は〜です。",
      },
      {
        id: "report-vital",
        title: "バイタル報告",
        content:
          "〇〇さんのバイタルを報告します。体温〜度、脈拍〜回/分、血圧〜mmHg、SpO2〜%です。",
      },
      {
        id: "report-change",
        title: "状態変化の報告",
        content:
          "〇〇さんですが、先ほどから〜の症状が見られています。すぐに確認していただけますか。",
      },
      {
        id: "report-complete",
        title: "ケア完了報告",
        content:
          "〇〇さんの△△ケアが終了しました。特に問題なく実施できました。/〜の点が気になりました。",
      },
    ],
  },
  {
    id: "attention",
    name: "注意された時",
    templates: [
      {
        id: "attention-apology",
        title: "謝罪",
        content: "すみません、確認不足でした。",
      },
      {
        id: "attention-next",
        title: "次回の改善",
        content: "次からは〜するようにします。",
      },
      {
        id: "attention-thanks",
        title: "感謝",
        content: "ご指導ありがとうございます。",
      },
      {
        id: "attention-ask",
        title: "確認",
        content:
          "申し訳ありません。確認させてください、〜ということでしょうか。",
      },
    ],
  },
  {
    id: "patient",
    name: "患者対応",
    templates: [
      {
        id: "patient-intro",
        title: "自己紹介",
        content:
          "おはようございます/こんにちは。本日担当させていただきます、看護学生の〇〇です。よろしくお願いします。",
      },
      {
        id: "patient-vital",
        title: "バイタル測定時",
        content:
          "〇〇さん、今から体温と血圧を測らせていただいてもよろしいですか。",
      },
      {
        id: "patient-care",
        title: "ケア実施時",
        content:
          "〇〇さん、今から△△をさせていただきます。何か気になることがあればおっしゃってくださいね。",
      },
      {
        id: "patient-pain",
        title: "痛みの確認",
        content:
          "痛みはありますか？0が全く痛くない、10が今まで一番痛いとすると、今はどのくらいですか。",
      },
      {
        id: "patient-thanks",
        title: "終了時",
        content:
          "ありがとうございました。何かあればナースコールを押してくださいね。",
      },
    ],
  },
];

export const defaultChecklist = [
  { id: "c1", text: "実習着", checked: false },
  { id: "c2", text: "名札", checked: false },
  { id: "c3", text: "聴診器", checked: false },
  { id: "c4", text: "ペンライト", checked: false },
  { id: "c5", text: "メモ帳", checked: false },
  { id: "c6", text: "実習記録", checked: false },
  { id: "c7", text: "印鑑", checked: false },
  { id: "c8", text: "時計", checked: false },
];
