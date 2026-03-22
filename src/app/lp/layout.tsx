import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HighStakes-Slides v2 — 3時間を1分に",
  description:
    "プロの思考プロセスを自律化。外資コンサル級の論理と雑誌級タイポで、スライドを自動調理。",
};

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 antialiased">
      {children}
    </div>
  );
}
