import { Question } from "@/types";

// カテゴリ一覧
export const questionCategories = [
  "人体の構造と機能",
  "疾病の成り立ち",
  "健康支援と社会保障",
  "基礎看護学",
  "成人看護学",
  "老年看護学",
  "小児看護学",
  "母性看護学",
  "精神看護学",
  "在宅看護論",
  "看護の統合と実践",
  "必修問題",
] as const;

// 厚生労働省公開の看護師国家試験過去問
// 出典: https://www.mhlw.go.jp/seisakunitsuite/bunya/kenkou_iryou/iryou/topics/
export const questions: Question[] = [
  // ========================================
  // 第111回看護師国家試験（2022年2月実施）
  // ========================================
  {
    id: "k111-am-1",
    text: "日本の令和元年（2019年）の死亡数に近いのはどれか。",
    type: "choice",
    options: ["98万人", "118万人", "138万人", "158万人"],
    correctIndex: 2,
    explanation:
      "令和元年（2019年）の死亡数は約138万人です。高齢化に伴い死亡数は増加傾向にあります。",
    category: "健康支援と社会保障",
    source: "第111回看護師国家試験 午前問題1",
    examYear: 2022,
    examFrequency: 1,
  },
  {
    id: "k111-am-3",
    text: "シックハウス症候群に関係する物質はどれか。",
    type: "choice",
    options: ["アスベスト", "ダイオキシン類", "放射性セシウム", "ホルムアルデヒド"],
    correctIndex: 3,
    explanation:
      "シックハウス症候群は、建材や家具から放散されるホルムアルデヒドなどの化学物質が原因で起こります。",
    category: "健康支援と社会保障",
    source: "第111回看護師国家試験 午前問題3",
    examYear: 2022,
    examFrequency: 2,
  },
  {
    id: "k111-am-4",
    text: "後期高齢者医療制度の被保険者は、区域内に住居を有する何歳以上の者か。",
    type: "choice",
    options: ["70歳", "75歳", "80歳", "85歳"],
    correctIndex: 1,
    explanation:
      "後期高齢者医療制度の被保険者は75歳以上の者です。65歳以上75歳未満で一定の障害がある者も含まれます。",
    category: "健康支援と社会保障",
    source: "第111回看護師国家試験 午前問題4",
    examYear: 2022,
    examFrequency: 3,
  },
  {
    id: "k111-am-5",
    text: "患者の選択権の行使を最も促進するのはどれか。",
    type: "choice",
    options: ["父権主義", "医師の裁量権", "コンプライアンス", "インフォームド・コンセント"],
    correctIndex: 3,
    explanation:
      "インフォームド・コンセントは、患者が十分な説明を受けた上で自己決定することを保障し、患者の選択権を促進します。",
    category: "基礎看護学",
    source: "第111回看護師国家試験 午前問題5",
    examYear: 2022,
    examFrequency: 4,
  },
  {
    id: "k111-am-7",
    text: "胎児循環で胎児から胎盤に血液を送るのはどれか。",
    type: "choice",
    options: ["総頸動脈", "肺動脈", "臍動脈", "臍静脈"],
    correctIndex: 2,
    explanation:
      "臍動脈は胎児から胎盤へ血液を送ります。臍静脈は胎盤から胎児へ酸素と栄養を運びます。",
    category: "人体の構造と機能",
    source: "第111回看護師国家試験 午前問題7",
    examYear: 2022,
    examFrequency: 2,
  },
  {
    id: "k111-am-8",
    text: "学童期の脈拍数の基準値はどれか。",
    type: "choice",
    options: ["50〜70回/分", "80〜100回/分", "110〜130回/分", "140〜160回/分"],
    correctIndex: 1,
    explanation:
      "学童期（6〜12歳）の脈拍数は80〜100回/分が基準値です。年齢が上がるにつれて脈拍数は減少します。",
    category: "小児看護学",
    source: "第111回看護師国家試験 午前問題8",
    examYear: 2022,
    examFrequency: 3,
  },
  {
    id: "k111-am-9",
    text: "日本の女性における平均閉経年齢に最も近いのはどれか。",
    type: "choice",
    options: ["30歳", "40歳", "50歳", "60歳"],
    correctIndex: 2,
    explanation:
      "日本女性の平均閉経年齢は約50歳です。45〜55歳の間に閉経を迎えることが多いです。",
    category: "母性看護学",
    source: "第111回看護師国家試験 午前問題9",
    examYear: 2022,
    examFrequency: 2,
  },
  {
    id: "k111-am-10",
    text: "令和元年（2019年）の国民生活基礎調査で最も少ない世帯構造はどれか。",
    type: "choice",
    options: ["単独世帯", "三世代世帯", "夫婦のみの世帯", "夫婦と未婚の子のみの世帯"],
    correctIndex: 1,
    explanation:
      "三世代世帯は全体の約5%と最も少なく、単独世帯や夫婦のみの世帯が増加しています。",
    category: "健康支援と社会保障",
    source: "第111回看護師国家試験 午前問題10",
    examYear: 2022,
    examFrequency: 1,
  },
  {
    id: "k111-am-12",
    text: "有害物質を無毒化し排泄する臓器はどれか。",
    type: "choice",
    options: ["胃", "肝臓", "膵臓", "大腸"],
    correctIndex: 1,
    explanation:
      "肝臓は解毒作用を持ち、有害物質を無毒化して胆汁や尿として排泄します。",
    category: "人体の構造と機能",
    source: "第111回看護師国家試験 午前問題12",
    examYear: 2022,
    examFrequency: 3,
  },
  {
    id: "k111-am-13",
    text: "黄疸のある成人患者にみられる随伴症状はどれか。",
    type: "choice",
    options: ["動悸", "難聴", "関節痛", "掻痒感"],
    correctIndex: 3,
    explanation:
      "黄疸では血中ビリルビンが上昇し、皮膚に沈着することで掻痒感（かゆみ）が生じます。",
    category: "成人看護学",
    source: "第111回看護師国家試験 午前問題13",
    examYear: 2022,
    examFrequency: 2,
  },
  {
    id: "k111-am-14",
    text: "左前胸部から頸部や左上肢への放散痛が生じる疾患はどれか。",
    type: "choice",
    options: ["胃潰瘍", "狭心症", "胆石症", "尿管結石症"],
    correctIndex: 1,
    explanation:
      "狭心症では、心筋虚血により左前胸部から頸部、左上肢への放散痛が特徴的です。",
    category: "成人看護学",
    source: "第111回看護師国家試験 午前問題14",
    examYear: 2022,
    examFrequency: 4,
  },
  {
    id: "k111-am-15",
    text: "成人女性の赤血球数の基準値はどれか。",
    type: "choice",
    options: ["150〜250万/μL", "350〜450万/μL", "550〜650万/μL", "750〜850万/μL"],
    correctIndex: 1,
    explanation:
      "成人女性の赤血球数の基準値は350〜450万/μLです。男性は400〜550万/μLとやや高めです。",
    category: "人体の構造と機能",
    source: "第111回看護師国家試験 午前問題15",
    examYear: 2022,
    examFrequency: 2,
  },

  // ========================================
  // 第111回看護師国家試験 午後
  // ========================================
  {
    id: "k111-pm-1",
    text: "令和47年（2065年）の日本の将来推計人口に最も近いのはどれか。",
    type: "choice",
    options: ["6,800万人", "8,800万人", "1億800万人", "1億2,800万人"],
    correctIndex: 1,
    explanation:
      "国立社会保障・人口問題研究所の推計では、2065年の日本の人口は約8,800万人と予測されています。",
    category: "健康支援と社会保障",
    source: "第111回看護師国家試験 午後問題1",
    examYear: 2022,
    examFrequency: 1,
  },
  {
    id: "k111-pm-2",
    text: "生活習慣病の三次予防はどれか。",
    type: "choice",
    options: ["健康診断", "早期治療", "体力づくり", "社会復帰のためのリハビリテーション"],
    correctIndex: 3,
    explanation:
      "三次予防は疾病の重症化防止やリハビリテーションです。一次予防は健康増進・疾病予防、二次予防は早期発見・早期治療です。",
    category: "健康支援と社会保障",
    source: "第111回看護師国家試験 午後問題2",
    examYear: 2022,
    examFrequency: 3,
  },
  {
    id: "k111-pm-3",
    text: "職業性疾病のうち情報機器（VDT）作業による健康障害はどれか。",
    type: "choice",
    options: ["じん肺", "視力障害", "振動障害", "皮膚障害"],
    correctIndex: 1,
    explanation:
      "VDT作業では、眼精疲労や視力障害、頸肩腕症候群などが起こりやすいです。",
    category: "健康支援と社会保障",
    source: "第111回看護師国家試験 午後問題3",
    examYear: 2022,
    examFrequency: 2,
  },
  {
    id: "k111-pm-4",
    text: "介護保険における被保険者の要支援状態に関する保険給付はどれか。",
    type: "choice",
    options: ["医療給付", "介護給付", "年金給付", "予防給付"],
    correctIndex: 3,
    explanation:
      "要支援1・2の認定を受けた場合は予防給付、要介護1〜5の認定を受けた場合は介護給付が適用されます。",
    category: "健康支援と社会保障",
    source: "第111回看護師国家試験 午後問題4",
    examYear: 2022,
    examFrequency: 3,
  },
  {
    id: "k111-pm-5",
    text: "看護師免許を付与するのはどれか。",
    type: "choice",
    options: ["保健所長", "厚生労働大臣", "都道府県知事", "文部科学大臣"],
    correctIndex: 1,
    explanation:
      "看護師免許は厚生労働大臣が付与します。准看護師免許は都道府県知事が付与します。",
    category: "基礎看護学",
    source: "第111回看護師国家試験 午後問題5",
    examYear: 2022,
    examFrequency: 4,
  },
  {
    id: "k111-pm-11",
    text: "左心室から全身に血液を送り出す血管はどれか。",
    type: "choice",
    options: ["大静脈", "大動脈", "肺静脈", "肺動脈"],
    correctIndex: 1,
    explanation:
      "大動脈は左心室から出て全身に動脈血を送ります。肺動脈は右心室から肺へ静脈血を送ります。",
    category: "人体の構造と機能",
    source: "第111回看護師国家試験 午後問題11",
    examYear: 2022,
    examFrequency: 3,
  },
  {
    id: "k111-pm-16",
    text: "貧血の定義で正しいのはどれか。",
    type: "choice",
    options: ["血圧が低下すること", "脈拍が速くなること", "立ち上がると失神を起こすこと", "ヘモグロビン濃度が減少していること"],
    correctIndex: 3,
    explanation:
      "貧血はヘモグロビン濃度の減少で定義されます。血圧低下は低血圧、立ちくらみは起立性低血圧です。",
    category: "疾病の成り立ち",
    source: "第111回看護師国家試験 午後問題16",
    examYear: 2022,
    examFrequency: 3,
  },
  {
    id: "k111-pm-21",
    text: "転倒・転落を起こすリスクを高める薬はどれか。",
    type: "choice",
    options: ["降圧薬", "抗凝固薬", "気管支拡張薬", "副腎皮質ステロイド薬"],
    correctIndex: 0,
    explanation:
      "降圧薬は血圧低下によりふらつきを起こし、転倒・転落リスクを高めます。睡眠薬や抗不安薬も同様です。",
    category: "老年看護学",
    source: "第111回看護師国家試験 午後問題21",
    examYear: 2022,
    examFrequency: 3,
  },

  // ========================================
  // 第110回看護師国家試験（2021年2月実施）
  // ========================================
  {
    id: "k110-am-18",
    text: "患者の主観的情報はどれか。",
    type: "choice",
    options: ["苦悶様の顔貌", "息苦しさの訴え", "飲水量", "脈拍数"],
    correctIndex: 1,
    explanation:
      "主観的情報（S情報）は患者自身の訴えや感じ方です。客観的情報（O情報）は観察や測定で得られるデータです。",
    category: "基礎看護学",
    source: "第110回看護師国家試験 午前問題18",
    examYear: 2021,
    examFrequency: 3,
  },
  {
    id: "k110-am-19",
    text: "健康な成人における1日の平均尿量はどれか。",
    type: "choice",
    options: ["100mL", "500mL", "1,500mL", "2,500mL"],
    correctIndex: 2,
    explanation:
      "成人の1日尿量は約1,000〜1,500mLです。400mL未満は乏尿、100mL未満は無尿といいます。",
    category: "人体の構造と機能",
    source: "第110回看護師国家試験 午前問題19",
    examYear: 2021,
    examFrequency: 2,
  },
  {
    id: "k110-am-20",
    text: "足浴に使用する湯の温度で最も適切なのはどれか。",
    type: "choice",
    options: ["26〜28℃", "32〜34℃", "38〜40℃", "44〜46℃"],
    correctIndex: 2,
    explanation:
      "足浴の湯温は38〜40℃が適切です。体温より少し高めで、血行促進とリラックス効果があります。",
    category: "基礎看護学",
    source: "第110回看護師国家試験 午前問題20",
    examYear: 2021,
    examFrequency: 2,
  },
  {
    id: "k110-am-21",
    text: "感染予防のための手指衛生で正しいのはどれか。",
    type: "choice",
    options: ["石けんは十分に泡立てる", "洗面器に溜めた水で洗う", "水分を拭きとるタオルを共用にする", "塗布したアルコール消毒液は紙で拭き取る"],
    correctIndex: 0,
    explanation:
      "手指衛生では石けんを十分に泡立て、流水で洗い、個人用タオルまたはペーパータオルで拭きます。",
    category: "基礎看護学",
    source: "第110回看護師国家試験 午前問題21",
    examYear: 2021,
    examFrequency: 4,
  },
  {
    id: "k110-am-24",
    text: "1回の鼻腔内吸引時間の目安で適切なのはどれか。",
    type: "choice",
    options: ["10〜15秒", "20〜25秒", "30〜35秒", "40〜45秒"],
    correctIndex: 0,
    explanation:
      "吸引は10〜15秒以内で行います。長時間の吸引は低酸素血症を引き起こす危険があります。",
    category: "基礎看護学",
    source: "第110回看護師国家試験 午前問題24",
    examYear: 2021,
    examFrequency: 3,
  },
  {
    id: "k110-am-25",
    text: "成人の心肺蘇生時の胸骨圧迫の深さの目安はどれか。",
    type: "choice",
    options: ["2cm", "5cm", "8cm", "11cm"],
    correctIndex: 1,
    explanation:
      "成人の胸骨圧迫は約5cm（少なくとも5cm）の深さで行います。小児は胸の厚さの約1/3です。",
    category: "基礎看護学",
    source: "第110回看護師国家試験 午前問題25",
    examYear: 2021,
    examFrequency: 4,
  },

  // ========================================
  // 必修問題（頻出）
  // ========================================
  {
    id: "hisshu-1",
    text: "成人の正常な脈拍数は1分間に何回か。",
    type: "choice",
    options: ["40〜60回", "60〜100回", "100〜120回", "120〜140回"],
    correctIndex: 1,
    explanation:
      "成人の正常な脈拍数は60〜100回/分です。100回以上は頻脈、60回未満は徐脈といいます。",
    category: "必修問題",
    source: "必修問題（頻出）",
    examFrequency: 5,
  },
  {
    id: "hisshu-2",
    text: "成人の正常な呼吸数は1分間に何回か。",
    type: "choice",
    options: ["8〜12回", "12〜20回", "20〜28回", "28〜36回"],
    correctIndex: 1,
    explanation:
      "成人の正常な呼吸数は12〜20回/分です。24回以上は頻呼吸、12回未満は徐呼吸といいます。",
    category: "必修問題",
    source: "必修問題（頻出）",
    examFrequency: 5,
  },
  {
    id: "hisshu-3",
    text: "SpO2（経皮的動脈血酸素飽和度）の正常値はどれか。",
    type: "choice",
    options: ["85%以上", "90%以上", "96%以上", "100%"],
    correctIndex: 2,
    explanation:
      "SpO2の正常値は96〜99%です。90%未満は呼吸不全を示唆し、酸素投与が必要となります。",
    category: "必修問題",
    source: "必修問題（頻出）",
    examFrequency: 5,
  },
  {
    id: "hisshu-4",
    text: "点滴静脈内注射の刺入角度として適切なのはどれか。",
    type: "choice",
    options: ["10〜15度", "15〜20度", "45〜60度", "90度"],
    correctIndex: 1,
    explanation:
      "静脈注射は皮膚に対して15〜20度の角度で穿刺します。角度が大きいと血管を貫通してしまいます。",
    category: "必修問題",
    source: "必修問題（頻出）",
    examFrequency: 5,
  },
  {
    id: "hisshu-5",
    text: "筋肉内注射の刺入角度として適切なのはどれか。",
    type: "choice",
    options: ["15〜20度", "30〜45度", "45〜60度", "90度"],
    correctIndex: 3,
    explanation:
      "筋肉内注射は皮膚に対して90度（垂直）に刺入します。確実に筋層に到達させるためです。",
    category: "必修問題",
    source: "必修問題（頻出）",
    examFrequency: 5,
  },
  {
    id: "hisshu-6",
    text: "皮下注射の刺入角度として適切なのはどれか。",
    type: "choice",
    options: ["10〜30度", "30〜45度", "45〜60度", "90度"],
    correctIndex: 0,
    explanation:
      "皮下注射は10〜30度の角度で刺入します。皮下組織に薬液を注入するため、浅い角度が適切です。",
    category: "必修問題",
    source: "必修問題（頻出）",
    examFrequency: 5,
  },
  {
    id: "hisshu-7",
    text: "標準予防策（スタンダードプリコーション）の対象となるのはどれか。",
    type: "choice",
    options: ["感染症患者のみ", "隔離患者のみ", "すべての患者", "免疫不全患者のみ"],
    correctIndex: 2,
    explanation:
      "標準予防策は感染症の有無に関わらず、すべての患者に対して適用する基本的な感染対策です。",
    category: "必修問題",
    source: "必修問題（頻出）",
    examFrequency: 5,
  },
  {
    id: "hisshu-8",
    text: "導尿カテーテル挿入時、男性の挿入長さの目安はどれか。",
    type: "choice",
    options: ["4〜6cm", "8〜10cm", "18〜20cm", "25〜30cm"],
    correctIndex: 2,
    explanation:
      "男性の尿道長は約18〜20cmのため、18〜20cm挿入します。女性は3〜5cm程度です。",
    category: "必修問題",
    source: "必修問題（頻出）",
    examFrequency: 4,
  },
  {
    id: "hisshu-9",
    text: "体位変換の間隔として推奨されるのはどれか。",
    type: "choice",
    options: ["1時間ごと", "2時間ごと", "4時間ごと", "6時間ごと"],
    correctIndex: 1,
    explanation:
      "褥瘡予防のため2時間ごとの体位変換が基本です。同一体位の持続による組織への圧迫を軽減します。",
    category: "必修問題",
    source: "必修問題（頻出）",
    examFrequency: 4,
  },
  {
    id: "hisshu-10",
    text: "心電図でP波が表すのはどれか。",
    type: "choice",
    options: ["心房の興奮", "心室の興奮", "心室の回復", "心房の回復"],
    correctIndex: 0,
    explanation:
      "P波は心房の興奮（脱分極）を表します。QRS波は心室の興奮、T波は心室の回復を表します。",
    category: "必修問題",
    source: "必修問題（頻出）",
    examFrequency: 4,
  },
  {
    id: "hisshu-11",
    text: "褥瘡好発部位として最も多いのはどれか。",
    type: "choice",
    options: ["踵部", "仙骨部", "肩甲骨部", "後頭部"],
    correctIndex: 1,
    explanation:
      "仰臥位では仙骨部に体圧が集中しやすく、褥瘡の好発部位となります。踵部も好発部位です。",
    category: "必修問題",
    source: "必修問題（頻出）",
    examFrequency: 4,
  },
  {
    id: "hisshu-12",
    text: "輸血開始後15分間の観察で最も注意すべき副作用はどれか。",
    type: "choice",
    options: ["感染症", "低体温", "アレルギー反応", "鉄過剰症"],
    correctIndex: 2,
    explanation:
      "輸血開始直後はアナフィラキシーなどのアレルギー反応が起こりやすいため、最初の15分間は特に慎重に観察します。",
    category: "必修問題",
    source: "必修問題（頻出）",
    examFrequency: 3,
  },
  {
    id: "hisshu-13",
    text: "グリセリン浣腸液の温度として適切なのはどれか。",
    type: "choice",
    options: ["20〜25℃", "30〜35℃", "38〜40℃", "45〜50℃"],
    correctIndex: 2,
    explanation:
      "浣腸液は38〜40℃（体温程度）が適切です。冷たすぎると腸の攣縮、熱すぎると粘膜損傷のリスクがあります。",
    category: "必修問題",
    source: "必修問題（頻出）",
    examFrequency: 3,
  },
  {
    id: "hisshu-14",
    text: "成人の循環血液量は体重の約何％か。",
    type: "choice",
    options: ["4%", "8%", "12%", "16%"],
    correctIndex: 1,
    explanation:
      "成人の循環血液量は体重の約8%（約1/13）です。体重60kgの人で約4.8Lになります。",
    category: "人体の構造と機能",
    source: "必修問題（頻出）",
    examFrequency: 3,
  },
  {
    id: "hisshu-15",
    text: "ワルファリンカリウムと拮抗作用があるのはどれか。",
    type: "choice",
    options: ["ビタミンA", "ビタミンC", "ビタミンD", "ビタミンK"],
    correctIndex: 3,
    explanation:
      "ワルファリンはビタミンK依存性凝固因子の合成を阻害します。ビタミンKはワルファリンの効果を減弱させます。",
    category: "疾病の成り立ち",
    source: "必修問題（頻出）",
    examFrequency: 4,
  },

  // ========================================
  // 追加の過去問
  // ========================================
  {
    id: "k109-1",
    text: "認知症患者の中核症状はどれか。",
    type: "choice",
    options: ["徘徊", "記憶障害", "暴言", "不眠"],
    correctIndex: 1,
    explanation:
      "中核症状には記憶障害、見当識障害、判断力低下などがあります。徘徊、暴言、不眠は行動・心理症状（BPSD）です。",
    category: "老年看護学",
    source: "第109回看護師国家試験",
    examYear: 2020,
    examFrequency: 4,
  },
  {
    id: "k109-2",
    text: "統合失調症の陽性症状はどれか。",
    type: "choice",
    options: ["感情鈍麻", "意欲低下", "幻覚", "無為"],
    correctIndex: 2,
    explanation:
      "陽性症状には幻覚、妄想、思考障害などがあります。感情鈍麻、意欲低下、無為は陰性症状です。",
    category: "精神看護学",
    source: "第109回看護師国家試験",
    examYear: 2020,
    examFrequency: 4,
  },
  {
    id: "k109-3",
    text: "糖尿病患者の低血糖症状はどれか。",
    type: "choice",
    options: ["口渇", "冷汗", "頻尿", "多飲"],
    correctIndex: 1,
    explanation:
      "低血糖症状には冷汗、動悸、振戦、空腹感などがあります。口渇、頻尿、多飲は高血糖の症状です。",
    category: "成人看護学",
    source: "第109回看護師国家試験",
    examYear: 2020,
    examFrequency: 4,
  },
  {
    id: "k108-1",
    text: "新生児の正常な呼吸数は1分間に何回か。",
    type: "choice",
    options: ["16〜20回", "30〜50回", "60〜80回", "80〜100回"],
    correctIndex: 1,
    explanation:
      "新生児の呼吸数は30〜50回/分が正常です。成人より速く、不規則なことが多いです。",
    category: "小児看護学",
    source: "第108回看護師国家試験",
    examYear: 2019,
    examFrequency: 3,
  },
  {
    id: "k108-2",
    text: "Apgarスコアの評価項目に含まれないのはどれか。",
    type: "choice",
    options: ["心拍数", "呼吸", "体温", "筋緊張"],
    correctIndex: 2,
    explanation:
      "Apgarスコアは心拍数、呼吸、皮膚色、筋緊張、刺激への反応の5項目で評価します。体温は含まれません。",
    category: "母性看護学",
    source: "第108回看護師国家試験",
    examYear: 2019,
    examFrequency: 3,
  },
  {
    id: "k108-3",
    text: "訪問看護で正しいのはどれか。",
    type: "choice",
    options: ["主治医の指示なく実施できる", "介護保険より医療保険が優先される", "看護師のみが実施できる", "訪問看護指示書に基づいて実施する"],
    correctIndex: 3,
    explanation:
      "訪問看護は医師の訪問看護指示書に基づいて実施します。原則として介護保険が優先されます。",
    category: "在宅看護論",
    source: "第108回看護師国家試験",
    examYear: 2019,
    examFrequency: 3,
  },
];

/**
 * 今日の3問をランダムに取得
 */
export function getDailyQuestions(date: string, count: number = 3): Question[] {
  // 日付をシードにしてランダム選択（同じ日は同じ問題が出る）
  const seed = parseInt(date.split("-").join(""));

  // シードベースの擬似乱数生成
  const seededRandom = (index: number) => {
    const x = Math.sin(seed + index * 9999) * 10000;
    return x - Math.floor(x);
  };

  // Fisher-Yatesシャッフル（シード付き）
  const arr = [...questions];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(i) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.slice(0, count);
}

/**
 * IDで問題を取得
 */
export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

/**
 * IDリストから問題を取得
 */
export function getQuestionsByIds(ids: string[]): Question[] {
  return ids.map((id) => getQuestionById(id)).filter(Boolean) as Question[];
}
