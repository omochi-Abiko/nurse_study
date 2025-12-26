import { SOAPTemplate } from "@/types";

export const soapTemplates: SOAPTemplate[] = [
  // 発熱
  {
    id: "fever-1",
    category: "発熱",
    name: "発熱（軽度）",
    subjective: "「熱っぽい」「だるい」「寒気がする」との訴えあり。",
    objective: "体温37.8℃、脈拍88回/分、顔面紅潮あり、発汗(-)。",
    assessment: "軽度の発熱を認める。感染症の初期症状の可能性あり。",
    plan: "水分摂取を促す。1時間後に再検温。38.5℃以上で医師に報告。",
  },
  {
    id: "fever-2",
    category: "発熱",
    name: "発熱（高熱）",
    subjective: "「とても熱い」「頭が痛い」との訴えあり。悪寒を伴う。",
    objective: "体温39.2℃、脈拍102回/分、SpO2 97%、発汗著明。",
    assessment: "高熱を認める。感染症または炎症性疾患の可能性。脱水リスクあり。",
    plan: "医師に報告し指示を仰ぐ。クーリング実施。水分摂取を促す。",
  },

  // 疼痛
  {
    id: "pain-1",
    category: "疼痛",
    name: "術後疼痛",
    subjective: "「傷が痛い」との訴えあり。NRS 6/10。体動時に増強。",
    objective: "創部発赤(-)、腫脹(-)、滲出液(-)。表情険しい。",
    assessment: "術後の創部痛を認める。疼痛コントロールが必要。",
    plan: "鎮痛剤の使用を検討。安楽な体位の工夫。30分後に再評価。",
  },
  {
    id: "pain-2",
    category: "疼痛",
    name: "頭痛",
    subjective: "「頭が締め付けられるように痛い」との訴え。NRS 5/10。",
    objective: "BP 138/82mmHg、瞳孔左右同大、項部硬直(-)、悪心(-)。",
    assessment: "緊張型頭痛の可能性。バイタル安定。神経学的異常なし。",
    plan: "安静保持。水分摂取を促す。症状持続時は医師に報告。",
  },

  // 呼吸
  {
    id: "resp-1",
    category: "呼吸",
    name: "呼吸困難",
    subjective: "「息が苦しい」との訴えあり。労作時に増強。",
    objective: "SpO2 94%（室内気）、呼吸数24回/分、起座呼吸(-)、喘鳴(-)。",
    assessment: "軽度の低酸素血症を認める。呼吸状態の観察継続が必要。",
    plan: "セミファウラー位に調整。酸素投与の必要性を医師に相談。",
  },
  {
    id: "resp-2",
    category: "呼吸",
    name: "痰の貯留",
    subjective: "「痰がからむ」「咳が出る」との訴えあり。",
    objective: "湿性咳嗽あり。喀痰：白色粘稠、少量。肺音：両側下肺野で水泡音聴取。",
    assessment: "気道内分泌物の貯留を認める。排痰援助が必要。",
    plan: "水分摂取を促す。体位ドレナージ実施。必要時吸引。",
  },

  // 消化器
  {
    id: "gi-1",
    category: "消化器",
    name: "悪心・嘔吐",
    subjective: "「気持ち悪い」「吐きそう」との訴えあり。",
    objective: "嘔吐1回（胃内容物）、腹部膨満(-)、腸蠕動音良好。",
    assessment: "悪心・嘔吐を認める。脱水予防と原因検索が必要。",
    plan: "制吐剤の使用を検討。少量ずつ水分摂取。食事は控える。",
  },
  {
    id: "gi-2",
    category: "消化器",
    name: "便秘",
    subjective: "「3日間便が出ていない」との訴え。腹部膨満感あり。",
    objective: "腸蠕動音減弱、腹部軽度膨満、圧痛(-)。",
    assessment: "3日間の排便なく便秘状態。腸蠕動低下を認める。",
    plan: "水分・食物繊維の摂取を促す。腹部マッサージ実施。緩下剤の使用を検討。",
  },

  // 循環器
  {
    id: "cv-1",
    category: "循環器",
    name: "血圧上昇",
    subjective: "「頭が重い」との訴えあり。自覚症状は軽度。",
    objective: "BP 168/98mmHg、HR 78回/分、整脈。頭痛(-)、視覚異常(-)。",
    assessment: "血圧上昇を認める。緊急性は低いが経過観察必要。",
    plan: "安静保持。30分後に再測定。持続する場合は医師に報告。",
  },
  {
    id: "cv-2",
    category: "循環器",
    name: "浮腫",
    subjective: "「足がむくんでいる」との訴えあり。",
    objective: "両下腿に圧痕性浮腫（+2）、体重前日比+1.2kg。",
    assessment: "下腿浮腫を認める。体液貯留傾向。心不全増悪の可能性。",
    plan: "下肢挙上。水分・塩分摂取量の確認。尿量測定。医師に報告。",
  },

  // 皮膚
  {
    id: "skin-1",
    category: "皮膚",
    name: "褥瘡（発赤）",
    subjective: "「お尻が痛い」との訴えあり。",
    objective: "仙骨部に3×3cmの発赤あり。指圧で退色(+)。びらん(-)。",
    assessment: "褥瘡ステージI（発赤）を認める。圧迫解除と予防ケアが必要。",
    plan: "2時間ごとの体位変換。エアマット使用検討。皮膚の清潔保持。",
  },
  {
    id: "skin-2",
    category: "皮膚",
    name: "皮膚掻痒感",
    subjective: "「体中がかゆい」との訴えあり。掻破あり。",
    objective: "四肢・体幹に散在性の発赤あり。掻破痕(+)、乾燥著明。",
    assessment: "皮膚乾燥に伴う掻痒感を認める。掻破による二次感染リスクあり。",
    plan: "保湿剤塗布。爪を短く切る。掻破しないよう指導。",
  },

  // 精神
  {
    id: "mental-1",
    category: "精神",
    name: "不眠",
    subjective: "「昨夜は眠れなかった」「2時間しか寝ていない」との訴え。",
    objective: "眼瞼下垂、あくび頻回。日中の傾眠傾向あり。",
    assessment: "睡眠障害を認める。入眠困難の原因検索と対策が必要。",
    plan: "就寝前の環境調整。リラクゼーション法の指導。必要時睡眠薬の使用検討。",
  },
  {
    id: "mental-2",
    category: "精神",
    name: "不安",
    subjective: "「手術が心配」「怖い」との訴えあり。涙ぐむ場面あり。",
    objective: "表情硬い。手の震えあり。質問多い。",
    assessment: "手術に対する不安を認める。精神的サポートが必要。",
    plan: "傾聴、共感的態度で接する。手術の流れを再説明。",
  },

  // 転倒・転落
  {
    id: "fall-1",
    category: "転倒",
    name: "転倒リスク",
    subjective: "「ふらつく」「足に力が入らない」との訴えあり。",
    objective: "歩行時ふらつき(+)、下肢筋力低下。転倒歴あり。",
    assessment: "転倒リスクが高い状態。歩行時の見守りと環境整備が必要。",
    plan: "移動時はナースコールを押すよう指導。履物の確認。ベッド周囲の整理。",
  },
];

export const soapCategories = [
  "発熱",
  "疼痛",
  "呼吸",
  "消化器",
  "循環器",
  "皮膚",
  "精神",
  "転倒",
];

export function getSOAPTemplatesByCategory(category: string): SOAPTemplate[] {
  return soapTemplates.filter((t) => t.category === category);
}
