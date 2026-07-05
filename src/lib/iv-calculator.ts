// 点滴計算ツール

/**
 * 点滴セットの種類
 * - adult: 一般成人用（20滴/mL）
 * - pediatric: 小児・微量用（60滴/mL）
 */
export type IVSetType = "adult" | "pediatric";

/**
 * 滴下係数
 */
export const DROP_FACTORS: Record<IVSetType, number> = {
  adult: 20,      // 20滴/mL
  pediatric: 60,  // 60滴/mL
};

/**
 * 点滴計算の入力値
 */
export interface IVCalculationInput {
  volume: number;          // 輸液量 (mL)
  hours: number;           // 投与時間（時間）
  minutes: number;         // 投与時間（分）
  setType: IVSetType;      // 点滴セットの種類
}

/**
 * 点滴計算の結果
 */
export interface IVCalculationResult {
  dropsPerMinute: number;       // 滴下数（滴/分）
  secondsPerDrop: number;       // 1滴あたりの秒数
  mlPerHour: number;            // 1時間あたりのmL
  totalMinutes: number;         // 総投与時間（分）
  dropFactor: number;           // 使用した滴下係数
}

/**
 * 点滴計算を実行
 */
export function calculateIV(input: IVCalculationInput): IVCalculationResult | null {
  const { volume, hours, minutes, setType } = input;

  // 入力検証
  if (volume <= 0) return null;

  const totalMinutes = hours * 60 + minutes;
  if (totalMinutes <= 0) return null;

  const dropFactor = DROP_FACTORS[setType];

  // 滴下数（滴/分）= 輸液量(mL) × 滴下係数 ÷ 時間(分)
  const dropsPerMinute = (volume * dropFactor) / totalMinutes;

  // 1滴あたりの秒数 = 60秒 ÷ 滴下数（滴/分）
  const secondsPerDrop = dropsPerMinute > 0 ? 60 / dropsPerMinute : 0;

  // 1時間あたりのmL = 輸液量 ÷ 時間(時間)
  const totalHours = totalMinutes / 60;
  const mlPerHour = volume / totalHours;

  return {
    dropsPerMinute: Math.round(dropsPerMinute * 10) / 10,
    secondsPerDrop: Math.round(secondsPerDrop * 10) / 10,
    mlPerHour: Math.round(mlPerHour * 10) / 10,
    totalMinutes,
    dropFactor,
  };
}

/**
 * よくある輸液量のプリセット
 */
export const VOLUME_PRESETS = [
  { value: 100, label: "100mL" },
  { value: 250, label: "250mL" },
  { value: 500, label: "500mL" },
  { value: 1000, label: "1000mL" },
];

/**
 * よくある投与時間のプリセット
 */
export const TIME_PRESETS = [
  { hours: 1, minutes: 0, label: "1時間" },
  { hours: 2, minutes: 0, label: "2時間" },
  { hours: 3, minutes: 0, label: "3時間" },
  { hours: 4, minutes: 0, label: "4時間" },
  { hours: 6, minutes: 0, label: "6時間" },
  { hours: 8, minutes: 0, label: "8時間" },
  { hours: 12, minutes: 0, label: "12時間" },
  { hours: 24, minutes: 0, label: "24時間" },
];
