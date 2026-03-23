import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// デバッグ専用エンドポイント（本番では削除推奨）
// GET /api/test-email?to=your@email.com
export async function GET(req: NextRequest) {
  const to = req.nextUrl.searchParams.get("to");
  if (!to) {
    return NextResponse.json({ error: "?to=メールアドレス が必要です" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

  if (!apiKey || apiKey.startsWith("re_xxx")) {
    return NextResponse.json({
      error: "RESEND_API_KEY が設定されていません",
      env: { apiKey: apiKey?.slice(0, 8) + "...", from },
    }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject: "【宿曜道】メール送信テスト",
      html: "<p style='font-family:sans-serif'>テスト送信成功です。宿曜道のメール配信が正常に動作しています。</p>",
    });

    return NextResponse.json({ ok: true, result, env: { from } });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err), env: { from } }, { status: 500 });
  }
}
