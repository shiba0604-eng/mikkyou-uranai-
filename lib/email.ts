import { Resend } from "resend";
import { type DangerAssessment } from "./shukuyo";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "宿曜道 <fortune@yourdomain.com>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

const LEVEL_EMOJI: Record<string, string> = {
  大凶: "⛔", 凶: "🔴", 注意: "🟠", 平: "⚪",
  中吉: "🔵", 吉: "🟢", 大吉: "⭐",
};

const LEVEL_COLOR: Record<string, string> = {
  大凶: "#ef4444", 凶: "#dc2626", 注意: "#f97316",
  平: "#9ca3af", 中吉: "#60a5fa", 吉: "#4ade80", 大吉: "#fbbf24",
};

export async function sendDailyFortune(
  email: string,
  userId: string,
  assessment: DangerAssessment
) {
  const { birthShuku, todayShuku, avoidanceLevel, dangerScore, warningMessage, protectiveMantra, topAvoids, rikkai } = assessment;

  const emoji = LEVEL_EMOJI[avoidanceLevel] ?? "⚪";
  const color = LEVEL_COLOR[avoidanceLevel] ?? "#9ca3af";
  const unsubscribeUrl = `${BASE_URL}/unsubscribe?uid=${userId}`;

  const isDanger = ["大凶", "凶", "注意"].includes(avoidanceLevel);
  const barColor = dangerScore >= 70 ? "#dc2626" : dangerScore >= 55 ? "#f97316" : "#22c55e";

  const avoidsHtml = isDanger && topAvoids.length > 0
    ? `<tr><td style="padding:16px;background:#1a0a08;border:1px solid #7c2d12;border-radius:8px;margin-top:12px">
        <p style="margin:0 0 8px;color:#fb923c;font-size:13px;font-weight:bold">▲ 今日避けるべき行動</p>
        ${topAvoids.map(a => `<p style="margin:4px 0;color:#fde8d5;font-size:12px">▲ ${a}</p>`).join("")}
       </td></tr>`
    : "";

  const rikkaiHtml = rikkai.isRikkai
    ? `<tr><td style="padding:16px;background:#1a0000;border:2px solid #dc2626;border-radius:8px;margin-top:12px">
        <p style="margin:0 0 6px;color:#f87171;font-size:14px;font-weight:bold">⚠ 六害宿：${rikkai.rikkaType}</p>
        <p style="margin:0 0 10px;color:#fca5a5;font-size:12px">${rikkai.description}</p>
        <p style="margin:0 0 6px;color:#ef4444;font-size:12px;font-weight:bold">今日、絶対にやってはいけないこと：</p>
        ${rikkai.absoluteAvoid.map(a => `<p style="margin:3px 0;color:#fecaca;font-size:12px">✕ ${a}</p>`).join("")}
       </td></tr>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#03000A;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#03000A;padding:24px 0">
<tr><td align="center">
<table width="100%" style="max-width:520px;background:#0a0318;border:1px solid rgba(212,175,55,0.25);border-radius:16px;overflow:hidden">

  <!-- ヘッダー -->
  <tr><td style="background:linear-gradient(135deg,#0d0420,#1a0a2e);padding:28px 24px;text-align:center;border-bottom:1px solid rgba(212,175,55,0.15)">
    <p style="margin:0 0 4px;color:rgba(212,175,55,0.6);font-size:11px;letter-spacing:0.3em;text-transform:uppercase">Mikkyō Astrology</p>
    <h1 style="margin:0 0 4px;color:#D4AF37;font-size:22px;letter-spacing:0.1em">避凶の宿曜道</h1>
    <p style="margin:0;color:#7A6A50;font-size:11px">${assessment.date} の鑑定</p>
  </td></tr>

  <tr><td style="padding:20px 20px 0">
  <table width="100%" cellpadding="0" cellspacing="12">

    <!-- 本命宿 & 今日の宿 -->
    <tr><td style="padding:14px;background:#0d0620;border:1px solid rgba(212,175,55,0.2);border-radius:8px">
      <table width="100%">
        <tr>
          <td style="text-align:center;border-right:1px solid rgba(212,175,55,0.1);padding-right:12px">
            <p style="margin:0 0 2px;color:#7A6A50;font-size:10px;letter-spacing:0.2em">本命宿</p>
            <p style="margin:0;color:#D4AF37;font-size:20px;font-weight:bold">${birthShuku.name.replace("宿","")}</p>
            <p style="margin:0;color:#5a4a3a;font-size:10px">${birthShuku.reading}</p>
          </td>
          <td style="text-align:center;padding-left:12px">
            <p style="margin:0 0 2px;color:#7A6A50;font-size:10px;letter-spacing:0.2em">今日の宿</p>
            <p style="margin:0;color:#e8d5a3;font-size:20px;font-weight:bold">${todayShuku.name.replace("宿","")}</p>
            <p style="margin:0;color:#5a4a3a;font-size:10px">${todayShuku.reading}</p>
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- 判定 -->
    <tr><td style="padding:16px;background:#0d0620;border:1px solid ${color}40;border-radius:8px">
      <table width="100%">
        <tr>
          <td>
            <p style="margin:0 0 4px;color:#9b8a6a;font-size:11px">今日の判定</p>
            <p style="margin:0;color:${color};font-size:26px;font-weight:bold">${emoji} ${avoidanceLevel}</p>
          </td>
          <td style="text-align:right">
            <p style="margin:0 0 4px;color:#9b8a6a;font-size:10px">危険スコア</p>
            <p style="margin:0;color:${barColor};font-size:22px;font-weight:bold">${dangerScore}<span style="font-size:12px;color:#5a4a3a">/100</span></p>
          </td>
        </tr>
      </table>
      <!-- スコアバー -->
      <div style="margin-top:10px;background:#030010;border-radius:4px;height:6px;overflow:hidden">
        <div style="width:${dangerScore}%;height:100%;background:${barColor};border-radius:4px"></div>
      </div>
      <p style="margin:10px 0 0;color:${color};font-size:13px">${warningMessage}</p>
    </td></tr>

    <!-- 六害宿アラート -->
    ${rikkaiHtml}

    <!-- 今日の回避行動 -->
    ${avoidsHtml}

    <!-- 護身真言 -->
    <tr><td style="padding:16px;background:#0d0620;border:1px solid rgba(212,175,55,0.15);border-radius:8px;text-align:center">
      <p style="margin:0 0 8px;color:#7A6A50;font-size:10px;letter-spacing:0.3em">今日の護身真言</p>
      <p style="margin:0 0 6px;color:#D4AF37;font-size:14px;font-weight:bold;letter-spacing:0.2em">${protectiveMantra}</p>
      <p style="margin:0;color:#5a4a3a;font-size:10px">守護星：${birthShuku.element}曜</p>
    </td></tr>

    <!-- 感謝の言葉 -->
    <tr><td style="padding:12px 16px;text-align:center">
      <p style="margin:0 0 4px;color:#7A6A50;font-size:10px">魂をきれいにする言葉（朝10回）</p>
      <p style="margin:0;color:#e8d5a3;font-size:14px;font-weight:bold">「辛くてありがとう」</p>
      <p style="margin:4px 0 0;color:#5a4a3a;font-size:10px">大難 → 中難 → 小難 → 無難</p>
    </td></tr>

  </table>
  </td></tr>

  <!-- フッター -->
  <tr><td style="padding:16px 24px;border-top:1px solid rgba(212,175,55,0.1);text-align:center">
    <p style="margin:0 0 6px;color:#3A2A1A;font-size:10px">このメールは毎朝6:30に自動配信されます</p>
    <a href="${unsubscribeUrl}" style="color:#3A2A1A;font-size:10px;text-decoration:underline">配信停止はこちら</a>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `${emoji}【宿曜道】${assessment.date} 本命${birthShuku.name.replace("宿","")}の今日：${avoidanceLevel}（危険${dangerScore}/100）`,
    html,
  });
}

export async function sendWelcomeEmail(
  email: string,
  userId: string,
  assessment: DangerAssessment
) {
  const { birthShuku } = assessment;
  const unsubscribeUrl = `${BASE_URL}/unsubscribe?uid=${userId}`;

  const html = `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#03000A;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#03000A;padding:24px 0">
<tr><td align="center">
<table width="100%" style="max-width:520px;background:#0a0318;border:1px solid rgba(212,175,55,0.25);border-radius:16px;overflow:hidden">

  <!-- ヘッダー -->
  <tr><td style="background:linear-gradient(135deg,#0d0420,#1a0a2e);padding:32px 24px;text-align:center;border-bottom:1px solid rgba(212,175,55,0.15)">
    <p style="margin:0 0 8px;color:rgba(212,175,55,0.6);font-size:11px;letter-spacing:0.3em;text-transform:uppercase">Mikkyō Astrology</p>
    <h1 style="margin:0 0 6px;color:#D4AF37;font-size:26px;letter-spacing:0.1em">✦ ようこそ ✦</h1>
    <h2 style="margin:0;color:#e8d5a3;font-size:16px;font-weight:normal">避凶の宿曜道へ</h2>
  </td></tr>

  <!-- 本文 -->
  <tr><td style="padding:28px 24px">
    <p style="margin:0 0 16px;color:#e8d5a3;font-size:14px;line-height:1.8">
      登録ありがとうございます。<br>
      あなたの本命宿は <strong style="color:#D4AF37;font-size:16px">${birthShuku.name}</strong>（${birthShuku.reading}）です。
    </p>

    <div style="background:#0d0620;border:1px solid rgba(212,175,55,0.2);border-radius:10px;padding:16px;margin-bottom:20px">
      <p style="margin:0 0 10px;color:#D4AF37;font-size:13px;font-weight:bold">毎朝6:30に届くもの</p>
      <p style="margin:4px 0;color:#9b8a6a;font-size:12px">✦ 今日の宿と危険スコア（0〜100）</p>
      <p style="margin:4px 0;color:#9b8a6a;font-size:12px">✦ 六害宿アラート（大凶日の事前通知）</p>
      <p style="margin:4px 0;color:#9b8a6a;font-size:12px">✦ 今日避けるべき具体的な行動</p>
      <p style="margin:4px 0;color:#9b8a6a;font-size:12px">✦ 今日の護身真言</p>
    </div>

    <div style="background:#0d0620;border:1px solid rgba(212,175,55,0.15);border-radius:10px;padding:16px;margin-bottom:20px">
      <p style="margin:0 0 10px;color:#D4AF37;font-size:13px;font-weight:bold">宿曜道の使い方</p>
      <p style="margin:0 0 8px;color:#9b8a6a;font-size:12px;line-height:1.7">
        <strong style="color:#e8d5a3">①</strong> 毎朝メールを確認して危険スコアをチェック
      </p>
      <p style="margin:0 0 8px;color:#9b8a6a;font-size:12px;line-height:1.7">
        <strong style="color:#e8d5a3">②</strong> 「凶・大凶」の日は重要な決断・契約・投資を避ける
      </p>
      <p style="margin:0 0 8px;color:#9b8a6a;font-size:12px;line-height:1.7">
        <strong style="color:#e8d5a3">③</strong> 「吉・大吉」の日に大切なことを実行する
      </p>
      <p style="margin:0;color:#9b8a6a;font-size:12px;line-height:1.7">
        <strong style="color:#e8d5a3">④</strong> 朝10回「辛くてありがとう」と唱える
      </p>
    </div>

    <div style="background:#100005;border:1px solid rgba(220,38,38,0.2);border-radius:10px;padding:14px;margin-bottom:20px">
      <p style="margin:0 0 6px;color:#f87171;font-size:12px;font-weight:bold">⚠ 六害宿（ろくがいしゅく）について</p>
      <p style="margin:0;color:#9b8a6a;font-size:12px;line-height:1.7">
        あなたの本命宿から特定の距離にある宿の日は「六害宿」となり、
        損失・破壊・身の危険が集中しやすい大凶日です。
        メールで事前にお知らせするので、その日だけは行動を最小化してください。
      </p>
    </div>

    <p style="margin:0;color:#7A6A50;font-size:12px;line-height:1.7;text-align:center">
      守護星：${birthShuku.element}曜 ─ あなたを守る星が照らし続けます
    </p>
  </td></tr>

  <!-- 今日の鑑定へのリンク -->
  <tr><td style="padding:0 24px 24px;text-align:center">
    <a href="${BASE_URL}" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#8B6914,#D4AF37,#8B6914);color:#03000A;font-size:13px;font-weight:bold;text-decoration:none;border-radius:8px;letter-spacing:0.15em">
      今日の鑑定を見る
    </a>
  </td></tr>

  <!-- フッター -->
  <tr><td style="padding:16px 24px;border-top:1px solid rgba(212,175,55,0.1);text-align:center">
    <p style="margin:0 0 6px;color:#3A2A1A;font-size:10px">このメールは毎朝6:30に自動配信されます</p>
    <a href="${unsubscribeUrl}" style="color:#3A2A1A;font-size:10px;text-decoration:underline">配信停止はこちら</a>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `✦ 登録完了｜あなたの本命宿は${birthShuku.name}です【宿曜道】`,
    html,
  });
}
