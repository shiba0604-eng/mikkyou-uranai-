import type { AgentStatusEntry, ReviewResult, SlideDeckSlide } from "./types";

function gradeSlide(sl: SlideDeckSlide): { points: number; notes: string[] } {
  let points = 0;
  const notes: string[] = [];
  const max = 20;

  // 1メッセージ性（タイトル短さ）
  if (sl.keyMessage.length > 0 && sl.keyMessage.length <= 32) {
    points += 5;
  } else {
    notes.push("タイトルが長すぎる可能性（1メッセージの徹底）");
    points += 2;
  }

  // PREP要素の存在
  const hasReason = sl.elements.some((e) => e.content.includes("理由"));
  const hasExample = sl.elements.some((e) => e.content.includes("根拠"));
  if (hasReason && hasExample) points += 5;
  else {
    notes.push("PREPの根拠・例示を補強");
    points += 2;
  }

  // 代替案（ディレクション用）
  const altsOk = sl.elements.every((e) => e.alternatives.length >= 3);
  if (altsOk) points += 5;
  else {
    notes.push("代替案が不足");
    points += 2;
  }

  // レイアウト整合
  if (sl.layoutRationale) points += 5;
  else points += 2;

  return { points: Math.min(max, points), notes };
}

export function runReviewer(
  slides: SlideDeckSlide[],
  push: (e: AgentStatusEntry) => void,
): ReviewResult {
  push({
    agent: "reviewer",
    phase: "checklist",
    detail: "外資コンサル基準チェックリストで全スライドを採点",
    at: new Date().toISOString(),
  });

  const checklist: ReviewResult["checklist"] = [
    {
      item: "So What が各スライド冒頭に明確",
      ok: slides.every((s) => s.keyMessage.length > 0),
    },
    {
      item: "論理飛躍のないPREP構造",
      ok: slides.every((s) => s.elements.length >= 2),
    },
    {
      item: "1スライド1メッセージ",
      ok: slides.every((s) => s.keyMessage.length <= 40),
      note: "40文字超は減点対象",
    },
    {
      item: "図解レイアウトの一貫性",
      ok: slides.every((s) => Boolean(s.layout)),
    },
    {
      item: "代替案3件（ホバー提案用）",
      ok: slides.every((s) =>
        s.elements.every((e) => e.alternatives.length >= 3),
      ),
    },
  ];

  const per = slides.map((s) => gradeSlide(s));
  const raw =
    (per.reduce((a, p) => a + p.points, 0) / (slides.length * 20 || 1)) * 100;
  const penalty = checklist.filter((c) => !c.ok).length * 6;
  const score = Math.max(0, Math.min(100, Math.round(raw - penalty)));

  const feedback = [
    ...checklist.filter((c) => !c.ok).map((c) => c.item),
    ...per.flatMap((p) => p.notes),
  ].join(" / ");

  const passed = score > 70;

  push({
    agent: "reviewer",
    phase: "score",
    detail: `総合 ${score} 点 — ${passed ? "合格" : "リテイク指示"}`,
    at: new Date().toISOString(),
  });

  return {
    score,
    passed,
    checklist,
    feedback: feedback || "問題なし",
  };
}
