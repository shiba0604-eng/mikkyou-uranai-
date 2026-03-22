"use client";

import { type DangerAssessment, type AvoidanceLevel } from "../../lib/shukuyo";

const LEVEL_STYLES: Record<AvoidanceLevel, { bg: string; border: string; text: string; badge: string }> = {
  大凶: { bg: "bg-red-950",   border: "border-red-600",    text: "text-red-400",    badge: "bg-red-600 text-white" },
  凶:   { bg: "bg-red-950",   border: "border-red-700",    text: "text-red-500",    badge: "bg-red-800 text-white" },
  注意: { bg: "bg-orange-950",border: "border-orange-600", text: "text-orange-400", badge: "bg-orange-600 text-white" },
  平:   { bg: "bg-[#1a0a2e]", border: "border-gray-600",   text: "text-gray-400",   badge: "bg-gray-600 text-white" },
  中吉: { bg: "bg-[#1a0a2e]", border: "border-blue-600",   text: "text-blue-400",   badge: "bg-blue-600 text-white" },
  吉:   { bg: "bg-[#1a0a2e]", border: "border-green-600",  text: "text-green-400",  badge: "bg-green-600 text-white" },
  大吉: { bg: "bg-[#1a0a2e]", border: "border-yellow-500", text: "text-yellow-400", badge: "bg-yellow-500 text-black" },
};

export default function DangerDashboard({ assessment }: { assessment: DangerAssessment }) {
  const { avoidanceLevel } = assessment;
  const style = LEVEL_STYLES[avoidanceLevel];
  const isDanger = ["大凶", "凶", "注意"].includes(avoidanceLevel);

  return (
    <div className="flex flex-col gap-4">
      {/* メインカード */}
      <div className={`${style.bg} border ${style.border} rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[#9b8a6a] text-xs">{assessment.date}</p>
          <span className={`${style.badge} text-xs font-bold px-3 py-1 rounded-full`}>
            {avoidanceLevel}
          </span>
        </div>

        {/* 宿の情報 */}
        <div className="flex justify-around mb-6 text-center">
          <div>
            <p className="text-[#9b8a6a] text-xs mb-1">本命宿</p>
            <p className="text-[#C9A84C] text-lg font-bold">{assessment.birthShuku.name}</p>
            <p className="text-[#9b8a6a] text-xs">{assessment.birthShuku.reading}</p>
          </div>
          <div className="text-[#5a4a3a] text-2xl self-center">×</div>
          <div>
            <p className="text-[#9b8a6a] text-xs mb-1">今日の宿</p>
            <p className={`${style.text} text-lg font-bold`}>{assessment.todayShuku.name}</p>
            <p className="text-[#9b8a6a] text-xs">{assessment.todayShuku.reading}</p>
          </div>
        </div>

        {/* 危険スコアバー */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-[#9b8a6a] mb-1">
            <span>危険スコア</span>
            <span>{assessment.dangerScore} / 100</span>
          </div>
          <div className="h-2 bg-[#0d0620] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                assessment.dangerScore >= 70 ? "bg-red-600" :
                assessment.dangerScore >= 55 ? "bg-orange-500" :
                assessment.dangerScore >= 40 ? "bg-yellow-500" : "bg-green-500"
              }`}
              style={{ width: `${assessment.dangerScore}%` }}
            />
          </div>
        </div>

        {/* 警告メッセージ */}
        <p className={`text-sm ${style.text} text-center`}>{assessment.warningMessage}</p>
      </div>

      {/* 六害宿アラート */}
      {assessment.rikkai.isRikkai && (
        <div className="bg-red-950 border-2 border-red-600 rounded-2xl p-5">
          <p className="text-red-400 font-bold text-sm mb-2">
            ⚠ 六害宿（{assessment.rikkai.rikkaType}）
          </p>
          <p className="text-red-300 text-xs mb-3">{assessment.rikkai.description}</p>
          <div>
            <p className="text-red-500 text-xs font-bold mb-2">今日、絶対にやってはいけないこと：</p>
            <ul className="space-y-1">
              {assessment.rikkai.absoluteAvoid.map((action, i) => (
                <li key={i} className="text-red-200 text-xs flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✕</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 回避行動リスト */}
      {isDanger && assessment.topAvoids.length > 0 && (
        <div className="bg-[#1a0a2e] border border-orange-800/50 rounded-2xl p-5">
          <p className="text-orange-400 font-bold text-sm mb-3">今日避けるべき行動</p>
          <ul className="space-y-2">
            {assessment.topAvoids.map((action, i) => (
              <li key={i} className="text-[#e8d5a3] text-xs flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">▲</span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 安全な行動 */}
      <div className="bg-[#1a0a2e] border border-[#C9A84C]/20 rounded-2xl p-5">
        <p className="text-[#C9A84C] font-bold text-sm mb-3">今日、比較的安全な行動</p>
        <ul className="space-y-2">
          {assessment.safeActions.map((action, i) => (
            <li key={i} className="text-[#9b8a6a] text-xs flex items-start gap-2">
              <span className="text-green-600 mt-0.5">◯</span>
              {action}
            </li>
          ))}
        </ul>
      </div>

      {/* 守護真言 */}
      <div className="bg-[#1a0a2e] border border-[#C9A84C]/30 rounded-2xl p-5 text-center">
        <p className="text-[#9b8a6a] text-xs mb-2">今日の護身真言</p>
        <p className="text-[#C9A84C] text-sm font-bold tracking-widest">
          {assessment.protectiveMantra}
        </p>
        <p className="text-[#5a4a3a] text-xs mt-2">
          守護星：{assessment.birthShuku.element}曜
        </p>
      </div>
    </div>
  );
}
