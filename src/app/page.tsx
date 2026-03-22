"use client";

import { useState } from "react";
import { assessDanger, type DangerAssessment } from "../../lib/shukuyo";
import DangerDashboard from "@/components/DangerDashboard";

export default function Home() {
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [result, setResult] = useState<DangerAssessment | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assessment = assessDanger(
      parseInt(birthYear),
      parseInt(birthMonth),
      parseInt(birthDay),
    );
    setResult(assessment);
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      {/* ヘッダー */}
      <div className="text-center mb-10">
        <p className="text-[#C9A84C] text-sm tracking-widest mb-2">密教占星術</p>
        <h1 className="text-3xl md:text-4xl font-bold text-[#e8d5a3] mb-2">
          避凶の宿曜道
        </h1>
        <p className="text-[#9b8a6a] text-sm">
          宿曜二十七宿 ― 今日の凶を知り、禍を避ける
        </p>
      </div>

      {/* 入力フォーム */}
      {!result && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-[#1a0a2e] border border-[#C9A84C]/30 rounded-2xl p-8 flex flex-col gap-5"
        >
          <p className="text-[#C9A84C] text-center text-sm tracking-widest">
            生年月日を入力してください
          </p>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="年（例：1990）"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              required
              min={1900}
              max={2025}
              className="flex-1 bg-[#0d0620] border border-[#C9A84C]/30 rounded-lg px-3 py-2 text-[#e8d5a3] text-sm placeholder-[#5a4a3a] focus:outline-none focus:border-[#C9A84C]"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="月（1〜12）"
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              required
              min={1}
              max={12}
              className="flex-1 bg-[#0d0620] border border-[#C9A84C]/30 rounded-lg px-3 py-2 text-[#e8d5a3] text-sm placeholder-[#5a4a3a] focus:outline-none focus:border-[#C9A84C]"
            />
            <input
              type="number"
              placeholder="日（1〜31）"
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              required
              min={1}
              max={31}
              className="flex-1 bg-[#0d0620] border border-[#C9A84C]/30 rounded-lg px-3 py-2 text-[#e8d5a3] text-sm placeholder-[#5a4a3a] focus:outline-none focus:border-[#C9A84C]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#C9A84C] text-[#0d0620] font-bold py-3 rounded-lg hover:bg-[#e8c86c] transition-colors tracking-widest"
          >
            今日の凶を占う
          </button>
        </form>
      )}

      {/* 結果表示 */}
      {result && (
        <div className="w-full max-w-2xl">
          <DangerDashboard assessment={result} />
          <button
            onClick={() => setResult(null)}
            className="mt-6 w-full text-[#9b8a6a] text-sm underline hover:text-[#C9A84C]"
          >
            別の生年月日で占い直す
          </button>
        </div>
      )}
    </main>
  );
}
