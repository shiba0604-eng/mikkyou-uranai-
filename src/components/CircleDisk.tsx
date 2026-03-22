"use client";

import { ICHI_LIST, MON_LIST } from "../../lib/ichi";
import type { Shuku } from "../../lib/shukuyo";

interface Props {
  birthShuku: Shuku;
  todayShuku: Shuku;
}

const TAU = Math.PI * 2;
const cx = 160;
const cy = 160;

function polarToXY(angleDeg: number, r: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function CircleDisk({ birthShuku, todayShuku }: Props) {
  const todayOffset = (todayShuku.index - birthShuku.index + 27) % 27;
  const segAngle = 360 / 27; // 各宿の角度

  // 位ラベルを配置する角度を計算（12位、各位の中央）
  const ichiAngles = [0, 3, 5, 7, 9, 11, 13, 15, 18, 20, 23, 25].map(
    (start, i) => {
      const sizes = [3,2,2,2,2,2,2,3,2,3,2,2];
      const center = start + sizes[i] / 2;
      return center * segAngle;
    }
  );

  const shukuNames = ["角","亢","氐","房","心","尾","箕","斗","牛","女","虚","危","室","壁","奎","婁","胃","昴","畢","觜","参","井","鬼","柳","星","張","翼"];

  return (
    <svg viewBox="0 0 320 320" className="w-full max-w-[320px] mx-auto">
      {/* 背景 */}
      <circle cx={cx} cy={cy} r={155} fill="#0d0620" />

      {/* 27宿セクター */}
      {shukuNames.map((_, i) => {
        const startAngle = i * segAngle - 90;
        const endAngle = (i + 1) * segAngle - 90;
        const r1 = 70, r2 = 110;
        const s1 = polarToXY(i * segAngle, r1);
        const e1 = polarToXY((i + 1) * segAngle, r1);
        const s2 = polarToXY(i * segAngle, r2);
        const e2 = polarToXY((i + 1) * segAngle, r2);
        const isToday = i === todayOffset;
        const isBirth = i === 0;
        const fill = isToday
          ? "#DC2626"
          : isBirth
          ? "#C9A84C33"
          : "#1a0a2e";
        const stroke = isToday ? "#FF4444" : isBirth ? "#C9A84C" : "#2a1a3e";

        const path = [
          `M ${s1.x} ${s1.y}`,
          `A ${r1} ${r1} 0 0 1 ${e1.x} ${e1.y}`,
          `L ${e2.x} ${e2.y}`,
          `A ${r2} ${r2} 0 0 0 ${s2.x} ${s2.y}`,
          "Z",
        ].join(" ");

        const midAngle = (i + 0.5) * segAngle;
        const textR = 90;
        const tp = polarToXY(midAngle, textR);

        return (
          <g key={i}>
            <path d={path} fill={fill} stroke={stroke} strokeWidth="0.5" />
            <text
              x={tp.x}
              y={tp.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="7"
              fill={isToday ? "#fff" : isBirth ? "#C9A84C" : "#9b8a6a"}
              fontWeight={isToday || isBirth ? "bold" : "normal"}
            >
              {shukuNames[i]}
            </text>
          </g>
        );
      })}

      {/* 12位リング */}
      {ICHI_LIST.map((ichi, i) => {
        const startOffsets = [0,3,5,7,9,11,13,15,18,20,23,25];
        const sizes = [3,2,2,2,2,2,2,3,2,3,2,2];
        const startAngle = startOffsets[i] * segAngle;
        const endAngle = (startOffsets[i] + sizes[i]) * segAngle;
        const midAngle = (startAngle + endAngle) / 2;
        const r1 = 112, r2 = 135;
        const s1 = polarToXY(startAngle, r1);
        const e1 = polarToXY(endAngle, r1);
        const s2 = polarToXY(startAngle, r2);
        const e2 = polarToXY(endAngle, r2);

        const isActive = OFFSET_TO_ICHI_IDX(todayOffset) === i;
        const path = [
          `M ${s1.x} ${s1.y}`,
          `A ${r1} ${r1} 0 0 1 ${e1.x} ${e1.y}`,
          `L ${e2.x} ${e2.y}`,
          `A ${r2} ${r2} 0 0 0 ${s2.x} ${s2.y}`,
          "Z",
        ].join(" ");
        const tp = polarToXY(midAngle, 123);

        return (
          <g key={i}>
            <path
              d={path}
              fill={isActive ? "#16A34A33" : "#0d1a10"}
              stroke={isActive ? "#16A34A" : "#1a3020"}
              strokeWidth="0.5"
            />
            <text
              x={tp.x} y={tp.y}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="7"
              fill={isActive ? "#4ade80" : "#2a5a30"}
              fontWeight={isActive ? "bold" : "normal"}
            >
              {ichi.name}
            </text>
          </g>
        );
      })}

      {/* 12門リング */}
      {MON_LIST.map((mon, i) => {
        const anglePerMon = 360 / 12;
        const startAngle = i * anglePerMon;
        const endAngle = (i + 1) * anglePerMon;
        const midAngle = (startAngle + endAngle) / 2;
        const r1 = 137, r2 = 153;
        const s1 = polarToXY(startAngle, r1);
        const e1 = polarToXY(endAngle, r1);
        const s2 = polarToXY(startAngle, r2);
        const e2 = polarToXY(endAngle, r2);
        const path = [
          `M ${s1.x} ${s1.y}`,
          `A ${r1} ${r1} 0 0 1 ${e1.x} ${e1.y}`,
          `L ${e2.x} ${e2.y}`,
          `A ${r2} ${r2} 0 0 0 ${s2.x} ${s2.y}`,
          "Z",
        ].join(" ");
        const tp = polarToXY(midAngle, 145);
        const isDanger = mon.name === "破" || mon.name === "危" || mon.name === "閉";

        return (
          <g key={i}>
            <path d={path} fill="#0d0a20" stroke="#2a1a3e" strokeWidth="0.5" />
            <text
              x={tp.x} y={tp.y}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="6"
              fill={isDanger ? "#f87171" : "#C9A84C88"}
            >
              {mon.name}
            </text>
          </g>
        );
      })}

      {/* 中心円 */}
      <circle cx={cx} cy={cy} r={68} fill="#0d0620" stroke="#C9A84C44" strokeWidth="1" />

      {/* 本命宿テキスト */}
      <text x={cx} y={cy - 16} textAnchor="middle" fontSize="10" fill="#9b8a6a">本命宿</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="26" fill="#C9A84C" fontWeight="bold">
        {birthShuku.name.replace("宿", "")}
      </text>
      <text x={cx} y={cy + 26} textAnchor="middle" fontSize="7" fill="#9b8a6a">
        {birthShuku.reading}
      </text>

      {/* 今日の宿 凡例 */}
      <rect x="5" y="300" width="8" height="8" fill="#DC2626" rx="1" />
      <text x="16" y="307" fontSize="7" fill="#9b8a6a">今日の宿（{todayShuku.name}）</text>
      <rect x="100" y="300" width="8" height="8" fill="#C9A84C33" stroke="#C9A84C" strokeWidth="0.5" rx="1" />
      <text x="111" y="307" fontSize="7" fill="#9b8a6a">本命宿</text>
    </svg>
  );
}

// ヘルパー: オフセット → 位インデックス
function OFFSET_TO_ICHI_IDX(offset: number): number {
  const map = [0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,7,8,8,9,9,9,10,10,11,11];
  return map[offset] ?? 0;
}
