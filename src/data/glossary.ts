// 用語集データ

export interface GlossaryTerm {
  id: string;
  term: string;
  reading: string;           // ひらがな（検索・ソート用）
  definition: string;
  category: GlossaryCategory;
  relatedSkillIds?: string[]; // 関連スキルID
  tags?: string[];            // 検索用タグ
}

export type GlossaryCategory = "anatomy" | "vital" | "nursing" | "disease" | "drug";

// カテゴリ情報
export const glossaryCategoryInfo: Record<GlossaryCategory, { name: string; icon: string; color: string }> = {
  anatomy: { name: "解剖生理", icon: "🫀", color: "primary" },
  vital: { name: "バイタルサイン", icon: "💓", color: "secondary" },
  nursing: { name: "看護技術", icon: "🩺", color: "success" },
  disease: { name: "疾病・症状", icon: "🦠", color: "warning" },
  drug: { name: "薬理", icon: "💊", color: "neutral" },
};

// 用語データ
export const glossaryTerms: GlossaryTerm[] = [
  // ========================================
  // 解剖生理
  // ========================================
  {
    id: "glos-anat-1",
    term: "心臓",
    reading: "しんぞう",
    definition: "血液を全身に送り出すポンプの役割を持つ臓器。4つの部屋（右心房・右心室・左心房・左心室）に分かれている。",
    category: "anatomy",
    tags: ["循環器", "臓器"],
  },
  {
    id: "glos-anat-2",
    term: "肺",
    reading: "はい",
    definition: "呼吸によるガス交換を行う臓器。酸素を取り込み、二酸化炭素を排出する。左肺は2葉、右肺は3葉に分かれる。",
    category: "anatomy",
    tags: ["呼吸器", "臓器"],
  },
  {
    id: "glos-anat-3",
    term: "肝臓",
    reading: "かんぞう",
    definition: "人体最大の臓器。栄養素の代謝、解毒作用、胆汁の生成などを行う。右上腹部に位置する。",
    category: "anatomy",
    tags: ["消化器", "臓器", "代謝"],
  },
  {
    id: "glos-anat-4",
    term: "腎臓",
    reading: "じんぞう",
    definition: "血液をろ過して尿を生成する臓器。老廃物の排泄、電解質バランスの調整、血圧調節に関与する。",
    category: "anatomy",
    tags: ["泌尿器", "臓器", "ろ過"],
  },
  {
    id: "glos-anat-5",
    term: "膵臓",
    reading: "すいぞう",
    definition: "消化酵素を分泌する外分泌機能と、インスリンなどのホルモンを分泌する内分泌機能を持つ臓器。",
    category: "anatomy",
    tags: ["消化器", "臓器", "ホルモン"],
  },
  {
    id: "glos-anat-6",
    term: "動脈",
    reading: "どうみゃく",
    definition: "心臓から送り出される血液を運ぶ血管。通常は酸素を多く含む動脈血が流れる（肺動脈を除く）。",
    category: "anatomy",
    tags: ["循環器", "血管"],
  },
  {
    id: "glos-anat-7",
    term: "静脈",
    reading: "じょうみゃく",
    definition: "心臓に戻る血液を運ぶ血管。通常は二酸化炭素を多く含む静脈血が流れる（肺静脈を除く）。",
    category: "anatomy",
    tags: ["循環器", "血管"],
  },
  {
    id: "glos-anat-8",
    term: "毛細血管",
    reading: "もうさいけっかん",
    definition: "動脈と静脈をつなぐ最も細い血管。組織と血液の間で酸素・栄養素・老廃物の交換が行われる。",
    category: "anatomy",
    tags: ["循環器", "血管"],
  },
  {
    id: "glos-anat-9",
    term: "赤血球",
    reading: "せっけっきゅう",
    definition: "ヘモグロビンを含み、酸素を運搬する血球。成人の基準値は男性400〜550万/μL、女性350〜450万/μL。",
    category: "anatomy",
    tags: ["血液", "酸素"],
  },
  {
    id: "glos-anat-10",
    term: "白血球",
    reading: "はっけっきゅう",
    definition: "免疫機能を担う血球。細菌やウイルスなどの異物から体を守る。基準値は4,000〜9,000/μL。",
    category: "anatomy",
    tags: ["血液", "免疫"],
  },
  {
    id: "glos-anat-11",
    term: "血小板",
    reading: "けっしょうばん",
    definition: "止血に関与する血液成分。血管が損傷すると集まって血栓を形成する。基準値は15〜40万/μL。",
    category: "anatomy",
    tags: ["血液", "止血"],
  },
  {
    id: "glos-anat-12",
    term: "ヘモグロビン",
    reading: "へもぐろびん",
    definition: "赤血球に含まれる酸素運搬タンパク質。鉄を含み、酸素と結合する。基準値は男性13〜17g/dL、女性12〜16g/dL。",
    category: "anatomy",
    tags: ["血液", "酸素"],
  },
  {
    id: "glos-anat-13",
    term: "横隔膜",
    reading: "おうかくまく",
    definition: "胸腔と腹腔を隔てるドーム状の筋肉。呼吸運動に重要で、収縮すると下がって吸気が起こる。",
    category: "anatomy",
    tags: ["呼吸器", "筋肉"],
  },
  {
    id: "glos-anat-14",
    term: "延髄",
    reading: "えんずい",
    definition: "脳幹の一部で、呼吸・心拍・嚥下などの生命維持に必要な中枢がある。",
    category: "anatomy",
    tags: ["神経", "脳"],
  },
  {
    id: "glos-anat-15",
    term: "自律神経",
    reading: "じりつしんけい",
    definition: "内臓や血管などを無意識に調節する神経。交感神経と副交感神経に分かれる。",
    category: "anatomy",
    tags: ["神経"],
  },

  // ========================================
  // バイタルサイン
  // ========================================
  {
    id: "glos-vital-1",
    term: "バイタルサイン",
    reading: "ばいたるさいん",
    definition: "生命徴候。体温・脈拍・呼吸・血圧・意識レベルなど、生命活動を示す基本的な指標。",
    category: "vital",
    relatedSkillIds: ["vital-signs"],
    tags: ["測定"],
  },
  {
    id: "glos-vital-2",
    term: "脈拍",
    reading: "みゃくはく",
    definition: "心臓の拍動による動脈の拍動。成人の正常値は60〜100回/分。通常は橈骨動脈で測定する。",
    category: "vital",
    relatedSkillIds: ["vital-signs"],
    tags: ["測定", "循環器"],
  },
  {
    id: "glos-vital-3",
    term: "血圧",
    reading: "けつあつ",
    definition: "血液が血管壁を押す圧力。収縮期血圧（上）と拡張期血圧（下）で表す。正常値は120/80mmHg前後。",
    category: "vital",
    relatedSkillIds: ["vital-signs", "blood-pressure"],
    tags: ["測定", "循環器"],
  },
  {
    id: "glos-vital-4",
    term: "収縮期血圧",
    reading: "しゅうしゅくきけつあつ",
    definition: "心臓が収縮して血液を送り出す時の血圧。最高血圧とも呼ばれる。コロトコフ音が聞こえ始める点。",
    category: "vital",
    relatedSkillIds: ["blood-pressure"],
    tags: ["測定", "循環器"],
  },
  {
    id: "glos-vital-5",
    term: "拡張期血圧",
    reading: "かくちょうきけつあつ",
    definition: "心臓が拡張して血液を受け入れる時の血圧。最低血圧とも呼ばれる。コロトコフ音が消失する点。",
    category: "vital",
    relatedSkillIds: ["blood-pressure"],
    tags: ["測定", "循環器"],
  },
  {
    id: "glos-vital-6",
    term: "SpO2",
    reading: "えすぴーおーつー",
    definition: "経皮的動脈血酸素飽和度。パルスオキシメーターで測定する。正常値は96%以上。",
    category: "vital",
    relatedSkillIds: ["vital-signs"],
    tags: ["測定", "呼吸器"],
  },
  {
    id: "glos-vital-7",
    term: "頻脈",
    reading: "ひんみゃく",
    definition: "脈拍が正常より速い状態。成人では100回/分以上。発熱、脱水、心疾患などで起こる。",
    category: "vital",
    tags: ["異常", "循環器"],
  },
  {
    id: "glos-vital-8",
    term: "徐脈",
    reading: "じょみゃく",
    definition: "脈拍が正常より遅い状態。成人では60回/分未満。スポーツ選手や薬剤の影響で起こることがある。",
    category: "vital",
    tags: ["異常", "循環器"],
  },
  {
    id: "glos-vital-9",
    term: "頻呼吸",
    reading: "ひんこきゅう",
    definition: "呼吸数が正常より多い状態。成人では24回/分以上。発熱、呼吸器疾患、代謝異常などで起こる。",
    category: "vital",
    tags: ["異常", "呼吸器"],
  },
  {
    id: "glos-vital-10",
    term: "発熱",
    reading: "はつねつ",
    definition: "体温が正常範囲を超えて上昇した状態。一般的に37.5℃以上。感染症や炎症で起こることが多い。",
    category: "vital",
    tags: ["異常", "体温"],
  },
  {
    id: "glos-vital-11",
    term: "コロトコフ音",
    reading: "ころとこふおん",
    definition: "血圧測定時に聴診器で聞こえる音。動脈が圧迫から解放される際の血流音。",
    category: "vital",
    relatedSkillIds: ["blood-pressure"],
    tags: ["測定"],
  },

  // ========================================
  // 看護技術
  // ========================================
  {
    id: "glos-nurs-1",
    term: "褥瘡",
    reading: "じょくそう",
    definition: "長時間同じ姿勢でいることによる皮膚・組織の壊死。床ずれとも呼ばれる。好発部位は仙骨部。",
    category: "nursing",
    relatedSkillIds: ["positioning", "bed-making"],
    tags: ["皮膚", "予防"],
  },
  {
    id: "glos-nurs-2",
    term: "ボディメカニクス",
    reading: "ぼでぃめかにくす",
    definition: "体の動きの力学。患者の移動介助時に、重心を低く、支持基底面を広くとることで腰痛を予防する。",
    category: "nursing",
    relatedSkillIds: ["positioning"],
    tags: ["移動", "腰痛予防"],
  },
  {
    id: "glos-nurs-3",
    term: "仰臥位",
    reading: "ぎょうがい",
    definition: "あおむけの体位。背面を下にした姿勢。最も基本的な体位。",
    category: "nursing",
    relatedSkillIds: ["positioning"],
    tags: ["体位"],
  },
  {
    id: "glos-nurs-4",
    term: "側臥位",
    reading: "そくがい",
    definition: "横向きの体位。体圧分散や気道確保のために用いる。右側臥位と左側臥位がある。",
    category: "nursing",
    relatedSkillIds: ["positioning"],
    tags: ["体位"],
  },
  {
    id: "glos-nurs-5",
    term: "ファウラー位",
    reading: "ふぁうらーい",
    definition: "背もたれを45度程度起こした半座位。呼吸を楽にし、食事介助にも用いる。",
    category: "nursing",
    relatedSkillIds: ["positioning", "feeding"],
    tags: ["体位"],
  },
  {
    id: "glos-nurs-6",
    term: "清拭",
    reading: "せいしき",
    definition: "入浴できない患者の皮膚を温かいタオルで拭いて清潔を保つ技術。清潔→不潔の方向に行う。",
    category: "nursing",
    relatedSkillIds: ["bed-bath"],
    tags: ["清潔", "ケア"],
  },
  {
    id: "glos-nurs-7",
    term: "陰部洗浄",
    reading: "いんぶせんじょう",
    definition: "陰部を洗浄して清潔を保つケア。感染予防と皮膚トラブル予防のために行う。",
    category: "nursing",
    relatedSkillIds: ["bed-bath"],
    tags: ["清潔", "ケア"],
  },
  {
    id: "glos-nurs-8",
    term: "誤嚥",
    reading: "ごえん",
    definition: "食物や唾液が気管に入ってしまうこと。誤嚥性肺炎の原因となる。",
    category: "nursing",
    relatedSkillIds: ["feeding", "oral-care"],
    tags: ["食事", "リスク"],
  },
  {
    id: "glos-nurs-9",
    term: "口腔ケア",
    reading: "こうくうけあ",
    definition: "口の中を清潔に保つケア。誤嚥性肺炎の予防に重要。意識レベルや嚥下機能に応じて方法を選択。",
    category: "nursing",
    relatedSkillIds: ["oral-care"],
    tags: ["清潔", "感染予防"],
  },
  {
    id: "glos-nurs-10",
    term: "標準予防策",
    reading: "ひょうじゅんよぼうさく",
    definition: "スタンダードプリコーション。感染症の有無に関わらず全ての患者に適用する基本的な感染対策。",
    category: "nursing",
    relatedSkillIds: ["hand-hygiene", "infection-control"],
    tags: ["感染予防"],
  },
  {
    id: "glos-nurs-11",
    term: "PPE",
    reading: "ぴーぴーいー",
    definition: "個人防護具。手袋・ガウン・マスク・ゴーグルなど。着脱の順序が重要。",
    category: "nursing",
    relatedSkillIds: ["infection-control"],
    tags: ["感染予防", "防護具"],
  },
  {
    id: "glos-nurs-12",
    term: "SOAP",
    reading: "そーぷ",
    definition: "看護記録の形式。主観的データ(S)・客観的データ(O)・アセスメント(A)・計画(P)で構成。",
    category: "nursing",
    relatedSkillIds: ["documentation"],
    tags: ["記録"],
  },
  {
    id: "glos-nurs-13",
    term: "アセスメント",
    reading: "あせすめんと",
    definition: "収集した情報を分析・解釈し、患者の状態や問題を判断すること。看護過程の重要なステップ。",
    category: "nursing",
    relatedSkillIds: ["nursing-process"],
    tags: ["看護過程"],
  },
  {
    id: "glos-nurs-14",
    term: "インフォームドコンセント",
    reading: "いんふぉーむどこんせんと",
    definition: "説明と同意。患者が十分な説明を受けた上で、治療やケアに同意すること。患者の自己決定権を尊重。",
    category: "nursing",
    relatedSkillIds: ["communication"],
    tags: ["倫理", "権利"],
  },
  {
    id: "glos-nurs-15",
    term: "バイタルサインの測定順序",
    reading: "ばいたるさいんのそくていじゅんじょ",
    definition: "一般的に体温→脈拍→呼吸→血圧の順。呼吸は患者に意識させないよう脈拍測定に続けて行う。",
    category: "nursing",
    relatedSkillIds: ["vital-signs"],
    tags: ["測定", "手順"],
  },

  // ========================================
  // 疾病・症状
  // ========================================
  {
    id: "glos-dis-1",
    term: "炎症",
    reading: "えんしょう",
    definition: "組織の損傷に対する防御反応。5徴候は発赤・熱感・腫脹・疼痛・機能障害。",
    category: "disease",
    tags: ["症状", "免疫"],
  },
  {
    id: "glos-dis-2",
    term: "感染",
    reading: "かんせん",
    definition: "病原体が体内に侵入し、増殖すること。接触・飛沫・空気・血液などの経路がある。",
    category: "disease",
    tags: ["原因", "感染経路"],
  },
  {
    id: "glos-dis-3",
    term: "浮腫",
    reading: "ふしゅ",
    definition: "組織間隙に過剰な水分が貯留した状態。むくみとも呼ばれる。心不全や腎不全で起こりやすい。",
    category: "disease",
    tags: ["症状"],
  },
  {
    id: "glos-dis-4",
    term: "チアノーゼ",
    reading: "ちあのーぜ",
    definition: "皮膚や粘膜が青紫色になる症状。血中の酸素不足（低酸素血症）により起こる。",
    category: "disease",
    tags: ["症状", "低酸素"],
  },
  {
    id: "glos-dis-5",
    term: "黄疸",
    reading: "おうだん",
    definition: "皮膚や眼球結膜が黄色くなる症状。血中ビリルビンの上昇による。肝疾患で起こりやすい。",
    category: "disease",
    tags: ["症状", "肝臓"],
  },
  {
    id: "glos-dis-6",
    term: "貧血",
    reading: "ひんけつ",
    definition: "ヘモグロビン濃度が低下した状態。倦怠感、動悸、息切れ、顔面蒼白などの症状が出る。",
    category: "disease",
    tags: ["症状", "血液"],
  },
  {
    id: "glos-dis-7",
    term: "脱水",
    reading: "だっすい",
    definition: "体内の水分が不足した状態。口渇、皮膚の乾燥、尿量減少、頻脈などの症状が出る。",
    category: "disease",
    tags: ["症状", "体液"],
  },
  {
    id: "glos-dis-8",
    term: "ショック",
    reading: "しょっく",
    definition: "循環不全により組織への酸素供給が不足した状態。血圧低下、頻脈、冷汗、意識障害が起こる。",
    category: "disease",
    tags: ["症状", "緊急"],
  },
  {
    id: "glos-dis-9",
    term: "アナフィラキシー",
    reading: "あなふぃらきしー",
    definition: "急性のアレルギー反応。呼吸困難、血圧低下、蕁麻疹などが起こる。輸血や薬剤投与後に注意。",
    category: "disease",
    tags: ["アレルギー", "緊急"],
  },
  {
    id: "glos-dis-10",
    term: "糖尿病",
    reading: "とうにょうびょう",
    definition: "インスリンの作用不足により血糖値が高くなる疾患。高血糖と低血糖の症状を理解することが重要。",
    category: "disease",
    tags: ["疾患", "代謝"],
  },

  // ========================================
  // 薬理
  // ========================================
  {
    id: "glos-drug-1",
    term: "副作用",
    reading: "ふくさよう",
    definition: "薬の本来の目的以外の作用。すべての薬には副作用の可能性がある。観察と報告が重要。",
    category: "drug",
    tags: ["注意"],
  },
  {
    id: "glos-drug-2",
    term: "禁忌",
    reading: "きんき",
    definition: "その薬を使用してはいけない状態や条件。アレルギーや特定の疾患がある場合など。",
    category: "drug",
    tags: ["注意"],
  },
  {
    id: "glos-drug-3",
    term: "6R",
    reading: "ろくあーる",
    definition: "与薬の安全確認事項。正しい患者(Right patient)・薬(drug)・量(dose)・経路(route)・時間(time)・目的(reason)。",
    category: "drug",
    relatedSkillIds: ["pharmacology"],
    tags: ["安全", "確認"],
  },
  {
    id: "glos-drug-4",
    term: "経口投与",
    reading: "けいこうとうよ",
    definition: "薬を口から飲む投与方法。最も一般的で安全な投与経路。消化管から吸収される。",
    category: "drug",
    tags: ["投与経路"],
  },
  {
    id: "glos-drug-5",
    term: "皮下注射",
    reading: "ひかちゅうしゃ",
    definition: "皮下組織に薬を注入する方法。刺入角度は10〜30度。インスリン注射などで用いる。",
    category: "drug",
    tags: ["投与経路", "注射"],
  },
  {
    id: "glos-drug-6",
    term: "筋肉内注射",
    reading: "きんにくないちゅうしゃ",
    definition: "筋肉に薬を注入する方法。刺入角度は90度（垂直）。ワクチン接種などで用いる。",
    category: "drug",
    tags: ["投与経路", "注射"],
  },
  {
    id: "glos-drug-7",
    term: "静脈内注射",
    reading: "じょうみゃくないちゅうしゃ",
    definition: "静脈に薬を注入する方法。刺入角度は15〜20度。最も速く効果が現れる。",
    category: "drug",
    tags: ["投与経路", "注射"],
  },
  {
    id: "glos-drug-8",
    term: "インスリン",
    reading: "いんすりん",
    definition: "膵臓から分泌される血糖値を下げるホルモン。糖尿病治療に用いる。低血糖に注意が必要。",
    category: "drug",
    tags: ["ホルモン", "糖尿病"],
  },
  {
    id: "glos-drug-9",
    term: "ワルファリン",
    reading: "わるふぁりん",
    definition: "抗凝固薬。血栓予防に用いる。ビタミンKを多く含む食品との相互作用に注意。",
    category: "drug",
    tags: ["抗凝固", "相互作用"],
  },
  {
    id: "glos-drug-10",
    term: "利尿薬",
    reading: "りにょうやく",
    definition: "尿量を増やす薬。心不全や高血圧の治療に用いる。電解質異常（特にK低下）に注意。",
    category: "drug",
    tags: ["循環器", "電解質"],
  },
];

// 検索関数
export function searchGlossary(query: string): GlossaryTerm[] {
  const lowerQuery = query.toLowerCase();
  return glossaryTerms.filter(term =>
    term.term.includes(query) ||
    term.reading.includes(lowerQuery) ||
    term.definition.includes(query) ||
    term.tags?.some(tag => tag.includes(query))
  );
}

// スキルIDから関連用語を取得
export function getTermsBySkillId(skillId: string): GlossaryTerm[] {
  return glossaryTerms.filter(term =>
    term.relatedSkillIds?.includes(skillId)
  );
}

// IDから用語を取得
export function getTermById(id: string): GlossaryTerm | undefined {
  return glossaryTerms.find(term => term.id === id);
}

// カテゴリで用語を取得
export function getTermsByCategory(category: GlossaryCategory): GlossaryTerm[] {
  return glossaryTerms.filter(term => term.category === category);
}

// 用語の総数
export const TOTAL_TERMS = glossaryTerms.length;
