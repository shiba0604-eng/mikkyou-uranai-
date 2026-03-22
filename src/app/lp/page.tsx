import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(251,191,36,0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(59,130,246,0.12), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-20 md:pt-28">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/90">
          HighStakes-Slides v2
        </p>
        <h1 className="text-center text-4xl font-bold leading-tight tracking-tight md:text-6xl md:leading-[1.08]">
          <span className="bg-gradient-to-r from-amber-200 via-white to-amber-100 bg-clip-text text-transparent">
            3時間を1分に変える
          </span>
          <br />
          <span className="text-white">次世代スライド自動調理</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-slate-400 md:text-xl">
          ペンは持たせない。軍師・作家・絵師・校閲の合議で「最高の一手」を提示し、あなたは
          <strong className="text-slate-200">承認（ディレクション）</strong>
          だけに集中する。
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/studio"
            className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-10 py-4 text-center text-base font-semibold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:from-amber-400 hover:to-amber-500"
          >
            スタジオを開く
          </Link>
          <a
            href="#dna"
            className="rounded-full border border-slate-600 px-8 py-3.5 text-sm font-medium text-slate-300 hover:border-slate-400"
          >
            Design DNA を見る
          </a>
        </div>

        <section className="mt-24 grid gap-10 md:grid-cols-3">
          {[
            {
              t: "外資コンサル級ロジック",
              d: "8つの勝利パターンから論理構造を自動選定。1スライド1メッセージを強制。",
            },
            {
              t: "雑誌級タイポグラフィ",
              d: "4つの Design DNA がレイアウトアルゴリズムまで切り替え。着せ替えではない。",
            },
            {
              t: "合議＋校閲リテイク",
              d: "70点以下は自動リテイク。ホバーで根拠と代替案3つ、クリックで即採用。",
            },
          ].map((x) => (
            <div
              key={x.t}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur"
            >
              <h2 className="text-lg font-semibold text-white">{x.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{x.d}</p>
            </div>
          ))}
        </section>

        <section id="dna" className="mt-24 scroll-mt-24">
          <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
            Design DNA
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-400">
            配色・フォントに加え、メッセージライン位置・グリッド密度・ジャンプ率まで定義。
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              ["Executive Trust", "濃紺×ゴールド。セリフ体。上部固定メッセージライン。"],
              ["Tech Minimal", "白×細線。Inter。アイコン主導のモダン密度。"],
              ["Authority Gold", "黒×シャンパンゴールド。極大ジャンプ率で権威。"],
              ["Editorial Magazine", "大胆余白・非対称。情緒的ストーリー。"],
            ].map(([name, desc]) => (
              <div
                key={String(name)}
                className="rounded-xl border border-slate-700/80 bg-slate-950/50 p-5"
              >
                <h3 className="font-semibold text-amber-200">{name}</h3>
                <p className="mt-2 text-sm text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-8 md:p-12">
          <h2 className="text-xl font-bold text-white md:text-2xl">
            本番運用の準備は済んでいる
          </h2>
          <ul className="mt-4 space-y-2 text-slate-400">
            <li>Stripe Checkout ＋ Webhook でクレジット付与</li>
            <li>書き出し時にクレジット消費（API で検証）</li>
            <li>ブラウザ完結の PptxGenJS 高精度エクスポート</li>
          </ul>
          <p className="mt-6 text-xs text-slate-500">
            環境変数:{" "}
            <code className="rounded bg-slate-900 px-1 py-0.5 text-slate-400">
              STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_SLIDE_CREDITS,
              NEXT_PUBLIC_APP_URL
            </code>
          </p>
        </section>
      </div>
    </div>
  );
}
