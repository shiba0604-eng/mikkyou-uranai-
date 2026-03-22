/**
 * 宿曜占星術 - 運勢文言生成
 *
 * 各宿の特性 × 今日の運勢レベルから
 * カテゴリ別の運勢メッセージを生成する。
 */

import { type Shuku } from "./constants";
import { type FortuneLevel, type FortuneResult } from "./calculator";

export type FortuneCategory = "総合" | "恋愛" | "仕事" | "金運" | "健康";

export interface CategoryFortune {
  category: FortuneCategory;
  level: FortuneLevel;
  message: string;
  advice: string;
}

export interface DailyFortune {
  date: string;
  birthShuku: Shuku;
  todayShuku: Shuku;
  overallLevel: FortuneLevel;
  overallMessage: string;
  luckyColor: string;
  luckyNumber: number;
  categories: CategoryFortune[];
  dailyMantra: string;
}

/** 運勢レベルに対応する色 */
const FORTUNE_COLORS: Record<FortuneLevel, string> = {
  大吉: "#FFD700", // ゴールド
  吉: "#4CAF50", // グリーン
  中吉: "#2196F3", // ブルー
  平: "#9E9E9E", // グレー
  注意: "#FF9800", // オレンジ
  凶: "#F44336", // レッド
};

/** 宿の守護星に対応するラッキーカラー */
const ELEMENT_COLORS: Record<string, string[]> = {
  金: ["白", "銀", "金色"],
  日: ["橙", "黄金", "赤橙"],
  火: ["赤", "緋色", "朱色"],
  水: ["黒", "藍", "濃紺"],
  木: ["青", "翠", "緑"],
  土: ["黄", "茶", "薄黄"],
  月: ["白", "銀", "淡青"],
};

/**
 * 静的テンプレートから運勢文言を生成
 * （Claude API未使用の場合のフォールバック）
 */
function generateMessage(
  shuku: Shuku,
  level: FortuneLevel,
  category: FortuneCategory
): { message: string; advice: string } {
  const keyword = shuku.keywords[Math.floor(Math.random() * shuku.keywords.length)];
  const strength = shuku.strengths[0];
  const caution = shuku.cautions[0];

  const positiveMessages: Record<FortuneCategory, string[]> = {
    総合: [
      `${shuku.name}の加護が今日を輝かせます。「${keyword}」のエネルギーが満ちており、${strength}を活かした行動が吉です。`,
      `密教の星「${shuku.name}」が今日のあなたを守護します。${keyword}をテーマに、心を静かに保ちましょう。`,
    ],
    恋愛: [
      `${shuku.name}の縁結びの力が働いています。素直な気持ちを大切に、${keyword}の心で相手と向き合いましょう。`,
      `今日は${shuku.name}の恋愛運が高まる日。${strength}を生かして積極的に動くと吉。`,
    ],
    仕事: [
      `${shuku.name}が${strength}を高めています。今日は得意なことに集中することで、大きな成果が期待できます。`,
      `仕事運に${shuku.name}の加護あり。「${keyword}」を意識して取り組むと、道が開けます。`,
    ],
    金運: [
      `${shuku.name}の財運が動いています。無駄遣いを避けつつ、${keyword}の直感を信じた判断が吉。`,
      `今日の金運は${shuku.name}が後押し。堅実な行動が積み重なり、豊かさにつながります。`,
    ],
    健康: [
      `${shuku.name}の守護のもと、今日の体調は安定。${strength}のエネルギーで心身ともに充実した一日を。`,
      `密教の星${shuku.name}が健康を守ります。十分な休息と水分補給を心がけましょう。`,
    ],
  };

  const cautionMessages: Record<FortuneCategory, string[]> = {
    総合: [
      `今日は${shuku.name}のエネルギーが試練をもたらす日。「${caution}」に注意し、慎重に行動しましょう。`,
      `${shuku.name}の影響で${caution}が出やすい日。焦らず、一歩引いた視点で物事を見ることが大切です。`,
    ],
    恋愛: [
      `恋愛面では${caution}に要注意。感情的にならず、冷静さを保つことが大切な一日です。`,
      `今日の恋愛は${shuku.name}の試練期。誤解が生じやすいので、言葉を丁寧に選びましょう。`,
    ],
    仕事: [
      `仕事では${caution}が出やすい配置。重要な決断は明日以降に持ち越すのが賢明です。`,
      `${shuku.name}の影響で仕事運に注意が必要。確認作業を怠らず、着実に進めましょう。`,
    ],
    金運: [
      `今日の金運は要注意。${caution}で思わぬ出費が生じやすい日。衝動買いは控えましょう。`,
      `${shuku.name}の試練が金運に影響。大きな金銭的決断は避け、様子を見ることが吉。`,
    ],
    健康: [
      `体調管理に注意が必要な日。${caution}のエネルギーが高まっています。無理をせず、早めの休息を。`,
      `${shuku.name}が健康に警告を発しています。疲労を溜め込まず、今日は養生を優先しましょう。`,
    ],
  };

  const advices: Record<FortuneCategory, string> = {
    総合: `${shuku.keywords.slice(0, 2).join("・")}を心に留めて過ごしましょう。`,
    恋愛: `相手の${shuku.keywords[0]}を大切に、思いやりの心で接しましょう。`,
    仕事: `${strength}を発揮できる環境を整え、集中して取り組みましょう。`,
    金運: `今日は計画的な金銭管理を心がけ、将来への投資を考えましょう。`,
    健康: `${shuku.keywords[0]}のエネルギーを体に取り込む、深呼吸や瞑想がおすすめです。`,
  };

  const isPositive = level === "大吉" || level === "吉" || level === "中吉";
  const messages = isPositive
    ? positiveMessages[category]
    : cautionMessages[category];

  return {
    message: messages[Math.floor(Math.random() * messages.length)],
    advice: advices[category],
  };
}

/**
 * FortuneResultから詳細な日運を生成
 */
export function generateDailyFortune(result: FortuneResult): DailyFortune {
  const { birthShuku, todayShuku, fortuneLevel, date } = result;

  const categories: FortuneCategory[] = ["恋愛", "仕事", "金運", "健康"];

  // カテゴリ別に運勢レベルを少し変動させる
  const levelVariation = (base: FortuneLevel, delta: number): FortuneLevel => {
    const levels: FortuneLevel[] = ["凶", "注意", "平", "中吉", "吉", "大吉"];
    const idx = levels.indexOf(base);
    const newIdx = Math.max(0, Math.min(5, idx + delta));
    return levels[newIdx];
  };

  const categoryFortunes: CategoryFortune[] = categories.map(
    (category, i) => {
      const delta = [0, 1, -1, 1, 0][i % 5];
      const level = levelVariation(fortuneLevel, delta);
      const { message, advice } = generateMessage(birthShuku, level, category);
      return { category, level, message, advice };
    }
  );

  // ラッキーカラー（本命宿の守護星から）
  const colors = ELEMENT_COLORS[birthShuku.element] ?? ["白"];
  const luckyColor = colors[new Date().getDate() % colors.length];

  // ラッキーナンバー（両宿のインデックスから）
  const luckyNumber = ((birthShuku.index + todayShuku.index) % 9) + 1;

  // 総合メッセージ
  const { message: overallMessage } = generateMessage(
    birthShuku,
    fortuneLevel,
    "総合"
  );

  // 密教マントラ（宿ごとの守護真言 - 簡略版）
  const mantras: Record<string, string> = {
    金: "オン・マカラ・ギャ・ソワカ",
    日: "オン・アビラウンケン・バザラ・ダト・バン",
    火: "ノウマク・サンマンダ・バザラダン・センダ・マカロシャダ",
    水: "オン・メイキャ・シャラバ・ソワカ",
    木: "オン・ベイシラ・マンダヤ・ソワカ",
    土: "オン・チチリ・キャウロ・ソワカ",
    月: "オン・ソマヤ・ソワカ",
  };

  return {
    date,
    birthShuku,
    todayShuku,
    overallLevel: fortuneLevel,
    overallMessage,
    luckyColor,
    luckyNumber,
    categories: categoryFortunes,
    dailyMantra: mantras[birthShuku.element] ?? "オン・ア・ビ・ラ・ウン・ケン",
  };
}

/** 運勢レベルの色コードを返す */
export { FORTUNE_COLORS };
