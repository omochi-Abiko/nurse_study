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

export interface TemplateGroup {
  id: string;
  name: string;
  icon: string;
  categories: TemplateCategory[];
}

// グループ化されたテンプレート
export const templateGroups: TemplateGroup[] = [
  {
    id: "report",
    name: "報告・申し送り",
    icon: "📢",
    categories: [
      {
        id: "sbar",
        name: "SBAR",
        templates: [
          {
            id: "sbar-s",
            title: "S: 状況（Situation）",
            content: "〇〇さんの担当の△△です。現在〜の状態です。",
          },
          {
            id: "sbar-b",
            title: "B: 背景（Background）",
            content: "〇〇の既往があり、昨日から〜の症状が見られています。",
          },
          {
            id: "sbar-a",
            title: "A: 評価（Assessment）",
            content: "〜と考えられます。/〜の可能性が考えられます。",
          },
          {
            id: "sbar-r",
            title: "R: 提案（Recommendation）",
            content: "〜を確認させてください。/〜の指示をいただきたいです。",
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
            content: "〇〇号室の△△さん、昨夜は〜でした。バイタルは〜、本日の予定は〜です。",
          },
          {
            id: "report-vital",
            title: "バイタル報告",
            content: "〇〇さんのバイタルを報告します。体温〜度、脈拍〜回/分、血圧〜mmHg、SpO2〜%です。",
          },
          {
            id: "report-change",
            title: "状態変化の報告",
            content: "〇〇さんですが、先ほどから〜の症状が見られています。すぐに確認していただけますか。",
          },
          {
            id: "report-complete",
            title: "ケア完了報告",
            content: "〇〇さんの△△ケアが終了しました。特に問題なく実施できました。/〜の点が気になりました。",
          },
        ],
      },
    ],
  },
  {
    id: "patient",
    name: "患者さんと話す",
    icon: "👤",
    categories: [
      {
        id: "patient",
        name: "患者対応",
        templates: [
          {
            id: "patient-intro",
            title: "自己紹介",
            content: "おはようございます/こんにちは。本日担当させていただきます、看護学生の〇〇です。よろしくお願いします。",
          },
          {
            id: "patient-vital",
            title: "バイタル測定時",
            content: "〇〇さん、今から体温と血圧を測らせていただいてもよろしいですか。",
          },
          {
            id: "patient-care",
            title: "ケア実施時",
            content: "〇〇さん、今から△△をさせていただきます。何か気になることがあればおっしゃってくださいね。",
          },
          {
            id: "patient-pain",
            title: "痛みの確認",
            content: "痛みはありますか？0が全く痛くない、10が今まで一番痛いとすると、今はどのくらいですか。",
          },
          {
            id: "patient-thanks",
            title: "終了時",
            content: "ありがとうございました。何かあればナースコールを押してくださいね。",
          },
        ],
      },
      {
        id: "greeting",
        name: "挨拶・マナー",
        templates: [
          {
            id: "greeting-morning",
            title: "朝の挨拶",
            content: "おはようございます。本日もよろしくお願いいたします。",
          },
          {
            id: "greeting-leave",
            title: "帰りの挨拶",
            content: "本日はありがとうございました。明日もよろしくお願いいたします。",
          },
          {
            id: "greeting-phone",
            title: "電話対応",
            content: "お電話ありがとうございます。〇〇病棟、看護学生の△△です。少々お待ちください。",
          },
          {
            id: "greeting-ns",
            title: "ナースステーション入室",
            content: "失礼します。/お疲れ様です。",
          },
          {
            id: "greeting-room",
            title: "病室入室",
            content: "失礼します。〇〇さん、入ってもよろしいですか。",
          },
        ],
      },
    ],
  },
  {
    id: "trouble",
    name: "困った時・注意された時",
    icon: "😰",
    categories: [
      {
        id: "trouble",
        name: "困った時",
        templates: [
          {
            id: "trouble-unknown",
            title: "わからない時",
            content: "すみません、〜について教えていただけますか。/確認させてください。",
          },
          {
            id: "trouble-mistake",
            title: "ミスをした時",
            content: "すみません、〜をしてしまいました。すぐに〜を確認します。今後は〜に気をつけます。",
          },
          {
            id: "trouble-busy",
            title: "忙しそうな時",
            content: "お忙しいところすみません。〇〇の件で報告があります。今よろしいですか？",
          },
          {
            id: "trouble-refuse",
            title: "患者に断られた時",
            content: "そうですか、わかりました。また後でお声がけしますね。/何か気になることはありますか？",
          },
          {
            id: "trouble-angry",
            title: "患者が怒っている時",
            content: "ご不快な思いをさせてしまい申し訳ありません。〜についてですね。確認してまいります。",
          },
          {
            id: "trouble-cry",
            title: "患者が泣いている時",
            content: "つらいですよね。少しお話を聞かせていただいてもいいですか。/そばにいますね。",
          },
          {
            id: "trouble-family",
            title: "家族対応",
            content: "ご面会ありがとうございます。〇〇さんの担当の看護学生です。何かご質問があれば看護師に確認いたします。",
          },
          {
            id: "trouble-emergency",
            title: "急変時",
            content: "〇〇さんの様子がおかしいです！すぐに来てください！/意識がありません！",
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
            content: "申し訳ありません。確認させてください、〜ということでしょうか。",
          },
        ],
      },
    ],
  },
  {
    id: "record",
    name: "記録・発表",
    icon: "📝",
    categories: [
      {
        id: "record",
        name: "記録の書き方",
        templates: [
          {
            id: "record-s",
            title: "S（主観的情報）の書き方",
            content: "患者さんの言葉をそのまま「」で記載。例：「お腹が痛い」「昨夜は眠れなかった」",
          },
          {
            id: "record-o",
            title: "O（客観的情報）の書き方",
            content: "観察・測定した事実を記載。例：体温37.5℃、創部発赤(-)、食事摂取量8割",
          },
          {
            id: "record-a",
            title: "A（アセスメント）の書き方",
            content: "SとOから導いた判断・解釈を記載。例：〜を認める。〜のリスクがある。〜と考えられる。",
          },
          {
            id: "record-p",
            title: "P（計画）の書き方",
            content: "具体的なケア・観察計画を記載。例：2時間ごとに体位変換。水分摂取を促す。〜時に再評価。",
          },
          {
            id: "record-daily",
            title: "日々の記録の書き出し",
            content: "本日は〇〇のケアを中心に関わった。〇〇さんは〜の状態であり、〜を実施した。",
          },
          {
            id: "record-reflect",
            title: "振り返りの書き方",
            content: "〜を学んだ。〜がうまくいった/いかなかった。次回は〜を意識して取り組みたい。",
          },
        ],
      },
      {
        id: "conference",
        name: "カンファレンス",
        templates: [
          {
            id: "conference-intro",
            title: "発表の導入",
            content: "〇〇号室の△△さんについて発表します。〇歳、△△の診断で入院中です。",
          },
          {
            id: "conference-issue",
            title: "課題提起",
            content: "本日の課題は「〜」についてです。〇〇さんの場合、〜という問題がありました。",
          },
          {
            id: "conference-consider",
            title: "考察",
            content: "〜と考えました。理由としては、〜があげられます。文献によると〜とされています。",
          },
          {
            id: "conference-plan",
            title: "今後の計画",
            content: "今後は〜を目標に、〜のケアを実施していきたいと考えています。",
          },
          {
            id: "conference-question",
            title: "質問への回答",
            content: "ご質問ありがとうございます。その点については〜と考えています。/確認して次回報告させてください。",
          },
        ],
      },
    ],
  },
];

// 後方互換性のため、グループからフラットなカテゴリリストを生成
export const templateCategories: TemplateCategory[] = templateGroups.flatMap(
  (group) => group.categories
);

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
