import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { assessDanger } from "../../../../lib/shukuyo";
import { sendWelcomeEmail, sendDailyFortune } from "../../../../lib/email";

export async function POST(req: NextRequest) {
  const { email, birthYear, birthMonth, birthDay } = await req.json().catch(() => ({}));

  if (!email || !birthYear || !birthMonth || !birthDay) {
    return NextResponse.json({ error: "入力が不足しています" }, { status: 400 });
  }

  const y = parseInt(birthYear), m = parseInt(birthMonth), d = parseInt(birthDay);
  if (isNaN(y) || isNaN(m) || isNaN(d)) {
    return NextResponse.json({ error: "日付が正しくありません" }, { status: 400 });
  }

  // ── DB 保存（失敗したらここで 500）──
  let user: { id: string };
  let isNew = false;
  try {
    isNew = !(await prisma.user.findUnique({ where: { email } }));
    user = await prisma.user.upsert({
      where: { email },
      update: { birthYear: y, birthMonth: m, birthDay: d },
      create: { email, birthYear: y, birthMonth: m, birthDay: d },
    });
  } catch (err) {
    console.error("[register] DB error:", err);
    return NextResponse.json({ error: "DB_ERROR", detail: String(err) }, { status: 500 });
  }

  // ── メール送信（失敗しても DB 登録は成功扱い）──
  const assessment = assessDanger(y, m, d);
  const emailResults: Record<string, unknown> = {};

  try {
    if (isNew) {
      const r1 = await sendWelcomeEmail(email, user.id, assessment);
      emailResults.welcome = r1;
    }
    const r2 = await sendDailyFortune(email, user.id, assessment);
    emailResults.daily = r2;
  } catch (err) {
    console.error("[register] Email error:", err);
    emailResults.error = String(err);
  }

  return NextResponse.json({ ok: true, userId: user.id, isNew, emailResults });
}
