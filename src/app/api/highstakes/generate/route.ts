import { runConsensusPipeline } from "@lib/agents";
import { HIGHSTAKES_NOTES_MAX } from "@/lib/highstakes/limits";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  notes: z.string().min(1).max(HIGHSTAKES_NOTES_MAX),
});

function zodToUserMessage(e: z.ZodError): string {
  const issue = e.issues[0];
  if (!issue) return "入力内容を確認してください。";
  const path = issue.path.join(".");
  if (path === "notes" && issue.code === "too_big") {
    return `メモが長すぎます（最大 ${HIGHSTAKES_NOTES_MAX.toLocaleString("ja-JP")} 文字まで）。要約して貼るか、分割してください。`;
  }
  if (path === "notes" && issue.code === "too_small") {
    return "メモが空です。";
  }
  return "入力形式が正しくありません。";
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { notes } = bodySchema.parse(json);
    const result = runConsensusPipeline(notes);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: zodToUserMessage(e) },
        { status: 400 },
      );
    }
    const msg = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
