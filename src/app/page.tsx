"use client";

import { useState } from "react";
import { assessDanger, type DangerAssessment } from "../../lib/shukuyo";
import DangerDashboard from "@/components/DangerDashboard";

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
      } catch {
        // 登録失敗してもUI表示は続ける
      }
    }

    setLoading(false);
  };

  const handleReset = () => {
    setResult(null);
    setRegistered(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">

      {/* ── ヘッダー ── */}
      <header className="text-center mb-10 w-full max-w-xl">
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
          <span className="text-[#D4AF37] text-lg animate-pulse-gold">✦</span>
          <span className="text-[#D4AF37]/60 text-sm tracking-[0.4em] uppercase">Mikkyō Astrology</span>
          <span className="text-[#D4AF37] text-lg animate-pulse-gold">✦</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-glow-gold"
            style={{ color: '#D4AF37', letterSpacing: '0.1em' }}>
          避凶の宿曜道
        </h1>
        <p className="text-[#9B7D5E] text-sm tracking-widest mb-2">真・密教占星術</p>
        <p className="text-[#7A6A50] text-xs tracking-wider">
          1300年前に封印された術 ─ 二十七宿で今日の禍を避ける
        </p>

        <div className="flex items-center gap-3 justify-center mt-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
          <span className="text-[#D4AF37]/40 text-xs">◈</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
        </div>
      </header>

      {/* ── 入力フォーム ── */}
      {!result && (
        <>
          <div className="w-full max-w-sm animate-float">
            <div className="flex justify-between px-4 mb-4 text-2xl">
              <span className="text-[#D4AF37]/60" style={{ textShadow: '0 0 15px rgba(212,175,55,0.6)' }}>☽</span>
              <span className="text-[#D4AF37]/40 text-base self-center">✦  ✦  ✦</span>
              <span className="text-[#D4AF37]/60" style={{ textShadow: '0 0 15px rgba(212,175,55,0.6)' }}>☀</span>
            </div>

            <form onSubmit={handleSubmit} className="glass-card glow-gold p-8 flex flex-col gap-5">
              <div className="text-center">
                <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mb-1">Your Birth Date</p>
                <p className="text-[#F0E6D0] text-sm tracking-widest">生年月日を入力してください</p>
              </div>

              <hr className="divider-gold" />

              {/* 年 */}
              <div>
                <label className="text-[#7A6A50] text-xs tracking-widest block mb-1.5">年 Year</label>
                <input
                  type="number" placeholder="例: 1990"
                  value={birthYear} onChange={(e) => setBirthYear(e.target.value)}
                  required min={1900} max={2025}
                  className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 text-[#F0E6D0] text-sm placeholder-[#3A2A1A] focus:outline-none focus:border-[#D4AF37]/60 focus:shadow-[0_0_12px_rgba(212,175,55,0.2)] transition-all"
                />
              </div>

              {/* 月・日 */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[#7A6A50] text-xs tracking-widest block mb-1.5">月 Month</label>
                  <input
                    type="number" placeholder="1〜12"
                    value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)}
                    required min={1} max={12}
                    className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-lg px-3 py-2.5 text-[#F0E6D0] text-sm placeholder-[#3A2A1A] focus:outline-none focus:border-[#D4AF37]/60 transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[#7A6A50] text-xs tracking-widest block mb-1.5">日 Day</label>
                  <input
                    type="number" placeholder="1〜31"
                    value={birthDay} onChange={(e) => setBirthDay(e.target.value)}
                    required min={1} max={31}
                    className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-lg px-3 py-2.5 text-[#F0E6D0] text-sm placeholder-[#3A2A1A] focus:outline-none focus:border-[#D4AF37]/60 transition-all"
                  />
                </div>
              </div>

              <hr className="divider-gold" />

              {/* メール（任意） */}
              <div>
                <label className="text-[#7A6A50] text-xs tracking-widest block mb-1.5">
                  メールアドレス
                  <span className="ml-2 text-[#3A2A1A]">（毎朝6:30に配信・任意）</span>
                </label>
                <input
                  type="email" placeholder="your@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 text-[#F0E6D0] text-sm placeholder-[#3A2A1A] focus:outline-none focus:border-[#D4AF37]/60 transition-all"
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="relative overflow-hidden py-3.5 rounded-lg font-bold tracking-[0.2em] text-sm transition-all disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #8B6914 0%, #D4AF37 50%, #8B6914 100%)',
                  color: '#03000A',
                  boxShadow: '0 0 20px rgba(212,175,55,0.4)',
                }}
              >
                {loading ? "鑑定中..." : "✦ 今日の宿命を開く ✦"}
              </button>
            </form>

            <p className="text-center text-[#3A2A1A] text-xs mt-4 tracking-wider">
              守護霊からのサインを受け取る
            </p>
          </div>

          {/* ── LP コンテンツ ── */}
          <div className="w-full max-w-xl mt-20 flex flex-col gap-16">

            {/* ① 数字でみる */}
            <section className="text-center">
              <p className="text-[#D4AF37]/50 text-xs tracking-[0.4em] uppercase mb-8">The Numbers</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { num: "1300", unit: "年", desc: "密教に伝わる歴史" },
                  { num: "27", unit: "宿", desc: "月の通り道の区分" },
                  { num: "6", unit: "害", desc: "大凶日のパターン" },
                ].map(({ num, unit, desc }) => (
                  <div key={num} className="glass-card p-4 text-center">
                    <p className="text-[#D4AF37] font-bold" style={{ fontSize: "2rem", lineHeight: 1 }}>
                      {num}<span className="text-sm ml-0.5">{unit}</span>
                    </p>
                    <p className="text-[#7A6A50] text-xs mt-2">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ② 宿曜道とは */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
                <p className="text-[#D4AF37] text-xs tracking-[0.3em] shrink-0">宿曜道とは</p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
              </div>
              <div className="glass-card p-6 space-y-4">
                <p className="text-[#e8d5a3] text-sm leading-relaxed">
                  宿曜道（しゅくようどう）は、インド占星術を起源とし、唐の玄奘三蔵が中国へ、
                  そして弘法大師・空海が日本へ持ち帰った<span className="text-[#D4AF37]">密教占星術</span>です。
                </p>
                <p className="text-[#9b8a6a] text-sm leading-relaxed">
                  月が27の「宿（しゅく）」を巡るサイクルを利用して、
                  生年月日から導き出される「本命宿」と今日の宿の関係から、
                  その日の運気の流れを読み解きます。
                </p>
                <div className="border-l-2 border-[#D4AF37]/30 pl-4">
                  <p className="text-[#D4AF37] text-xs leading-relaxed">
                    平安時代には貴族・武将の間で広く用いられ、
                    合戦の日取りや婚礼の日程もこれで決めていたとされています。
                  </p>
                </div>
              </div>
            </section>

            {/* ③ 避凶の哲学 */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
                <p className="text-[#D4AF37] text-xs tracking-[0.3em] shrink-0">避凶の哲学</p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
              </div>
              <div className="glass-card-danger p-6 space-y-4">
                <p className="text-[#fca5a5] text-sm leading-relaxed font-bold">
                  「吉を追うより、凶を避けよ」
                </p>
                <p className="text-[#9b8a6a] text-sm leading-relaxed">
                  現代人は「いい日を選ぶ」ことに意識が向きがちですが、
                  密教の本質は逆です。<span className="text-[#e8d5a3]">損失を0にすること</span>が、
                  最大の利益を生む──という考え方です。
                </p>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    { icon: "⛔", title: "六害宿の日", desc: "重要な決断・契約・投資を避ける" },
                    { icon: "⭐", title: "吉日の活用", desc: "商談・告白・引越しを集中させる" },
                    { icon: "🔴", title: "凶日の行動", desc: "なるべく現状維持・インドアに徹する" },
                    { icon: "🛡", title: "護身真言", desc: "毎朝唱えることで波動を整える" },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="bg-black/30 rounded-lg p-3">
                      <p className="text-base mb-1">{icon}</p>
                      <p className="text-[#e8d5a3] text-xs font-bold mb-1">{title}</p>
                      <p className="text-[#7A6A50] text-xs">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ④ 六害宿 */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
                <p className="text-[#D4AF37] text-xs tracking-[0.3em] shrink-0">六害宿とは</p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
              </div>
              <div className="glass-card p-6 space-y-4">
                <p className="text-[#9b8a6a] text-sm leading-relaxed">
                  あなたの本命宿から特定の距離にある6つの宿が「六害宿」です。
                  その日は<span className="text-[#fca5a5]">損失・破壊・身の危険・人間関係の崩壊</span>が
                  集中しやすい大凶日とされています。
                </p>
                <div className="space-y-2">
                  {[
                    { name: "+5宿目　衰（おとろえ）", desc: "体力・気力の消耗", level: "凶" },
                    { name: "+6宿目　壊（こわれ）", desc: "破壊・崩壊・喪失", level: "大凶" },
                    { name: "+7宿目　危（き）", desc: "身の危険・事故", level: "大凶" },
                    { name: "+14宿目　成（なる）", desc: "表面吉の落とし穴", level: "凶" },
                    { name: "+20宿目　収（おさまり）", desc: "収縮・損失固定", level: "凶" },
                    { name: "+21宿目　開（ひらく）", desc: "空洞化・虚損", level: "凶" },
                  ].map(({ name, desc, level }) => (
                    <div key={name} className="flex items-center gap-3 bg-black/20 rounded-lg px-3 py-2">
                      <span className={`text-xs font-bold shrink-0 w-6 text-center ${level === "大凶" ? "text-red-400" : "text-orange-400"}`}>
                        {level}
                      </span>
                      <div>
                        <p className="text-[#e8d5a3] text-xs font-bold">{name}</p>
                        <p className="text-[#7A6A50] text-xs">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[#D4AF37] text-xs text-center">
                  毎朝のメールで大凶日を事前にお知らせします
                </p>
              </div>
            </section>

            {/* ⑤ 使い方 */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
                <p className="text-[#D4AF37] text-xs tracking-[0.3em] shrink-0">使い方</p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
              </div>
              <div className="space-y-3">
                {[
                  {
                    step: "01",
                    title: "生年月日を入力する",
                    desc: "上のフォームから生年月日とメールアドレスを入力。本命宿が計算されます。",
                  },
                  {
                    step: "02",
                    title: "今日の鑑定を確認する",
                    desc: "危険スコア・今日の位・避けるべき行動・護身真言が表示されます。",
                  },
                  {
                    step: "03",
                    title: "毎朝6:30にメールが届く",
                    desc: "登録後は毎朝自動配信。六害宿の大凶日には特別アラートが届きます。",
                  },
                  {
                    step: "04",
                    title: "凶日は行動を最小化する",
                    desc: "「辛くてありがとう」を朝10回唱え、重要な行動は吉日に回す。",
                  },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="glass-card p-4 flex gap-4">
                    <p className="text-[#D4AF37]/40 font-bold text-xl shrink-0 w-8">{step}</p>
                    <div>
                      <p className="text-[#e8d5a3] text-sm font-bold mb-1">{title}</p>
                      <p className="text-[#7A6A50] text-xs leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ⑥ よくある質問 */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
                <p className="text-[#D4AF37] text-xs tracking-[0.3em] shrink-0">よくある質問</p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
              </div>
              <div className="space-y-3">
                {[
                  {
                    q: "西洋占星術（星座）と何が違うの？",
                    a: "星座占いは太陽の位置を基準にしますが、宿曜道は月の位置を基準にします。月は27〜28日で地球を一周するため、毎日変わります。つまり「今日という日」の精度が格段に高い占術です。",
                  },
                  {
                    q: "信じなくても効果はある？",
                    a: "「信じる・信じない」より「行動しない」が大切です。大凶日に重要な決断を控えるだけで、統計的に損失が減ります。損失回避は行動経済学でも証明されており、占いと科学の交点です。",
                  },
                  {
                    q: "無料ですか？",
                    a: "はい、完全無料です。メールアドレスを登録するだけで毎朝の鑑定が届きます。解除もワンクリックです。",
                  },
                  {
                    q: "個人情報はどう扱われますか？",
                    a: "生年月日とメールアドレスのみを保存します。第三者への提供は一切行いません。いつでも配信停止・データ削除できます。",
                  },
                ].map(({ q, a }) => (
                  <div key={q} className="glass-card p-5">
                    <p className="text-[#D4AF37] text-sm font-bold mb-2">Q. {q}</p>
                    <p className="text-[#9b8a6a] text-xs leading-relaxed">A. {a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ⑦ 再フォーム誘導 */}
            <section className="text-center pb-8">
              <div className="flex items-center gap-3 justify-center mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
                <span className="text-[#D4AF37]/40 text-xs">◈</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
              </div>
              <p className="text-[#9B7D5E] text-sm mb-2">まずは今日の宿命を確かめてください</p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-8 py-3 rounded-lg font-bold tracking-[0.2em] text-sm"
                style={{
                  background: "linear-gradient(135deg, #8B6914 0%, #D4AF37 50%, #8B6914 100%)",
                  color: "#03000A",
                  boxShadow: "0 0 20px rgba(212,175,55,0.4)",
                }}
              >
                ✦ 無料で診断する ✦
              </button>
              <p className="text-[#3A2A1A] text-xs mt-3">登録不要・30秒で完了</p>
            </section>
          </div>
        </>
      )}

      {/* ── 結果表示 ── */}
      {result && (
        <div className="w-full max-w-xl">
          <DangerDashboard assessment={result} />

          {registered && (
            <div className="mt-4 glass-card p-5 text-center border border-[#7c3aed]/40">
              <p className="text-[#a78bfa] text-sm font-bold mb-1">✦ 毎朝6:30に届きます ✦</p>
              <p className="text-[#7A6A50] text-xs">ウェルカムメールと今日の鑑定をお送りしました</p>
            </div>
          )}

          <button
            onClick={handleReset}
            className="mt-6 w-full text-[#7A6A50] text-xs tracking-widest hover:text-[#D4AF37] transition-colors"
          >
            ─ 別の生年月日で占い直す ─
          </button>
        </div>
      )}
    </main>
  );
}
