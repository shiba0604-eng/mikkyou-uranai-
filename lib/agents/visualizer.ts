import type { AgentStatusEntry, SlideDeckSlide, VisualLayout } from "./types";

const LAYOUT_CLASS: Record<VisualLayout, string> = {
  parallel: "hs-layout hs-parallel",
  trend: "hs-layout hs-trend",
  contrast: "hs-layout hs-contrast",
  nested: "hs-layout hs-nested",
};

function detectLayout(sl: SlideDeckSlide): VisualLayout {
  const blob = [
    sl.keyMessage,
    sl.speakerNotes,
    ...sl.elements.map((e) => e.content),
  ]
    .join(" ")
    .toLowerCase();

  if (/比較|vs|before|after|新旧|対比|一方|他方/u.test(blob)) return "contrast";
  if (/推移|トレンド|成長|時系列|フェーズ|ロードマップ/u.test(blob))
    return "trend";
  if (/包含|全体像|構造|階層|エコシステム|スタック/u.test(blob))
    return "nested";
  return "parallel";
}

export function runVisualizer(
  slides: SlideDeckSlide[],
  push: (e: AgentStatusEntry) => void,
): SlideDeckSlide[] {
  push({
    agent: "visualizer",
    phase: "decode",
    detail: "文章関係性を解読し4レイアウト（並列・推移・対比・包含）へ割当",
    at: new Date().toISOString(),
  });

  const next = slides.map((sl) => {
    const layout = detectLayout(sl);
    return {
      ...sl,
      layout,
      layoutRationale: `キーワードとメッセージ構造から「${layout}」が最適`,
    };
  });

  push({
    agent: "visualizer",
    phase: "css_map",
    detail: `CSSクラス: ${[...new Set(next.map((s) => LAYOUT_CLASS[s.layout]))].join(", ")}`,
    at: new Date().toISOString(),
  });

  return next;
}

export function layoutClass(layout: VisualLayout): string {
  return LAYOUT_CLASS[layout];
}
