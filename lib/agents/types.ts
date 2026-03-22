export type VictoryPattern =
  | "value"
  | "compare"
  | "trust"
  | "anxiety"
  | "forecast"
  | "launch"
  | "webinar"
  | "pitch";

export type VisualLayout = "parallel" | "trend" | "contrast" | "nested";

export type DesignDnaId =
  | "executive_trust"
  | "tech_minimal"
  | "authority_gold"
  | "editorial_magazine";

export type SlideElementKind = "title" | "bullet" | "callout";

export interface SlideAlternative {
  label: string;
  text: string;
  rationale: string;
}

export interface SlideElement {
  id: string;
  kind: SlideElementKind;
  content: string;
  rationale: string;
  alternatives: SlideAlternative[];
}

export interface SlideDeckSlide {
  id: string;
  keyMessage: string;
  prep: { point: string; reason: string; example: string; pointRepeat: string };
  layout: VisualLayout;
  layoutRationale: string;
  elements: SlideElement[];
  speakerNotes: string;
}

export interface AgentStatusEntry {
  agent: "strategist" | "copywriter" | "visualizer" | "reviewer";
  phase: string;
  detail: string;
  at: string;
}

export interface ReviewResult {
  score: number;
  passed: boolean;
  checklist: { item: string; ok: boolean; note?: string }[];
  feedback: string;
}

export interface OrchestratorResult {
  pattern: VictoryPattern;
  patternLabel: string;
  slides: SlideDeckSlide[];
  review: ReviewResult;
  iterations: number;
  statusLog: AgentStatusEntry[];
}
