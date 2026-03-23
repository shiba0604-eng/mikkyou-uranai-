"use client";

import { useState } from "react";
import { assessDanger, type DangerAssessment } from "../../lib/shukuyo";
import DangerDashboard from "@/components/DangerDashboard";
import GuideSpirit from "@/components/GuideSpirit";

export default function Home() {
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DangerAssessment | null>(null);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const assessment = assessDanger(
      parseInt(birthYear), parseInt(birthMonth), parseInt(birthDay)
    );
    setResult(assessment);
    if (email) {
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, birthYear, birthMonth, birthDay }),
        });
        if (res.ok) setRegistered(true);
      } catch { /* continue */ }
    }
    setLoading(false);
  };

  const getMood = () => {
    if (!result) return "neutral";
    if (["大凶","凶","注意"].includes(result.avoidanceLevel)) return "warning";
    return "safe";
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8">

      {/* ── ヘッダー ── */}
      <header className="text-center mb-6 w-full max-w-2xl">
        <div className="flex items-center gap-3 justify-center mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
          <span className="text-[#D4AF37] text-lg animate-pulse-gold">✦</span>
          <span className="text-[#D4AF37]/60 text-xs tracking-[0.4em] uppercase">Mikkyō Astrology</span>
          <span className="text-[#D4AF37] text-lg animate-pulse-gold">✦</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-glow-gold"
            style={{ color: '#D4AF37', letterSpacing: '0.1em' }}>
          避凶の宿曜道
        </h1>
        <p className="text-[#9B7D5E] text-xs tracking-widest">真・密教占星術 ─ 1300年前に封印された術</p>
      </header>

      {!result ? (
        <>
          {/* ── ガイドスピリット + フォーム 横並び ── */}
          <div className="w-full max-w-2xl flex flex-col md:flex-row gap-8 items-center mb-16">

            {/* ガイドキャラ */}
            <div className="md:w-1/2 flex-shrink-0">
              <GuideSpirit mood="neutral" />
            </div>

            {/* フォーム */}
            <div className="md:w-1/2 w-full max-w-sm">
              <form onSubmit={handleSubmit} className="glass-card glow-gold p-7 flex flex-col gap-4">
                <div className="text-center">
                  <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mb-1">Your Birth Date</p>
                  <p className="text-[#F0E6D0] text-sm">生年月日を入力</p>
                </div>
                <hr className="divider-gold" />
                <div>
                  <label className="text-[#7A6A50] text-xs tracking-widest block mb-1">年 Year</label>
                  <input type="number" placeholder="例: 1990" value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    required min={1900} max={2025}
                    className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 text-[#F0E6D0] text-sm placeholder-[#3A2A1A] focus:outline-none focus:border-[#D4AF37]/60 transition-all" />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[#7A6A50] text-xs tracking-widest block mb-1">月</label>
                    <input type="number" placeholder="1〜12" value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      required min={1} max={12}
                      className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-lg px-3 py-2.5 text-[#F0E6D0] text-sm placeholder-[#3A2A1A] focus:outline-none focus:border-[#D4AF37]/60 transition-all" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[#7A6A50] text-xs tracking-widest block mb-1">日</label>
                    <input type="number" placeholder="1〜31" value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      required min={1} max={31}
                      className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-lg px-3 py-2.5 text-[#F0E6D0] text-sm placeholder-[#3A2A1A] focus:outline-none focus:border-[#D4AF37]/60 transition-all" />
                  </div>
                </div>
                <hr className="divider-gold" />
                <div>
                  <label className="text-[#7A6A50] text-xs tracking-widest block mb-1">
                    メール <span className="text-[#3A2A1A]">（毎朝6:30配信・任意）</span>
                  </label>
                  <input type="email" placeholder="your@email.com" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 text-[#F0E6D0] text-sm placeholder-[#3A2A1A] focus:outline-none focus:border-[#D4AF37]/60 transition-all" />
                </div>
                <button type="submit" disabled={loading}
                  className="py-3.5 rounded-lg font-bold tracking-[0.2em] text-sm transition-all disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #8B6914 0%, #D4AF37 50%, #8B6914 100%)',
                    color: '#03000A',
                    boxShadow: '0 0 20px rgba(212,175,55,0.4)',
                  }}>
                  {loading ? "鑑定中..." : "✦ 今日の宿命を開く ✦"}
                </button>
              </form>
              <p className="text-center text-[#3A2A1A] text-xs mt-3">登録不要・30秒で完了・完全無料</p>
            </div>
          </div>

          {/* ── LP コンテンツ ── */}
          <div className="w-full max-w-2xl flex flex-col gap-14">

            {/* ① 数字 */}
            <section className="text-center section-lotus">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { num: "1300", unit: "年", desc: "密教に伝わる歴史" },
                  { num: "27", unit: "宿", desc: "月の通り道の区分" },
                  { num: "6", unit: "害", desc: "大凶日のパターン" },
                ].map(({ num, unit, desc }) => (
                  <div key={num} className="glass-card border-gold-ornate p-4 text-center">
                    <p className="font-bold" style={{ color: '#D4AF37', fontSize: '2.2rem', lineHeight: 1 }}>
                      {num}<span className="text-sm ml-0.5 text-[#9b8a6a]">{unit}</span>
                    </p>
                    <p className="text-[#7A6A50] text-xs mt-2">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ② 宿曜道とは — キャラ + テキスト */}
            <section className="section-lotus">
              <SectionTitle>宿曜道とは</SectionTitle>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 glass-card border-gold-ornate p-6 space-y-4">
                  <p className="text-[#e8d5a3] text-sm leading-relaxed">
                    宿曜道（しゅくようどう）は、インド占星術を起源とし、
                    <span className="text-[#D4AF37] font-bold">弘法大師・空海</span>が唐より日本へ持ち帰った
                    密教占星術です。
                  </p>
                  <p className="text-[#9b8a6a] text-sm leading-relaxed">
                    月が27の「宿」を巡る28日サイクルを利用して、
                    あなたの「本命宿」と今日の宿の関係から
                    その日の運気を読み解きます。
                  </p>
                  <div className="border-l-2 border-[#D4AF37]/30 pl-4">
                    <p className="text-[#D4AF37] text-xs leading-relaxed">
                      平安時代には貴族・武将の間で広く用いられ、
                      合戦の日取りや婚礼の日程もこれで決めていたとされています。
                    </p>
                  </div>
                </div>
                {/* 曼荼羅的な装飾 SVG */}
                <div className="md:w-48 flex-shrink-0 flex items-center justify-center">
                  <MandalaDecor />
                </div>
              </div>
            </section>

            {/* ③ 避凶の哲学 */}
            <section className="section-lotus">
              <SectionTitle>避凶の哲学</SectionTitle>
              <div className="glass-card-danger border border-red-900/40 p-6 space-y-4">
                <p className="text-[#fca5a5] text-base leading-relaxed font-bold text-center">
                  「吉を追うより、凶を避けよ」
                </p>
                <p className="text-[#9b8a6a] text-sm leading-relaxed">
                  損失を0にすることが最大の利益を生む──これが密教の本質です。
                  大凶日に動かないだけで、人生の失敗の多くは防げます。
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: "⛔", title: "六害宿の日", desc: "重要な決断・契約・投資を避ける" },
                    { icon: "⭐", title: "吉日の活用", desc: "商談・告白・引越しを集中させる" },
                    { icon: "🔴", title: "凶日の鉄則", desc: "現状維持・インドア・静観" },
                    { icon: "🪷", title: "毎朝の習慣", desc: "真言を唱え、波動を整える" },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="bg-black/30 rounded-xl p-3 border border-white/5">
                      <p className="text-xl mb-1">{icon}</p>
                      <p className="text-[#e8d5a3] text-xs font-bold mb-1">{title}</p>
                      <p className="text-[#5a4a3a] text-xs">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ④ 六害宿 */}
            <section className="section-lotus">
              <SectionTitle>六害宿とは</SectionTitle>
              <div className="glass-card border-gold-ornate p-6 space-y-3">
                <p className="text-[#9b8a6a] text-sm leading-relaxed mb-4">
                  本命宿から特定の距離にある6つの宿が「六害宿」。
                  <span className="text-[#fca5a5]">損失・破壊・身の危険</span>が集中する大凶日です。
                </p>
                {[
                  { dist: "+5", name: "衰", read: "おとろえ", desc: "体力・気力の消耗", level: "凶" },
                  { dist: "+6", name: "壊", read: "こわれ", desc: "破壊・崩壊・喪失", level: "大凶" },
                  { dist: "+7", name: "危", read: "き", desc: "身の危険・事故", level: "大凶" },
                  { dist: "+14", name: "成", read: "なる", desc: "表面吉の落とし穴", level: "凶" },
                  { dist: "+20", name: "収", read: "おさまり", desc: "収縮・損失固定", level: "凶" },
                  { dist: "+21", name: "開", read: "ひらく", desc: "空洞化・虚損", level: "凶" },
                ].map(({ dist, name, read, desc, level }) => (
                  <div key={name} className="flex items-center gap-3 rounded-lg px-3 py-2 bg-black/20 border border-white/[0.03]">
                    <span className="text-[#5a4a3a] text-xs w-8 shrink-0">{dist}</span>
                    <span className="text-[#D4AF37] font-bold text-sm w-5 shrink-0">{name}</span>
                    <span className="text-[#5a4a3a] text-xs w-14 shrink-0">（{read}）</span>
                    <span className="text-[#9b8a6a] text-xs flex-1">{desc}</span>
                    <span className={`text-xs font-bold shrink-0 ${level === "大凶" ? "text-red-400" : "text-orange-400"}`}>{level}</span>
                  </div>
                ))}
                <p className="text-[#D4AF37] text-xs text-center pt-2">毎朝のメールで大凶日を事前お知らせ</p>
              </div>
            </section>

            {/* ⑤ 使い方 */}
            <section className="section-lotus">
              <SectionTitle>使い方</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { step: "01", icon: "📅", title: "生年月日を入力", desc: "上のフォームから入力。本命宿が計算されます。" },
                  { step: "02", icon: "🔮", title: "今日の鑑定を確認", desc: "危険スコア・位・避けるべき行動が表示されます。" },
                  { step: "03", icon: "📧", title: "毎朝6:30に届く", desc: "メール登録で大凶日アラートが自動配信されます。" },
                  { step: "04", icon: "🛡", title: "凶日に動かない", desc: "朝「辛くてありがとう」を10回。吉日に大切な行動。" },
                ].map(({ step, icon, title, desc }) => (
                  <div key={step} className="glass-card border-gold-ornate p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#D4AF37]/30 font-bold text-xs">{step}</span>
                      <span className="text-lg">{icon}</span>
                    </div>
                    <p className="text-[#e8d5a3] text-xs font-bold mb-1">{title}</p>
                    <p className="text-[#5a4a3a] text-xs leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ⑥ FAQ */}
            <section className="section-lotus">
              <SectionTitle>よくある質問</SectionTitle>
              <div className="space-y-3">
                {[
                  { q: "星座占いと何が違うの？", a: "星座は太陽の位置、宿曜道は月の位置が基準です。月は毎日変わるため「今日という日」の精度が格段に高い占術です。" },
                  { q: "信じなくても効果はある？", a: "「信じる」より「大凶日に動かない」が大切です。損失回避は行動経済学でも実証されており、迷信とは異なります。" },
                  { q: "無料ですか？", a: "完全無料です。メールアドレスを登録するだけで毎朝届きます。解除もワンクリックです。" },
                  { q: "個人情報は？", a: "生年月日とメールアドレスのみ保存。第三者提供なし。いつでも配信停止・削除できます。" },
                ].map(({ q, a }) => (
                  <div key={q} className="glass-card border-gold-ornate p-5">
                    <p className="text-[#D4AF37] text-sm font-bold mb-2">Q. {q}</p>
                    <p className="text-[#7A6A50] text-xs leading-relaxed">A. {a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ⑦ 再CTA */}
            <section className="text-center pb-8">
              <div className="flex items-center gap-3 justify-center mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
                <span className="text-[#D4AF37]/40 text-lg">✦</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
              </div>
              <GuideSpirit mood="neutral" />
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="mt-6 px-10 py-3.5 rounded-lg font-bold tracking-[0.2em] text-sm"
                style={{
                  background: "linear-gradient(135deg, #8B6914 0%, #D4AF37 50%, #8B6914 100%)",
                  color: "#03000A",
                  boxShadow: "0 0 20px rgba(212,175,55,0.4)",
                }}>
                ✦ 無料で診断する ✦
              </button>
              <p className="text-[#3A2A1A] text-xs mt-3">登録不要・30秒・完全無料</p>
            </section>
          </div>
        </>
      ) : (
        <div className="w-full max-w-xl">
          {/* 結果画面でもキャラを表示 */}
          <div className="mb-6 flex justify-center">
            <GuideSpirit mood={getMood()} />
          </div>
          <DangerDashboard assessment={result} />
          {registered && (
            <div className="mt-4 glass-card p-5 text-center border border-[#7c3aed]/40">
              <p className="text-[#a78bfa] text-sm font-bold mb-1">✦ 毎朝6:30に届きます ✦</p>
              <p className="text-[#7A6A50] text-xs">ウェルカムメールと今日の鑑定をお送りしました</p>
            </div>
          )}
          <button
            onClick={() => { setResult(null); setRegistered(false); }}
            className="mt-6 w-full text-[#7A6A50] text-xs tracking-widest hover:text-[#D4AF37] transition-colors">
            ─ 別の生年月日で占い直す ─
          </button>
        </div>
      )}
    </main>
  );
}

// 小コンポーネント
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/25" />
      <p className="text-[#D4AF37] text-xs tracking-[0.3em] shrink-0">{children}</p>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/25" />
    </div>
  );
}

function MandalaDecor() {
  return (
    <svg viewBox="0 0 160 160" className="w-36 h-36 opacity-60 animate-spin-slow">
      <defs>
        <radialGradient id="m-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      <circle cx="80" cy="80" r="75" fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />
      <circle cx="80" cy="80" r="55" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5" />
      <circle cx="80" cy="80" r="35" fill="none" stroke="rgba(167,139,250,0.2)" strokeWidth="0.5" />
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => {
        const r = (a - 90) * Math.PI / 180;
        return (
          <g key={a}>
            <line x1={80} y1={80}
              x2={80 + 72 * Math.cos(r)} y2={80 + 72 * Math.sin(r)}
              stroke="rgba(212,175,55,0.12)" strokeWidth="0.5" />
            <circle cx={80 + 55 * Math.cos(r)} cy={80 + 55 * Math.sin(r)} r="3"
              fill="rgba(212,175,55,0.25)" />
          </g>
        );
      })}
      <circle cx="80" cy="80" r="12" fill="url(#m-grad)" />
      <circle cx="80" cy="80" r="4" fill="rgba(212,175,55,0.7)" />
    </svg>
  );
}
