import { runConsensusPipeline } from "@lib/agents";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  notes: z.string().min(1).max(20000),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { notes } = bodySchema.parse(json);
    const result = runConsensusPipeline(notes);
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
