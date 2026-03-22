import type { AgentStatusEntry, SlideDeckSlide, VictoryPattern } from "./types";

const PATTERN_KEYWORDS: Record<
  VictoryPattern,
  { label: string; keywords: string[] }
> = {
  value: {
    label: "価値提供",
    keywords: ["価値", "ベネフィット", "課題解決", "ROI", "効果", "成果"],
  },
  compare: {
    label: "新旧比較",
    keywords: ["比較", "従来", "Before", "After", "競合", "差分", "vs"],
  },
  trust: {
    label: "信頼構築",
    keywords: ["実績", "導入", "顧客", "ロゴ", "認証", "パートナー", "事例"],
  },
  anxiety: {
    label: "不安払拭",
    keywords: ["リスク", "不安", "保証", "セキュリティ", "FAQ", "懸念"],
  },
  forecast: {
    label: "未来予報",
    keywords: ["トレンド", "予測", "2030", "市場", "成長", "見通し"],
  },
  launch: {
    label: "ローンチ",
    keywords: ["発売", "ローンチ", "新製品", "リリース", "提供開始"],
  },
  webinar: {
    label: "ウェビナー",
    keywords: ["ウェビナー", "セミナー", "登壇", "アジェンダ", "参加"],
  },
  pitch: {
    label: "ピッチ",
    keywords: ["調達", "投資", "ピッチ", "VC", "事業計画", "資金"],
  },
};

function scorePattern(text: string, p: VictoryPattern): number {
  const t = text.toLowerCase();
  const { keywords } = PATTERN_KEYWORDS[p];
  return keywords.reduce((n, k) => n + (t.includes(k.toLowerCase()) ? 2 : 0), 0);
}

export function selectVictoryPattern(raw: string): {
  pattern: VictoryPattern;
  label: string;
} {
  const scores = (Object.keys(PATTERN_KEYWORDS) as VictoryPattern[]).map(
    (pattern) => ({ pattern, s: scorePattern(raw, pattern) }),
  );
  scores.sort((a, b) => b.s - a.s);
  const best = scores[0]?.pattern ?? "value";
  return { pattern: best, label: PATTERN_KEYWORDS[best].label };
}

function splitMemoLines(raw: string): string[] {
  return raw
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function outlineForPattern(
  pattern: VictoryPattern,
  lines: string[],
): { titles: string[]; notes: string[] } {
  const pool = lines.length ? lines : ["メッセージを入力してください"];
  const take = (i: number) => pool[i % pool.length];

  const templates: Record<VictoryPattern, string[]> = {
    value: [
      "誰の・どんな課題を解決するか",
      "提供価値の核心（一言）",
      "機能・仕組みの要約",
      "導入効果（定量・定性）",
      "次のアクション",
    ],
    compare: [
      "現状（Before）の限界",
      "提案（After）の全体像",
      "比較軸と優位性",
      "移行・導入の容易さ",
      "意思決定の呼びかけ",
    ],
    trust: [
      "信頼の根拠（実績・顧客層）",
      "プロセスの透明性",
      "第三者評価・認証",
      "代表事例（短く）",
      "伴走体制",
    ],
    anxiety: [
      "想定される不安の列挙",
      "リスク低減の設計",
      "セキュリティ・コンプライアンス",
      "サポート・保証",
      "よくある質問への回答",
    ],
    forecast: [
      "マクロ環境の変化",
      "業界インパクト",
      "自社の立ち位置",
      "シナリオ別の分岐",
      "いま取るべき一手",
    ],
    launch: [
      "ローンチの一言要約",
      "ターゲットと価格帯",
      "差別化ポイント",
      "提供開始・特典",
      "入手方法",
    ],
    webinar: [
      "参加メリット（一言）",
      "アジェンダ",
      "対象者・前提知識",
      "登壇者・権威性",
      "申込・当日の流れ",
    ],
    pitch: [
      "解く課題と市場規模",
      "ソリューション概要",
      "ビジネスモデル",
      "トラクション",
      "調達の使途とマイルストーン",
    ],
  };

  const titles = templates[pattern];
  const notes = titles.map((_, i) => take(i));
  return { titles, notes };
}

export function runStrategist(
  raw: string,
  push: (e: AgentStatusEntry) => void,
): { pattern: VictoryPattern; label: string; slides: SlideDeckSlide[] } {
  const { pattern, label } = selectVictoryPattern(raw);
  push({
    agent: "strategist",
    phase: "pattern_select",
    detail: `勝利パターン「${label}」を選定（1スライド1メッセージの骨格を生成）`,
    at: new Date().toISOString(),
  });
  const lines = splitMemoLines(raw);
  const { titles, notes } = outlineForPattern(pattern, lines);

  const slides: SlideDeckSlide[] = titles.map((title, i) => ({
    id: `s${i + 1}`,
    keyMessage: title,
    prep: {
      point: notes[i] ?? title,
      reason: "メモと論理パターンに整合する要約",
      example: lines[i] ?? notes[i] ?? "",
      pointRepeat: title,
    },
    layout: "parallel",
    layoutRationale: "初期値（Visualizerが再割当）",
    elements: [],
    speakerNotes: notes[i] ?? "",
  }));

  push({
    agent: "strategist",
    phase: "structure",
    detail: `全${slides.length}枚の構成ドラフトを作成`,
    at: new Date().toISOString(),
  });

  return { pattern, label, slides };
}
