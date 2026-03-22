"use client";

import { ICHI_LIST, MON_LIST } from "../../lib/ichi";
import type { Shuku } from "../../lib/shukuyo";

interface Props {
  birthShuku: Shuku;
  todayShuku: Shuku;
}

const cx = 180, cy = 180;

function polar(angleDeg: number, r: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function sectorPath(startDeg: number, endDeg: number, r1: number, r2: number) {
  const large = endDeg - startDeg > 180 ? 1 : 0;
  const s1 = polar(startDeg, r1), e1 = polar(endDeg, r1);
  const s2 = polar(startDeg, r2), e2 = polar(endDeg, r2);
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${r1} ${r1} 0 ${large} 1 ${e1.x} ${e1.y}`,
    `L ${e2.x} ${e2.y}`,
    `A ${r2} ${r2} 0 ${large} 0 ${s2.x} ${s2.y}`,
    "Z",
  ].join(" ");
}

// 虹彩カラー（位ごと）
const ICHI_COLORS = [
  "#a78bfa", "#818cf8", "#60a5fa", "#34d399",
  "#4ade80", "#a3e635", "#fbbf24", "#f97316",
  "#f472b6", "#c084fc", "#67e8f9", "#fb7185",
];

// モン（門）ごとの色
const MON_COLORS = ["#fde68a","#6ee7b7","#93c5fd","#c4b5fd","#fca5a5","#fcd34d","#a5f3fc","#d1fae5","#fee2e2","#e0e7ff","#fef3c7","#f5d0fe"];

const SHUKU_NAMES = ["角","亢","氐","房","心","尾","箕","斗","牛","女","虚","危","室","壁","奎","婁","胃","昴","畢","觜","参","井","鬼","柳","星","張","翼"];
const SEG = 360 / 27;

const ICHI_STARTS = [0,3,5,7,9,11,13,15,18,20,23,25];
const ICHI_SIZES  = [3,2,2,2,2,2,2,3,2,3,2,2];
const OFFSET_TO_ICHI = [0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,7,8,8,9,9,9,10,10,11,11];
const OFFSET_TO_MON  = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,11,11,11];

export default function CircleDisk({ birthShuku, todayShuku }: Props) {
  const todayOffset = (todayShuku.index - birthShuku.index + 27) % 27;
  const activeIchi  = OFFSET_TO_ICHI[todayOffset];
  const activeMon   = OFFSET_TO_MON[todayOffset];

  return (
    <svg viewBox="0 0 360 360" className="w-full max-w-[360px] mx-auto drop-shadow-2xl">
      <defs>
        {/* 虹彩グラデ（ホログラフィック） */}
        <radialGradient id="bg-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0a0018" />
          <stop offset="100%" stopColor="#03000A" />
        </radialGradient>
        {/* 金グロー */}
        <filter id="glow-gold">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* 赤グロー（今日の宿） */}
        <filter id="glow-red">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* 外周グラデ */}
        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.6" />
        </linearGradient>
        {/* 神聖幾何学背景 */}
        <pattern id="sacred" patternUnits="userSpaceOnUse" width="360" height="360">
          <circle cx="180" cy="180" r="80" fill="none" stroke="rgba(212,175,55,0.04)" strokeWidth="0.5" />
          <circle cx="180" cy="180" r="120" fill="none" stroke="rgba(212,175,55,0.03)" strokeWidth="0.5" />
        </pattern>
      </defs>

      {/* 背景 */}
      <circle cx={cx} cy={cy} r={178} fill="url(#bg-grad)" />
      <circle cx={cx} cy={cy} r={178} fill="url(#sacred)" />

      {/* 外リング（門） */}
      {MON_LIST.map((mon, i) => {
        const aPerMon = 360 / 12;
        const s = i * aPerMon, e = (i + 1) * aPerMon;
        const mid = (s + e) / 2;
        const isActive = i === activeMon;
        const tp = polar(mid, 163);
        return (
          <g key={`mon-${i}`}>
            <path
              d={sectorPath(s, e, 148, 175)}
              fill={isActive ? `${MON_COLORS[i]}22` : "rgba(5,0,12,0.8)"}
              stroke={isActive ? MON_COLORS[i] : "rgba(212,175,55,0.12)"}
              strokeWidth={isActive ? 1.5 : 0.5}
            />
            <text x={tp.x} y={tp.y} textAnchor="middle" dominantBaseline="middle"
              fontSize="7.5" fill={isActive ? MON_COLORS[i] : "rgba(212,175,55,0.35)"}
              fontWeight={isActive ? "bold" : "normal"}>
              {mon.name}
            </text>
          </g>
        );
      })}

      {/* 中リング（位）*/}
      {ICHI_LIST.map((ichi, i) => {
        const s = ICHI_STARTS[i] * SEG, e = (ICHI_STARTS[i] + ICHI_SIZES[i]) * SEG;
        const mid = (s + e) / 2;
        const isActive = i === activeIchi;
        const color = ICHI_COLORS[i];
        const tp = polar(mid, 133);
        return (
          <g key={`ichi-${i}`}>
            <path
              d={sectorPath(s, e, 115, 147)}
              fill={isActive ? `${color}30` : "rgba(5,0,15,0.7)"}
              stroke={isActive ? color : "rgba(212,175,55,0.10)"}
              strokeWidth={isActive ? 1.5 : 0.4}
            />
            <text x={tp.x} y={tp.y} textAnchor="middle" dominantBaseline="middle"
              fontSize="8" fill={isActive ? color : "rgba(160,140,180,0.50)"}
              fontWeight={isActive ? "bold" : "normal"}>
              {ichi.name}
            </text>
          </g>
        );
      })}

      {/* 内リング（27宿）*/}
      {SHUKU_NAMES.map((name, i) => {
        const s = i * SEG, e = (i + 1) * SEG, mid = (s + e) / 2;
        const isToday = i === todayOffset;
        const isBirth = i === 0;
        const tp = polar(mid, 95);

        // ホログラフィックカラー
        const hue = (i * (360 / 27)) % 360;
        const sectorColor = isToday ? "#ef4444" : isBirth ? "#D4AF37" : `hsl(${hue},60%,55%)`;

        return (
          <g key={`shuku-${i}`}>
            <path
              d={sectorPath(s, e, 78, 113)}
              fill={isToday ? "rgba(220,38,38,0.35)" : isBirth ? "rgba(212,175,55,0.15)" : `hsla(${hue},60%,20%,0.4)`}
              stroke={sectorColor}
              strokeWidth={isToday ? 1.5 : isBirth ? 1 : 0.3}
              filter={isToday ? "url(#glow-red)" : isBirth ? "url(#glow-gold)" : undefined}
            />
            <text x={tp.x} y={tp.y} textAnchor="middle" dominantBaseline="middle"
              fontSize="7.5"
              fill={isToday ? "#fca5a5" : isBirth ? "#D4AF37" : `hsl(${hue},70%,70%)`}
              fontWeight={isToday || isBirth ? "bold" : "normal"}
              filter={isToday ? "url(#glow-red)" : undefined}
            >
              {name}
            </text>
          </g>
        );
      })}

      {/* 中心円 */}
      <circle cx={cx} cy={cy} r={76} fill="rgba(3,0,10,0.95)" stroke="rgba(212,175,55,0.25)" strokeWidth="1" />

      {/* 中心の神聖幾何学リング */}
      <circle cx={cx} cy={cy} r={65} fill="none" stroke="rgba(212,175,55,0.08)" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={55} fill="none" stroke="rgba(167,139,250,0.08)" strokeWidth="0.5" />

      {/* 本命宿テキスト */}
      <text x={cx} y={cy - 22} textAnchor="middle" fontSize="9" fill="rgba(160,140,120,0.8)" letterSpacing="2">本命宿</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="32" fill="#D4AF37" fontWeight="bold"
        filter="url(#glow-gold)">
        {birthShuku.name.replace("宿", "")}
      </text>
      <text x={cx} y={cy + 26} textAnchor="middle" fontSize="8" fill="rgba(160,140,120,0.7)">
        {birthShuku.reading}
      </text>

      {/* 今日の宿 ラベル */}
      <text x={cx} y={cy + 46} textAnchor="middle" fontSize="7.5" fill="#fca5a5"
        filter="url(#glow-red)">
        ▶ {todayShuku.name} ◀
      </text>

      {/* 外周装飾リング */}
      <circle cx={cx} cy={cy} r={177} fill="none" stroke="url(#ring-grad)" strokeWidth="1.5" />

      {/* 方位の点 */}
      {[0,90,180,270].map(a => {
        const p = polar(a, 177);
        return <circle key={a} cx={p.x} cy={p.y} r="2.5" fill="#D4AF37" filter="url(#glow-gold)" />;
      })}
    </svg>
  );
}
