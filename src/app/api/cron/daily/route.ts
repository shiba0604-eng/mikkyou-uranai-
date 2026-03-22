import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";
import { assessDanger } from "../../../../../lib/shukuyo";
import { sendDailyFortune } from "../../../../../lib/email";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  // Vercel Cron または CRON_SECRET を持つリクエストのみ許可
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany();
  const today = new Date().toISOString().slice(0, 10);

  const results = { sent: 0, skipped: 0, errors: 0 };

  for (const user of users) {
    // 既送信チェック
    const alreadySent = await prisma.fortuneLog.findFirst({
      where: { userId: user.id, date: today },
    });
    if (alreadySent) { results.skipped++; continue; }

    try {
      const assessment = assessDanger(user.birthYear, user.birthMonth, user.birthDay);
      await sendDailyFortune(user.email, user.id, assessment);

      await prisma.fortuneLog.create({
        data: {
          userId: user.id,
          date: today,
          birthShuku: assessment.birthShuku.name,
          todayShuku: assessment.todayShuku.name,
          avoidanceLevel: assessment.avoidanceLevel,
          dangerScore: assessment.dangerScore,
          isRikkai: assessment.rikkai.isRikkai,
        },
      });

      results.sent++;
    } catch (err) {
      console.error(`[cron] failed for ${user.email}:`, err);
      results.errors++;
    }
  }

  console.log(`[cron daily] ${today}:`, results);
  return NextResponse.json({ date: today, ...results });
}
