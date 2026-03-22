import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HighStakes-Slides v2 — Director Studio",
  description:
    "自律型エージェントがスライドを調理。あなたは承認とディレクションのみ。",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-amber-50/40 p-4 text-slate-900">
      <header className="mx-auto mb-4 flex max-w-[1400px] flex-wrap items-center justify-between gap-2">
        <Link
          href="/lp"
          className="text-sm font-semibold tracking-tight text-slate-800 hover:text-amber-800"
        >
          HighStakes-Slides v2
        </Link>
        <nav className="flex gap-4 text-sm text-slate-600">
          <Link href="/" className="hover:text-slate-900">
            トップ（占いアプリ）
          </Link>
          <Link href="/lp" className="hover:text-slate-900">
            LP
          </Link>
        </nav>
      </header>
      <main className="glass-panel mx-auto max-w-[1400px] rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-lg backdrop-blur-md">
        {children}
      </main>
    </div>
  );
}
