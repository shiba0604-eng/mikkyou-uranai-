"use client";

import { type DangerAssessment } from "../../lib/shukuyo";
import { getKamisama, getTodayIchi, getTodayMon } from "../../lib/ichi";
import CircleDisk from "./CircleDisk";

const LEVEL_COLOR: Record<string, string> = {
  大凶: "text-red-400", 凶: "text-red-500",
  注意: "text-orange-400", 平: "text-gray-400",
  中吉: "text-blue-400", 吉: "text-green-400", 大吉: "text-yellow-400",
};
const LEVEL_BG: Record<string, string> = {
  大凶: "bg-red-900/40 border-red-600", 凶: "bg-red-900/30 border-red-700",
  注意: "bg-orange-900/30 border-orange-600", 平: "bg-gray-900/30 border-gray-600",
  中吉: "bg-blue-900/20 border-blue-700", 吉: "bg-green-900/20 border-green-700",
  大吉: "bg-yellow-900/20 border-yellow-600",
};

export default function DangerDashboard({ assessment }: { assessment: DangerAssessment }) {
  const { birthShuku, todayShuku, avoidanceLevel, rikkai, warningMessage, protectiveMantra } = assessment;

  const kamisama = getKamisama(birthShuku.index);
  const ichi = getTodayIchi(birthShuku.index, todayShuku.index);
  const mon  = getTodayMon(birthShuku.index, todayShuku.index);

  const isDanger = ["大凶","凶","注意"].includes(avoidanceLevel);
  const levelColor = LEVEL_COLOR[avoidanceLevel] ?? "text-gray-400";
  const levelBg    = LEVEL_BG[avoidanceLevel] ?? "bg-gray-900/30 border-gray-600";

  return (
    <div className="flex flex-col gap-4 w-full max-w-xl mx-auto">

      {/* ── ヘッダー：本命宿 & 神様タイプ ── */}
      <div className="bg-[#1a0a2e] border border-[#C9A84C]/40 rounded-2xl p-5 text-center">
        <p className="text-[#9b8a6a] text-xs tracking-widest mb-1">あなたの宿命</p>
        <p className="text-[#C9A84C] text-2xl font-bold mb-1">{kamisama}</p>
        <p className="text-[#e8d5a3] text-sm">
          本命宿：<span className="text-[#C9A84C] font-bold">{birthShuku.name}</span>
          <span className="text-[#9b8a6a] text-xs ml-1">（{birthShuku.reading}）</span>
        </p>
      </div>

      {/* ── 円盤 ── */}
      <div className="bg-[#1a0a2e] border border-[#2a1a3e] rounded-2xl p-4">
        <CircleDisk birthShuku={birthShuku} todayShuku={todayShuku} />
      </div>

      {/* ── 今日の判定 ── */}
      <div className={`border rounded-2xl p-5 ${levelBg}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[#9b8a6a] text-xs">{assessment.date}</p>
            <p className="text-[#e8d5a3] text-sm mt-0.5">
              今日の宿：<span className="font-bold text-[#C9A84C]">{todayShuku.name}</span>
              <span className="text-[#9b8a6a] text-xs ml-1">（{todayShuku.reading}）</span>
            </p>
          </div>
          <span className={`text-2xl font-bold ${levelColor}`}>{avoidanceLevel}</span>
        </div>

        {/* 危険スコアバー */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-[#9b8a6a] mb-1">
            <span>危険スコア</span><span>{assessment.dangerScore}/100</span>
          </div>
          <div className="h-1.5 bg-[#0d0620] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${assessment.dangerScore >= 70 ? "bg-red-600" : assessment.dangerScore >= 55 ? "bg-orange-500" : "bg-green-500"}`}
              style={{ width: `${assessment.dangerScore}%` }}
            />
          </div>
        </div>

        <p className={`text-sm ${levelColor}`}>{warningMessage}</p>
      </div>

      {/* ── 今日の位 & 理由 ── */}
      <div className="bg-[#0d1a10] border border-green-900/50 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-900/50 border border-green-700 flex items-center justify-center">
            <span className="text-green-400 font-bold text-lg">{ichi.name}</span>
          </div>
          <div>
            <p className="text-green-400 font-bold text-sm">今日の位：{ichi.name}位（{ichi.kamisama}）</p>
            <p className="text-[#9b8a6a] text-xs">門：{mon.name}  ─  {mon.meaning}</p>
          </div>
        </div>

        <p className="text-[#9b8a6a] text-xs mb-3 leading-relaxed border-l-2 border-green-800 pl-3">
          {ichi.theme}
        </p>

        {/* 必要な経験 */}
        <div className="mb-3">
          <p className="text-yellow-500/80 text-xs font-bold mb-2">
            🙏 必要な経験「辛くてありがとう」
          </p>
          <ul className="space-y-1">
            {ichi.experience.map((e, i) => (
              <li key={i} className="text-[#e8d5a3] text-xs flex gap-2">
                <span className="text-yellow-600 shrink-0">・</span>{e}
              </li>
            ))}
          </ul>
        </div>

        {/* 工夫・実行 */}
        <div className="mb-3">
          <p className="text-green-500/80 text-xs font-bold mb-2">✓ 工夫・実行（頑張るところ）</p>
          <ul className="space-y-1">
            {ichi.action.map((a, i) => (
              <li key={i} className="text-[#e8d5a3] text-xs flex gap-2">
                <span className="text-green-600 shrink-0">◯</span>{a}
              </li>
            ))}
          </ul>
        </div>

        {/* 禁止事項 */}
        <div>
          <p className="text-red-500/80 text-xs font-bold mb-2">✕ 禁止事項（反省）</p>
          <ul className="space-y-1">
            {ichi.forbidden.map((f, i) => (
              <li key={i} className="text-[#e8d5a3] text-xs flex gap-2">
                <span className="text-red-600 shrink-0">×</span>{f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── 六害宿アラート ── */}
      {rikkai.isRikkai && (
        <div className="bg-red-950 border-2 border-red-600 rounded-2xl p-5">
          <p className="text-red-400 font-bold text-sm mb-2">⚠ 六害宿：{rikkai.rikkaType}</p>
          <p className="text-red-300 text-xs mb-3">{rikkai.description}</p>
          <p className="text-red-500 text-xs font-bold mb-2">今日、絶対にやってはいけないこと：</p>
          <ul className="space-y-1">
            {rikkai.absoluteAvoid.map((a, i) => (
              <li key={i} className="text-red-200 text-xs flex gap-2">
                <span className="text-red-500 shrink-0">✕</span>{a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── 今日の回避行動 ── */}
      {isDanger && assessment.topAvoids.length > 0 && (
        <div className="bg-[#1a0a2e] border border-orange-800/40 rounded-2xl p-5">
          <p className="text-orange-400 font-bold text-sm mb-3">▲ 今日避けるべき行動</p>
          <ul className="space-y-1.5">
            {assessment.topAvoids.map((a, i) => (
              <li key={i} className="text-[#e8d5a3] text-xs flex gap-2">
                <span className="text-orange-500 shrink-0">▲</span>{a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── 守護真言 ── */}
      <div className="bg-[#1a0a2e] border border-[#C9A84C]/20 rounded-2xl p-5 text-center">
        <p className="text-[#9b8a6a] text-xs mb-2 tracking-widest">今日の護身真言</p>
        <p className="text-[#C9A84C] text-sm font-bold tracking-widest leading-relaxed">
          {protectiveMantra}
        </p>
        <p className="text-[#5a4a3a] text-xs mt-2">守護星：{birthShuku.element}曜</p>
      </div>

      {/* ── 感謝の言葉 ── */}
      <div className="bg-[#1a0a2e] border border-[#C9A84C]/10 rounded-2xl p-4 text-center">
        <p className="text-[#9b8a6a] text-xs mb-2">魂をきれいにする言葉（朝10回）</p>
        <p className="text-[#e8d5a3] text-sm font-bold">「辛くてありがとう」</p>
        <p className="text-[#9b8a6a] text-xs mt-1">大難 → 中難 → 小難 → 無難</p>
      </div>

    </div>
  );
}
