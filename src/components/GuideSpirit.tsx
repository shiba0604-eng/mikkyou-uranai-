"use client";
import { useEffect, useState } from "react";

type Mood = "neutral" | "warning" | "safe";

interface GuideSpiritProps {
  mood?: Mood;
}

const QUOTES: Record<Mood, string[]> = {
  neutral: [
    "汝の本命宿を知ることが、すべての始まりである",
    "月は毎日宿を変える。今日だけの宿命がある",
    "損を避けた者が、最後に笑う",
    "大凶を知ることは、すでに半分の勝利だ",
  ],
  warning: [
    "今日は嵐の前。静かに嵐が過ぎるのを待て",
    "凶の日の決断は、後に必ず悔いを残す",
    "今日は動かず、観察することが最善の策だ",
  ],
  safe: [
    "今日は天が味方している。大切なことを実行せよ",
    "良い気が流れている。この機を逃すな",
    "吉日の行動は百倍の果実をもたらす",
  ],
};

export default function GuideSpirit({ mood = "neutral" }: GuideSpiritProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const quotes = QUOTES[mood];

  useEffect(() => {
    setQuoteIndex(0);
    setVisible(true);
  }, [mood]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes]);

  const currentQuote = quotes[quoteIndex];

  // Mood-based color accents
  const moodColor =
    mood === "warning" ? "#f87171" : mood === "safe" ? "#86efac" : "#D4AF37";
  const moodGlow =
    mood === "warning"
      ? "rgba(248,113,113,0.5)"
      : mood === "safe"
      ? "rgba(134,239,172,0.5)"
      : "rgba(212,175,55,0.5)";

  return (
    <div className="relative flex flex-col items-center">
      {/* SVG character */}
      <svg
        viewBox="0 0 300 400"
        className="w-64 h-auto drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Face gradient */}
          <radialGradient id="face-grad" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#3d1a5c" />
            <stop offset="60%" stopColor="#2a1040" />
            <stop offset="100%" stopColor="#1a0028" />
          </radialGradient>

          {/* Robe gradient */}
          <linearGradient id="robe-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a0840" />
            <stop offset="50%" stopColor="#110530" />
            <stop offset="100%" stopColor="#0d0420" />
          </linearGradient>

          {/* Lotus gradient */}
          <linearGradient id="lotus-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B6914" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8B6914" />
          </linearGradient>

          {/* Urna gradient */}
          <radialGradient id="urna-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="40%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" />
          </radialGradient>

          {/* Flame gradient */}
          <linearGradient id="flame-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F0D060" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
          </linearGradient>

          {/* Halo gold gradient */}
          <radialGradient id="halo-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#8B6914" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>

          {/* Glow filter for halo */}
          <filter id="halo-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glow filter for whole spirit */}
          <filter id="spirit-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Third eye glow filter */}
          <filter id="urna-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Mood glow filter */}
          <filter id="mood-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── 外周：ダルマチャクラ（法輪）風 破線円 ── */}
        <g
          className="animate-rotate-dharma"
          style={{ transformOrigin: "150px 185px" }}
        >
          {/* Outer dashed dharma wheel */}
          <circle
            cx="150"
            cy="185"
            r="135"
            fill="none"
            stroke={moodColor}
            strokeWidth="0.8"
            strokeDasharray="8 6"
            opacity="0.25"
          />
          {/* 8 spokes of dharma wheel */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 150 + 115 * Math.cos(rad);
            const y1 = 185 + 115 * Math.sin(rad);
            const x2 = 150 + 135 * Math.cos(rad);
            const y2 = 185 + 135 * Math.sin(rad);
            const xi = 150 + 20 * Math.cos(rad);
            const yi = 185 + 20 * Math.sin(rad);
            return (
              <g key={angle}>
                <line
                  x1={xi}
                  y1={yi}
                  x2={x2}
                  y2={y2}
                  stroke={moodColor}
                  strokeWidth="0.6"
                  opacity="0.2"
                />
                {/* Spoke tip decorative dot */}
                <circle
                  cx={x2}
                  cy={y2}
                  r="2"
                  fill={moodColor}
                  opacity="0.3"
                />
              </g>
            );
          })}
          {/* Hub circle */}
          <circle
            cx="150"
            cy="185"
            r="20"
            fill="none"
            stroke={moodColor}
            strokeWidth="0.6"
            opacity="0.2"
          />
        </g>

        {/* ── 中間：逆回転輪 ── */}
        <g
          className="animate-rotate-dharma-rev"
          style={{ transformOrigin: "150px 185px" }}
        >
          <circle
            cx="150"
            cy="185"
            r="110"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="0.5"
            strokeDasharray="4 8"
            opacity="0.15"
          />
        </g>

        {/* ── 中間ハロー：金色二重円 ── */}
        <circle
          cx="150"
          cy="175"
          r="100"
          fill="url(#halo-gold)"
          className="animate-halo-pulse"
        />
        <circle
          cx="150"
          cy="175"
          r="100"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="0.8"
          opacity="0.2"
          filter="url(#halo-glow)"
          className="animate-halo-pulse"
        />
        <circle
          cx="150"
          cy="175"
          r="90"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="0.5"
          opacity="0.15"
          className="animate-halo-pulse"
        />

        {/* ── 放射光線 8方向 ── */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 150 + 92 * Math.cos(rad);
          const y1 = 175 + 92 * Math.sin(rad);
          const x2 = 150 + 112 * Math.cos(rad);
          const y2 = 175 + 112 * Math.sin(rad);
          return (
            <line
              key={`ray-${angle}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#D4AF37"
              strokeWidth="0.8"
              opacity="0.35"
            />
          );
        })}

        {/* ── 蓮台（Lotus throne）── */}
        {/* Back petals */}
        {[-60, -30, 0, 30, 60].map((offset, i) => {
          const cx = 150 + offset;
          return (
            <ellipse
              key={`back-petal-${i}`}
              cx={cx}
              cy={338}
              rx={22}
              ry={28}
              fill="url(#lotus-grad)"
              opacity="0.3"
              transform={`rotate(${offset * 0.3}, ${cx}, 338)`}
            />
          );
        })}
        {/* Front lotus petals */}
        {[
          { cx: 90, cy: 345, rx: 20, ry: 26, rot: -20 },
          { cx: 115, cy: 340, rx: 22, ry: 30, rot: -10 },
          { cx: 140, cy: 338, rx: 24, ry: 32, rot: 0 },
          { cx: 165, cy: 338, rx: 24, ry: 32, rot: 0 },
          { cx: 190, cy: 340, rx: 22, ry: 30, rot: 10 },
          { cx: 215, cy: 345, rx: 20, ry: 26, rot: 20 },
        ].map(({ cx, cy, rx, ry, rot }, i) => (
          <ellipse
            key={`petal-${i}`}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            fill="url(#lotus-grad)"
            opacity="0.55"
            transform={`rotate(${rot}, ${cx}, ${cy})`}
          />
        ))}
        {/* Lotus base platform */}
        <ellipse
          cx="150"
          cy="345"
          rx="68"
          ry="12"
          fill="#8B6914"
          opacity="0.4"
        />
        <ellipse
          cx="150"
          cy="343"
          rx="65"
          ry="9"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="0.8"
          opacity="0.5"
        />
        {/* Petal veins */}
        {[
          { x1: 140, y1: 322, x2: 140, y2: 340 },
          { x1: 162, y1: 322, x2: 162, y2: 340 },
          { x1: 118, y1: 325, x2: 115, y2: 342 },
          { x1: 185, y1: 325, x2: 188, y2: 342 },
        ].map((line, i) => (
          <line
            key={`vein-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#D4AF37"
            strokeWidth="0.4"
            opacity="0.35"
          />
        ))}

        {/* ── 法衣（Robe）── */}
        <path
          d="M 88 280 Q 70 310 65 345 L 235 345 Q 230 310 212 280 Q 195 260 150 255 Q 105 260 88 280 Z"
          fill="url(#robe-grad)"
        />
        {/* Robe fabric folds */}
        <path
          d="M 110 265 Q 105 295 100 330"
          fill="none"
          stroke="#2a1060"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <path
          d="M 150 258 Q 148 295 145 330"
          fill="none"
          stroke="#2a1060"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M 190 265 Q 195 295 200 330"
          fill="none"
          stroke="#2a1060"
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* Robe collar gold decoration */}
        <path
          d="M 115 265 Q 130 255 150 252 Q 170 255 185 265"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <path
          d="M 112 270 Q 128 260 150 257 Q 172 260 188 270"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="0.6"
          opacity="0.4"
        />
        {/* Collar jewel detail */}
        {[130, 150, 170].map((x, i) => (
          <circle
            key={`collar-jewel-${i}`}
            cx={x}
            cy={260 + (i === 1 ? 0 : 3)}
            r="2"
            fill="#D4AF37"
            opacity="0.6"
          />
        ))}

        {/* ── 首 ── */}
        <ellipse cx="150" cy="255" rx="14" ry="10" fill="url(#face-grad)" />

        {/* ── 顔円 ── */}
        <circle
          cx="150"
          cy="195"
          r="52"
          fill="url(#face-grad)"
          filter="url(#spirit-glow)"
          className="animate-breathe"
        />
        {/* Face subtle shading */}
        <ellipse
          cx="150"
          cy="182"
          rx="30"
          ry="22"
          fill="rgba(255,255,255,0.04)"
        />

        {/* ── 頭頂部の焔（Ushnisha/肉髻）── */}
        <path
          d="M 150 143 Q 144 128 148 112 Q 150 100 152 112 Q 156 128 150 143 Z"
          fill="url(#flame-grad)"
          opacity="0.95"
        />
        <path
          d="M 150 143 Q 138 126 140 108 Q 144 95 147 108 Q 148 125 150 143 Z"
          fill="url(#flame-grad)"
          opacity="0.7"
        />
        <path
          d="M 150 143 Q 162 126 160 108 Q 156 95 153 108 Q 152 125 150 143 Z"
          fill="url(#flame-grad)"
          opacity="0.7"
        />
        {/* Flame core */}
        <path
          d="M 150 143 Q 148 132 150 120 Q 152 132 150 143 Z"
          fill="white"
          opacity="0.7"
        />

        {/* ── 耳 ── */}
        {/* Left ear */}
        <ellipse
          cx="99"
          cy="198"
          rx="8"
          ry="13"
          fill="url(#face-grad)"
          stroke="#3d1a5c"
          strokeWidth="0.5"
        />
        <ellipse cx="99" cy="198" rx="5" ry="9" fill="none" stroke="#D4AF37" strokeWidth="0.4" opacity="0.4" />
        {/* Left ear jewel */}
        <circle cx="99" cy="204" r="3.5" fill="#D4AF37" opacity="0.75" />
        <circle cx="99" cy="204" r="1.5" fill="#F0D060" opacity="0.9" />

        {/* Right ear */}
        <ellipse
          cx="201"
          cy="198"
          rx="8"
          ry="13"
          fill="url(#face-grad)"
          stroke="#3d1a5c"
          strokeWidth="0.5"
        />
        <ellipse cx="201" cy="198" rx="5" ry="9" fill="none" stroke="#D4AF37" strokeWidth="0.4" opacity="0.4" />
        {/* Right ear jewel */}
        <circle cx="201" cy="204" r="3.5" fill="#D4AF37" opacity="0.75" />
        <circle cx="201" cy="204" r="1.5" fill="#F0D060" opacity="0.9" />

        {/* ── 眉間の第三の眼（白毫/Urna）── */}
        <circle
          cx="150"
          cy="183"
          r="4"
          fill="url(#urna-grad)"
          filter="url(#urna-glow)"
          className="animate-third-eye"
        />
        <circle cx="150" cy="183" r="2" fill="#e9d5ff" opacity="0.9" />

        {/* ── 瞑想した目（閉じた目）── */}
        {/* Left eye */}
        <path
          d="M 127 196 Q 135 192 143 196"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* Left eyelash hint */}
        <path
          d="M 128 196 Q 135 199 142 196"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="0.4"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Right eye */}
        <path
          d="M 157 196 Q 165 192 173 196"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 158 196 Q 165 199 172 196"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="0.4"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* ── 眉 ── */}
        <path
          d="M 125 190 Q 135 187 143 190"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M 157 190 Q 165 187 175 190"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* ── 鼻 ── */}
        <path
          d="M 150 199 Q 146 207 148 210 Q 150 211 152 210 Q 154 207 150 199"
          fill="none"
          stroke="#8B6914"
          strokeWidth="0.7"
          opacity="0.5"
        />

        {/* ── 口（serene な微笑み）── */}
        <path
          d="M 141 220 Q 150 226 159 220"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Subtle smile dimples */}
        <circle cx="141" cy="220" r="1" fill="#D4AF37" opacity="0.3" />
        <circle cx="159" cy="220" r="1" fill="#D4AF37" opacity="0.3" />

        {/* ── 手（禅定印 / dhyana mudra）── */}
        {/* Left hand */}
        <ellipse
          cx="130"
          cy="300"
          rx="22"
          ry="12"
          fill="#2a1040"
          stroke="#D4AF37"
          strokeWidth="0.8"
          opacity="0.85"
        />
        {/* Right hand overlapping */}
        <ellipse
          cx="172"
          cy="300"
          rx="22"
          ry="12"
          fill="#2a1040"
          stroke="#D4AF37"
          strokeWidth="0.8"
          opacity="0.85"
        />
        {/* Hands overlap center */}
        <ellipse
          cx="151"
          cy="302"
          rx="18"
          ry="10"
          fill="#1a0840"
          stroke="#D4AF37"
          strokeWidth="0.6"
          opacity="0.7"
        />
        {/* 宝珠（jewel/cintamani）in hands */}
        <circle
          cx="151"
          cy="302"
          r="6"
          fill="url(#urna-grad)"
          filter="url(#urna-glow)"
          opacity="0.8"
        />
        <circle cx="151" cy="302" r="3" fill="#e9d5ff" opacity="0.8" />
        <circle cx="151" cy="302" r="1.2" fill="white" opacity="0.95" />
        {/* Finger line hints */}
        <path d="M 118 298 Q 122 296 126 298" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
        <path d="M 118 302 Q 122 300 126 302" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
        <path d="M 176 298 Q 180 296 184 298" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
        <path d="M 176 302 Q 180 300 184 302" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />

        {/* ── 浮遊する光の粒 ── */}
        {[
          { cx: 82, cy: 160, r: 2.5, delay: "0s", dur: "6s" },
          { cx: 220, cy: 145, r: 2, delay: "1.5s", dur: "7s" },
          { cx: 68, cy: 230, r: 1.8, delay: "0.8s", dur: "5s" },
          { cx: 230, cy: 220, r: 2.2, delay: "2.5s", dur: "8s" },
          { cx: 100, cy: 310, r: 1.5, delay: "1s", dur: "6.5s" },
          { cx: 205, cy: 295, r: 2, delay: "3s", dur: "7.5s" },
        ].map((p, i) => (
          <circle
            key={`particle-${i}`}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill={moodColor}
            opacity="0.5"
            className="animate-particle"
            style={{ animationDelay: p.delay, animationDuration: p.dur }}
          />
        ))}

        {/* ── Mood accent glow at bottom ── */}
        <ellipse
          cx="150"
          cy="348"
          rx="55"
          ry="8"
          fill={moodGlow}
          opacity="0.18"
          filter="url(#mood-glow)"
        />
      </svg>

      {/* ── Speech bubble ── */}
      <div
        className="mt-2 max-w-[240px] px-4 py-3 rounded-xl border-gold-ornate"
        style={{
          background: "rgba(10,3,28,0.82)",
          border: `1px solid ${moodColor}44`,
          boxShadow: `0 0 18px ${moodGlow}33`,
          transition: "opacity 0.4s ease, transform 0.4s ease",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(4px)",
        }}
      >
        {/* Tiny arrow pointing up */}
        <div
          style={{
            position: "absolute",
            top: "-6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderBottom: `6px solid ${moodColor}44`,
          }}
        />
        <p className="text-xs text-[#e8d5a3] italic leading-relaxed text-center">
          {currentQuote}
        </p>
      </div>
    </div>
  );
}
