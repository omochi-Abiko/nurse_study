// フラッシュカードデータ

export interface Flashcard {
  id: string;
  term: string;          // 用語（表面）
  reading?: string;      // 読み方
  definition: string;    // 意味（裏面）
  category: string;      // カテゴリID
  example?: string;      // 使用例
}

export interface FlashcardCategory {
  id: string;
  name: string;
  icon: string;
  color: "primary" | "secondary" | "warning" | "success" | "neutral";
  cards: Flashcard[];
}

// バイタルサイン略語
const vitalCards: Flashcard[] = [
  {
    id: "vital-1",
    term: "BP",
    reading: "ビーピー",
    definition: "Blood Pressure（血圧）",
    category: "vital",
    example: "BP 120/80mmHg",
  },
  {
    id: "vital-2",
    term: "HR",
    reading: "エイチアール",
    definition: "Heart Rate（心拍数）",
    category: "vital",
    example: "HR 72bpm",
  },
  {
    id: "vital-3",
    term: "SpO2",
    reading: "エスピーオーツー",
    definition: "経皮的動脈血酸素飽和度",
    category: "vital",
    example: "SpO2 98%",
  },
  {
    id: "vital-4",
    term: "RR",
    reading: "アールアール",
    definition: "Respiratory Rate（呼吸数）",
    category: "vital",
    example: "RR 16回/分",
  },
  {
    id: "vital-5",
    term: "BT",
    reading: "ビーティー",
    definition: "Body Temperature（体温）",
    category: "vital",
    example: "BT 36.5℃",
  },
  {
    id: "vital-6",
    term: "PR",
    reading: "ピーアール",
    definition: "Pulse Rate（脈拍数）",
    category: "vital",
    example: "PR 80/分",
  },
  {
    id: "vital-7",
    term: "GCS",
    reading: "ジーシーエス",
    definition: "Glasgow Coma Scale（グラスゴー・コーマ・スケール）意識レベル評価",
    category: "vital",
    example: "GCS 15点（正常）",
  },
  {
    id: "vital-8",
    term: "JCS",
    reading: "ジェイシーエス",
    definition: "Japan Coma Scale（ジャパン・コーマ・スケール）日本の意識レベル評価",
    category: "vital",
    example: "JCS 0（清明）",
  },
];

// 検査略語
const labCards: Flashcard[] = [
  {
    id: "lab-1",
    term: "CBC",
    reading: "シービーシー",
    definition: "Complete Blood Count（全血球計算）血液一般検査",
    category: "lab",
  },
  {
    id: "lab-2",
    term: "BUN",
    reading: "バン",
    definition: "Blood Urea Nitrogen（血液尿素窒素）腎機能の指標",
    category: "lab",
    example: "BUN 15mg/dL",
  },
  {
    id: "lab-3",
    term: "Cr",
    reading: "クレアチニン",
    definition: "Creatinine（クレアチニン）腎機能の指標",
    category: "lab",
    example: "Cr 0.8mg/dL",
  },
  {
    id: "lab-4",
    term: "AST",
    reading: "エーエスティー",
    definition: "Aspartate Aminotransferase（アスパラギン酸アミノ基転移酵素）肝機能の指標",
    category: "lab",
  },
  {
    id: "lab-5",
    term: "ALT",
    reading: "エーエルティー",
    definition: "Alanine Aminotransferase（アラニンアミノ基転移酵素）肝機能の指標",
    category: "lab",
  },
  {
    id: "lab-6",
    term: "HbA1c",
    reading: "ヘモグロビンエーワンシー",
    definition: "糖化ヘモグロビン。過去1-2ヶ月の血糖コントロールの指標",
    category: "lab",
    example: "HbA1c 6.0%",
  },
  {
    id: "lab-7",
    term: "WBC",
    reading: "ダブリュービーシー",
    definition: "White Blood Cell（白血球数）感染や炎症の指標",
    category: "lab",
  },
  {
    id: "lab-8",
    term: "RBC",
    reading: "アールビーシー",
    definition: "Red Blood Cell（赤血球数）貧血の指標",
    category: "lab",
  },
  {
    id: "lab-9",
    term: "Hb",
    reading: "ヘモグロビン",
    definition: "Hemoglobin（ヘモグロビン）貧血の指標",
    category: "lab",
    example: "Hb 14g/dL",
  },
  {
    id: "lab-10",
    term: "CRP",
    reading: "シーアールピー",
    definition: "C-Reactive Protein（C反応性タンパク）炎症の指標",
    category: "lab",
  },
];

// 医療用語
const medicalCards: Flashcard[] = [
  {
    id: "med-1",
    term: "浮腫",
    reading: "ふしゅ",
    definition: "組織間液が異常に増加した状態。むくみのこと。",
    category: "medical",
    example: "下肢に浮腫がみられる",
  },
  {
    id: "med-2",
    term: "頻脈",
    reading: "ひんみゃく",
    definition: "心拍数が100回/分以上の状態",
    category: "medical",
  },
  {
    id: "med-3",
    term: "徐脈",
    reading: "じょみゃく",
    definition: "心拍数が60回/分未満の状態",
    category: "medical",
  },
  {
    id: "med-4",
    term: "チアノーゼ",
    reading: "ちあのーぜ",
    definition: "皮膚や粘膜が青紫色になる状態。酸素不足のサイン。",
    category: "medical",
  },
  {
    id: "med-5",
    term: "呼吸困難",
    reading: "こきゅうこんなん",
    definition: "息苦しさを感じる状態。主観的な症状。",
    category: "medical",
  },
  {
    id: "med-6",
    term: "嚥下",
    reading: "えんげ",
    definition: "飲み込むこと。食べ物を口から胃に送る動作。",
    category: "medical",
  },
  {
    id: "med-7",
    term: "誤嚥",
    reading: "ごえん",
    definition: "飲食物が誤って気道に入ること",
    category: "medical",
  },
  {
    id: "med-8",
    term: "褥瘡",
    reading: "じょくそう",
    definition: "長時間同じ姿勢でいることによる皮膚の壊死。床ずれ。",
    category: "medical",
  },
  {
    id: "med-9",
    term: "せん妄",
    reading: "せんもう",
    definition: "意識障害の一種。幻覚や興奮を伴う急性の精神状態の変化。",
    category: "medical",
  },
  {
    id: "med-10",
    term: "アナフィラキシー",
    reading: "あなふぃらきしー",
    definition: "重篤なアレルギー反応。血圧低下や呼吸困難を引き起こす。",
    category: "medical",
  },
];

// 薬の略語・投与経路
const drugCards: Flashcard[] = [
  {
    id: "drug-1",
    term: "IV",
    reading: "アイブイ",
    definition: "Intravenous（静脈内投与）点滴や静脈注射",
    category: "drug",
  },
  {
    id: "drug-2",
    term: "IM",
    reading: "アイエム",
    definition: "Intramuscular（筋肉内注射）",
    category: "drug",
  },
  {
    id: "drug-3",
    term: "SC / SQ",
    reading: "エスシー",
    definition: "Subcutaneous（皮下注射）",
    category: "drug",
  },
  {
    id: "drug-4",
    term: "PO",
    reading: "ピーオー",
    definition: "Per Os（経口投与）口から飲む薬",
    category: "drug",
  },
  {
    id: "drug-5",
    term: "PRN",
    reading: "ピーアールエヌ",
    definition: "Pro Re Nata（頓用）必要時に使用",
    category: "drug",
  },
  {
    id: "drug-6",
    term: "DIV",
    reading: "ディーアイブイ",
    definition: "Drip Infusion（点滴静注）",
    category: "drug",
  },
  {
    id: "drug-7",
    term: "q.d.",
    reading: "キューディー",
    definition: "1日1回投与",
    category: "drug",
  },
  {
    id: "drug-8",
    term: "b.i.d.",
    reading: "ビーアイディー",
    definition: "1日2回投与",
    category: "drug",
  },
  {
    id: "drug-9",
    term: "t.i.d.",
    reading: "ティーアイディー",
    definition: "1日3回投与",
    category: "drug",
  },
  {
    id: "drug-10",
    term: "NSAIDs",
    reading: "エヌセイズ",
    definition: "Non-Steroidal Anti-Inflammatory Drugs（非ステロイド性抗炎症薬）",
    category: "drug",
    example: "ロキソニン、イブプロフェン",
  },
];

// 看護用語
const nursingCards: Flashcard[] = [
  {
    id: "nurse-1",
    term: "ADL",
    reading: "エーディーエル",
    definition: "Activities of Daily Living（日常生活動作）",
    category: "nursing",
    example: "食事、排泄、入浴、移動など",
  },
  {
    id: "nurse-2",
    term: "QOL",
    reading: "キューオーエル",
    definition: "Quality of Life（生活の質）",
    category: "nursing",
  },
  {
    id: "nurse-3",
    term: "IC",
    reading: "アイシー",
    definition: "Informed Consent（インフォームド・コンセント）説明と同意",
    category: "nursing",
  },
  {
    id: "nurse-4",
    term: "DNR",
    reading: "ディーエヌアール",
    definition: "Do Not Resuscitate（蘇生処置拒否）心肺停止時に蘇生を行わない意思表示",
    category: "nursing",
  },
  {
    id: "nurse-5",
    term: "SOAP",
    reading: "ソープ",
    definition: "Subjective, Objective, Assessment, Plan（主観・客観・評価・計画）記録形式",
    category: "nursing",
  },
  {
    id: "nurse-6",
    term: "KT",
    reading: "ケーティー",
    definition: "体温（Körpertemperatur）のドイツ語由来の略語",
    category: "nursing",
  },
  {
    id: "nurse-7",
    term: "BS",
    reading: "ビーエス",
    definition: "Blood Sugar（血糖値）",
    category: "nursing",
    example: "BS 110mg/dL",
  },
  {
    id: "nurse-8",
    term: "NPO",
    reading: "エヌピーオー",
    definition: "Nil Per Os（絶飲食）口から何も摂取しないこと",
    category: "nursing",
  },
  {
    id: "nurse-9",
    term: "Fo",
    reading: "フォーリー",
    definition: "Foley catheter（フォーリーカテーテル）膀胱留置カテーテル",
    category: "nursing",
  },
  {
    id: "nurse-10",
    term: "NG",
    reading: "エヌジー",
    definition: "Nasogastric（経鼻胃管）鼻から胃に入れるチューブ",
    category: "nursing",
  },
  {
    id: "nurse-11",
    term: "CPR",
    reading: "シーピーアール",
    definition: "Cardiopulmonary Resuscitation（心肺蘇生法）",
    category: "nursing",
  },
  {
    id: "nurse-12",
    term: "AED",
    reading: "エーイーディー",
    definition: "Automated External Defibrillator（自動体外式除細動器）",
    category: "nursing",
  },
];

// カテゴリ定義
export const flashcardCategories: FlashcardCategory[] = [
  {
    id: "vital",
    name: "バイタルサイン",
    icon: "💓",
    color: "primary",
    cards: vitalCards,
  },
  {
    id: "lab",
    name: "検査略語",
    icon: "🔬",
    color: "secondary",
    cards: labCards,
  },
  {
    id: "medical",
    name: "医療用語",
    icon: "📋",
    color: "warning",
    cards: medicalCards,
  },
  {
    id: "drug",
    name: "薬・投与",
    icon: "💊",
    color: "success",
    cards: drugCards,
  },
  {
    id: "nursing",
    name: "看護用語",
    icon: "🩺",
    color: "neutral",
    cards: nursingCards,
  },
];

// ヘルパー関数
export const getAllFlashcards = (): Flashcard[] => {
  return flashcardCategories.flatMap((cat) => cat.cards);
};

export const getFlashcardById = (id: string): Flashcard | undefined => {
  return getAllFlashcards().find((card) => card.id === id);
};

export const getFlashcardsByCategory = (categoryId: string): Flashcard[] => {
  const category = flashcardCategories.find((cat) => cat.id === categoryId);
  return category?.cards ?? [];
};

export const getCategoryById = (categoryId: string): FlashcardCategory | undefined => {
  return flashcardCategories.find((cat) => cat.id === categoryId);
};

export const TOTAL_FLASHCARDS = getAllFlashcards().length;

// シャッフル関数
export const shuffleCards = (cards: Flashcard[]): Flashcard[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
