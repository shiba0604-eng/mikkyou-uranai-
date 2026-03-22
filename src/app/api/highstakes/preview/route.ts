import type { DesignDnaId, SlideDeckSlide } from "@lib/agents/types";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  buildMarpMarkdown,
  renderMarpToHtml,
  wrapPreviewDocument,
} from "@/lib/highstakes/marp-render";

const slideSchema = z.object({
  id: z.string(),
  keyMessage: z.string(),
  prep: z.object({
    point: z.string(),
    reason: z.string(),
    example: z.string(),
    pointRepeat: z.string(),
  }),
  layout: z.enum(["parallel", "trend", "contrast", "nested"]),
  layoutRationale: z.string(),
  elements: z.array(
    z.object({
      id: z.string(),
      kind: z.enum(["title", "bullet", "callout"]),
      content: z.string(),
      rationale: z.string(),
      alternatives: z.array(
        z.object({
          label: z.string(),
          text: z.string(),
          rationale: z.string(),
        }),
      ),
    }),
  ),
  speakerNotes: z.string(),
});

const dnaIdSchema = z.enum([
  "executive_trust",
  "tech_minimal",
  "authority_gold",
  "editorial_magazine",
]);

const bodySchema = z.object({
  slides: z.array(slideSchema),
  dnaId: dnaIdSchema,
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { slides, dnaId } = bodySchema.parse(json) as {
      slides: SlideDeckSlide[];
      dnaId: DesignDnaId;
    };
    const md = buildMarpMarkdown(slides, dnaId);
    const { html, css } = await renderMarpToHtml(md);
    const doc = wrapPreviewDocument(html, css, dnaId);
    return NextResponse.json({ html: doc });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
