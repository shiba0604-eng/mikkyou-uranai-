import {
  consumeExportCredit,
  getCreditsByEmail,
} from "@/lib/highstakes/credits";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }
  try {
    const balance = await getCreditsByEmail(email);
    return NextResponse.json({ balance });
  } catch {
    return NextResponse.json({ error: "credits_unavailable" }, { status: 503 });
  }
}

const consumeSchema = z.object({
  email: z.string().email(),
  slideCount: z.number().int().min(1).max(200),
  dnaId: z.string(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email, slideCount, dnaId } = consumeSchema.parse(json);
    const result = await consumeExportCredit(email, slideCount, dnaId);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, balance: result.balance, error: "insufficient_credits" },
        { status: 402 },
      );
    }
    return NextResponse.json({ ok: true, balance: result.balance });
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
}
