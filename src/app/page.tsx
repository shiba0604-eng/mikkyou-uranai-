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

    // メールアドレスが入力されていれば登録 & 即送信
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
      <header className="text-center mb-12 w-full max-w-xl">
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
                type="number"
                placeholder="例: 1990"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                required min={1900} max={2025}
                className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 text-[#F0E6D0] text-sm placeholder-[#3A2A1A] focus:outline-none focus:border-[#D4AF37]/60 focus:shadow-[0_0_12px_rgba(212,175,55,0.2)] transition-all"
              />
            </div>

            {/* 月・日 */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[#7A6A50] text-xs tracking-widest block mb-1.5">月 Month</label>
                <input
                  type="number"
                  placeholder="1〜12"
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  required min={1} max={12}
                  className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-lg px-3 py-2.5 text-[#F0E6D0] text-sm placeholder-[#3A2A1A] focus:outline-none focus:border-[#D4AF37]/60 transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="text-[#7A6A50] text-xs tracking-widest block mb-1.5">日 Day</label>
                <input
                  type="number"
                  placeholder="1〜31"
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  required min={1} max={31}
                  className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-lg px-3 py-2.5 text-[#F0E6D0] text-sm placeholder-[#3A2A1A] focus:outline-none focus:border-[#D4AF37]/60 transition-all"
                />
              </div>
            </div>

            <hr className="divider-gold" />

            {/* メールアドレス（任意） */}
            <div>
              <label className="text-[#7A6A50] text-xs tracking-widest block mb-1.5">
                メールアドレス
                <span className="ml-2 text-[#3A2A1A]">（毎朝6:30に配信・任意）</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 text-[#F0E6D0] text-sm placeholder-[#3A2A1A] focus:outline-none focus:border-[#D4AF37]/60 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
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
      )}

      {/* ── 結果表示 ── */}
      {result && (
        <div className="w-full max-w-xl">
          <DangerDashboard assessment={result} />

          {/* メール登録完了バナー */}
          {registered && (
            <div className="mt-4 glass-card p-4 text-center border border-[#7c3aed]/40">
              <p className="text-[#a78bfa] text-sm font-bold">✦ 毎朝6:30に届きます ✦</p>
              <p className="text-[#7A6A50] text-xs mt-1">今日の鑑定をメールで送りました</p>
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
