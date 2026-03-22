import { runCopywriter } from "./copywriter";
import { runReviewer } from "./reviewer";
import { runStrategist } from "./strategist";
import type { AgentStatusEntry, OrchestratorResult, SlideDeckSlide } from "./types";
import { runVisualizer } from "./visualizer";

const MAX_ITER = 3;

function tightenSlides(slides: SlideDeckSlide[]): SlideDeckSlide[] {
  return slides.map((sl) => ({
    ...sl,
    keyMessage:
      sl.keyMessage.length > 36
        ? sl.keyMessage.slice(0, 35) + "…"
        : sl.keyMessage,
    elements: sl.elements.map((e) => ({
      ...e,
      content:
        e.content.length > 120 ? e.content.slice(0, 118) + "…" : e.content,
    })),
  }));
}

export function runConsensusPipeline(rawNotes: string): OrchestratorResult {
  const statusLog: AgentStatusEntry[] = [];
  const push = (e: AgentStatusEntry) => statusLog.push(e);

  const { pattern, label, slides: s0 } = runStrategist(rawNotes, push);
  let slides = runCopywriter(s0, push);
  slides = runVisualizer(slides, push);
  let review = runReviewer(slides, push);
  let iterations = 0;

  while (!review.passed && iterations < MAX_ITER) {
    iterations += 1;
    push({
      agent: "reviewer",
      phase: "retake",
      detail: `70点以下のため自動リテイク（第${iterations}回）: ${review.feedback}`,
      at: new Date().toISOString(),
    });
    slides = tightenSlides(slides);
    slides = runCopywriter(slides, push);
    slides = runVisualizer(slides, push);
    review = runReviewer(slides, push);
  }

  if (!review.passed) {
    push({
      agent: "reviewer",
      phase: "force_accept",
      detail: "最大反復に達したため、現行稿をディレクター承認待ちとして提示",
      at: new Date().toISOString(),
    });
  }

  return {
    pattern,
    patternLabel: label,
    slides,
    review,
    iterations,
    statusLog,
  };
}
