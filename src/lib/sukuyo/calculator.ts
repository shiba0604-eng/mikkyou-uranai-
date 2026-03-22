/**
 * 宿曜占星術 計算エンジン
 *
 * ## 計算原理
 * 宿曜道では「月の二十七宿」を用いる。
 * 月は約27.32日で地球を一周し、その通過した星宿を「当日宿」と呼ぶ。
 *
 * ### 本命宿の求め方
 * 生年月日から、その日の月の位置（黄道上の宿）を求める。
 *
 * ### 計算方法（通日法）
 * 宿曜道の古典的計算:
 * 1. 生年月日をユリウス通日(JD)に変換
 * 2. 基準日（既知の宿）からの日数差を計算
 * 3. 27で割った余りで宿を決定
 *
 * 基準日: 2000年1月1日 = 角宿(index=0) として計算
 * ※ 実際の天文学的な月の位置とは微妙にずれる場合があるが、
 *    伝統的な宿曜道の計算法に基づいている
 */

import { SHUKU_LIST, SHUKU_COUNT, type Shuku } from "./constants";

/**
 * グレゴリオ暦の日付をユリウス通日(JD)に変換
 */
function toJulianDay(year: number, month: number, day: number): number {
  // グレゴリオ暦→ユリウス通日の標準変換式
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * 基準JD: 2000年1月1日 = 宿インデックス0（角宿）
 * この値は天文計算に基づく月の宿位置から設定
 */
const BASE_JD = toJulianDay(2000, 1, 1);
const BASE_SHUKU_INDEX = 0; // 角宿

/**
 * 指定日の宿インデックスを計算
 */
function calcShukuIndex(year: number, month: number, day: number): number {
  const jd = toJulianDay(year, month, day);
  const diff = jd - BASE_JD;
  // 27で割った余り（負の場合も対応）
  return ((diff % SHUKU_COUNT) + SHUKU_COUNT) % SHUKU_COUNT;
}

/**
 * 生年月日から本命宿を取得
 * @param birthYear 生年（例: 1990）
 * @param birthMonth 生月（1〜12）
 * @param birthDay 生日（1〜31）
 */
export function getBirthShuku(
  birthYear: number,
  birthMonth: number,
  birthDay: number
): Shuku {
  const index = calcShukuIndex(birthYear, birthMonth, birthDay);
  return SHUKU_LIST[index];
}

/**
 * 指定日の当日宿を取得（今日の宿）
 * @param date 対象日付（デフォルト: 今日）
 */
export function getTodayShuku(date?: Date): Shuku {
  const d = date ?? new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const index = calcShukuIndex(year, month, day);
  return SHUKU_LIST[index];
}

/**
 * 二宿間の相性を計算
 *
 * 宿曜道の相性体系（七種類）:
 * - 同宿（どうしゅく）: 同じ宿 → 最も強い縁
 * - 命合（めいごう）: 4宿差 → 生涯の縁
 * - 業合（ごうごう）: 9宿差 → 良縁
 * - 胎合（たいごう）: 13宿差 → 恋愛の縁
 * - 安合（あんごう）: 命合+1 → 安定した縁
 * - 衰（おとろえ）: 危険な関係
 * - 危（き）: 最も注意が必要
 */
export type Compatibility =
  | "同宿"
  | "命合"
  | "業合"
  | "胎合"
  | "安合"
  | "中吉"
  | "平"
  | "注意"
  | "危";

export interface CompatibilityResult {
  type: Compatibility;
  score: number; // 0〜100
  description: string;
}

export function calcCompatibility(
  shuku1: Shuku,
  shuku2: Shuku
): CompatibilityResult {
  const diff = Math.abs(shuku1.index - shuku2.index);
  const minDiff = Math.min(diff, SHUKU_COUNT - diff);

  if (minDiff === 0) {
    return {
      type: "同宿",
      score: 100,
      description: "同じ宿を持つ、稀有な縁。深い相互理解と強い結びつきがある。",
    };
  }
  if (minDiff === 4 || minDiff === 23) {
    return {
      type: "命合",
      score: 90,
      description: "命を合わせる縁。生涯を通じて助け合える最良の関係。",
    };
  }
  if (minDiff === 9 || minDiff === 18) {
    return {
      type: "業合",
      score: 80,
      description: "業（カルマ）で結ばれた縁。深い絆と成長をもたらす関係。",
    };
  }
  if (minDiff === 13 || minDiff === 14) {
    return {
      type: "胎合",
      score: 75,
      description: "胎（生命）で結ばれた縁。恋愛・結婚に向いた関係。",
    };
  }
  if (minDiff === 5 || minDiff === 22) {
    return {
      type: "安合",
      score: 70,
      description: "安らかに合う縁。穏やかで安定した関係を築ける。",
    };
  }
  if (minDiff <= 3 || minDiff >= 24) {
    return {
      type: "中吉",
      score: 60,
      description: "近い宿同士。共鳴しやすく、理解し合いやすい関係。",
    };
  }
  if (minDiff === 6 || minDiff === 21) {
    return {
      type: "注意",
      score: 40,
      description: "互いの個性が強く出やすい関係。意識的な配慮が大切。",
    };
  }
  if (minDiff === 7 || minDiff === 20) {
    return {
      type: "危",
      score: 30,
      description: "最も注意が必要な関係。深く関わる前に慎重な見極めを。",
    };
  }

  return {
    type: "平",
    score: 55,
    description: "特別な縁はないが、努力次第で良い関係を築ける。",
  };
}

/**
 * 本命宿と当日宿から今日の運勢レベルを計算
 */
export type FortuneLevel = "大吉" | "吉" | "中吉" | "平" | "注意" | "凶";

export function calcDailyFortune(
  birthShuku: Shuku,
  todayShuku: Shuku
): FortuneLevel {
  const compat = calcCompatibility(birthShuku, todayShuku);

  if (compat.score >= 90) return "大吉";
  if (compat.score >= 75) return "吉";
  if (compat.score >= 60) return "中吉";
  if (compat.score >= 50) return "平";
  if (compat.score >= 35) return "注意";
  return "凶";
}

/**
 * メインの占い結果型
 */
export interface FortuneResult {
  birthShuku: Shuku;
  todayShuku: Shuku;
  compatibility: CompatibilityResult;
  fortuneLevel: FortuneLevel;
  date: string;
}

/**
 * 生年月日と対象日から占い結果を生成
 */
export function getFortune(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  targetDate?: Date
): FortuneResult {
  const birthShuku = getBirthShuku(birthYear, birthMonth, birthDay);
  const todayShuku = getTodayShuku(targetDate);
  const compatibility = calcCompatibility(birthShuku, todayShuku);
  const fortuneLevel = calcDailyFortune(birthShuku, todayShuku);
  const d = targetDate ?? new Date();

  return {
    birthShuku,
    todayShuku,
    compatibility,
    fortuneLevel,
    date: `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`,
  };
}
