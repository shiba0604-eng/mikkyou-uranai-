import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { assessDanger } from "../../../../lib/shukuyo";
import { sendDailyFortune } from "../../../../lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, birthYear, birthMonth, birthDay } = await req.json();

    if (!email || !birthYear || !birthMonth || !birthDay) {
      return NextResponse.json({ error: "入力が不足しています" }, { status: 400 });
    }

    const y = parseInt(birthYear), m = parseInt(birthMonth), d = parseInt(birthDay);
    if (isNaN(y) || isNaN(m) || isNaN(d)) {
      return NextResponse.json({ error: "日付が正しくありません" }, { status: 400 });
    }

    // upsert（既存ユーザーは更新）
    const user = await prisma.user.upsert({
      where: { email },
      update: { birthYear: y, birthMonth: m, birthDay: d },
      create: { email, birthYear: y, birthMonth: m, birthDay: d },
    });

    // 登録確認メールとして今日の鑑定を即送信
    const assessment = assessDanger(y, m, d);
    await sendDailyFortune(email, user.id, assessment);

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 });
  }
}
