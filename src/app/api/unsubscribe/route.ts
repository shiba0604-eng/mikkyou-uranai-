import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");
  if (!uid) return NextResponse.redirect(new URL("/", req.url));

  try {
    await prisma.user.delete({ where: { id: uid } });
  } catch {
    // already deleted — no-op
  }

  return new NextResponse(
    `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>配信停止</title>
    <style>body{background:#03000A;color:#D4AF37;font-family:serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center}</style>
    </head><body><div><p style="font-size:1.5rem">配信を停止しました</p><p style="color:#7A6A50;font-size:0.9rem">またいつでも登録できます</p></div></body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
