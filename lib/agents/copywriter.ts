import type { AgentStatusEntry, SlideDeckSlide } from "./types";

function trimToHeadline(s: string, max = 28): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "…";
}

/** 体言止めっぽく末尾の「です・ます」を削る（簡易） */
function nominalize(s: string): string {
  return s
    .replace(/です$/u, "")
    .replace(/ます$/u, "")
    .replace(/でした$/u, "")
    .replace(/ました$/u, "")
    .replace(/である$/u, "")
    .trim();
}

/** おおまかに30%短縮：接続詞・冗長フレーズを圧縮 */
function shorten30(s: string): string {
  return s
    .replace(/つまり|すなわち|なお|また|さらに/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function makeAlternatives(
  base: string,
  kind: "title" | "bullet",
): { label: string; text: string; rationale: string }[] {
  const a =
    kind === "title"
      ? nominalize(trimToHeadline(base, 22))
      : nominalize(shorten30(base));
  return [
    {
      label: "A: 体言止め強め",
      text: a || base,
      rationale: "スライド冒頭で結論を一瞬で掴ませる",
    },
    {
      label: "B: PREP結論先出し",
      text: trimToHeadline(`結論: ${base}`, 40),
      rationale: "外資デックで好まれる明示型タイトル",
    },
    {
      label: "C: 数字・固有名詞",
      text: trimToHeadline(base.replace(/[。．]/g, "／"), 32),
      rationale: "検証可能性を高め信頼を補強",
    },
  ];
}

export function runCopywriter(
  slides: SlideDeckSlide[],
  push: (e: AgentStatusEntry) => void,
): SlideDeckSlide[] {
  push({
    agent: "copywriter",
    phase: "prep",
    detail: "PREP法で各スライドのキーメッセージを整形",
    at: new Date().toISOString(),
  });

  const next = slides.map((sl) => {
    const point = nominalize(trimToHeadline(sl.prep.point, 36));
    const reason = shorten30(sl.prep.reason);
    const example = trimToHeadline(sl.prep.example, 48);
    const pointRepeat = nominalize(trimToHeadline(sl.keyMessage, 28));

    const titleEl = {
      id: `${sl.id}-title`,
      kind: "title" as const,
      content: pointRepeat,
      rationale:
        "1スライド1メッセージとして、タイトルを結論（Point）に固定",
      alternatives: makeAlternatives(pointRepeat, "title"),
    };

    const bullets = [
      `理由: ${reason}`,
      example ? `根拠・例示: ${example}` : "根拠・例示: （メモを追記）",
      `再掲: ${pointRepeat}`,
    ].map((b, i) => ({
      id: `${sl.id}-b${i}`,
      kind: "bullet" as const,
      content: shorten30(b),
      rationale: "PREPのR-E-Pを箇条書きに分解し視認性を確保",
      alternatives: makeAlternatives(b, "bullet"),
    }));

    return {
      ...sl,
      keyMessage: pointRepeat,
      prep: {
        point,
        reason,
        example,
        pointRepeat,
      },
      elements: [titleEl, ...bullets],
      speakerNotes: [point, reason, example].filter(Boolean).join(" / "),
    };
  });

  push({
    agent: "copywriter",
    phase: "polish",
    detail: "体言止め・30%要約ルールを適用し代替案を3案ずつ生成",
    at: new Date().toISOString(),
  });

  return next;
}
