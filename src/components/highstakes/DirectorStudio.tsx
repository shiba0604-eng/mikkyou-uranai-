"use client";

import type { DesignDnaId, OrchestratorResult, SlideDeckSlide } from "@lib/agents/types";
import { DESIGN_DNAS, DNA_IDS } from "@styles/dna";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

function cloneSlides(slides: SlideDeckSlide[]): SlideDeckSlide[] {
  return JSON.parse(JSON.stringify(slides)) as SlideDeckSlide[];
}

export default function DirectorStudio() {
  const [notes, setNotes] = useState("");
  const debouncedNotes = useDebounced(notes, 350);
  const [result, setResult] = useState<OrchestratorResult | null>(null);
  const [slides, setSlides] = useState<SlideDeckSlide[]>([]);
  const [selectedDna, setSelectedDna] = useState<DesignDnaId>("executive_trust");
  const [hoverDna, setHoverDna] = useState<DesignDnaId | null>(null);
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);
  const [loadingGen, setLoadingGen] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const genSeq = useRef(0);
  const genAbortRef = useRef<AbortController | null>(null);
  const [email, setEmail] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [hoverElement, setHoverElement] = useState<{
    slideId: string;
    elementId: string;
  } | null>(null);

  const effectiveDna = hoverDna ?? selectedDna;

  const runGenerate = useCallback(async (text: string, signal?: AbortSignal) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setGenError(
        "メモが空です。貼り付けたあと「今すぐ生成」を押すか、文字が入っているか確認してください。",
      );
      setResult(null);
      setSlides([]);
      return;
    }
    const id = ++genSeq.current;
    setLoadingGen(true);
    setGenError(null);
    try {
      const res = await fetch("/api/highstakes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: trimmed }),
        signal,
      });
      const data = (await res.json()) as OrchestratorResult & { error?: string };
      if (id !== genSeq.current) return;
      if (!res.ok) {
        const msg =
          typeof data.error === "string"
            ? data.error
            : `生成APIエラー (${res.status})`;
        throw new Error(msg);
      }
      setResult(data);
      setSlides(cloneSlides(data.slides));
    } catch (e) {
      if (id !== genSeq.current) return;
      if (e instanceof DOMException && e.name === "AbortError") return;
      setResult(null);
      setSlides([]);
      setGenError(e instanceof Error ? e.message : "生成に失敗しました");
    } finally {
      if (id === genSeq.current) setLoadingGen(false);
    }
  }, []);

  useEffect(() => {
    if (!debouncedNotes.trim()) {
      if (!notes.trim()) {
        genAbortRef.current?.abort();
        setResult(null);
        setSlides([]);
        setGenError(null);
      }
      return;
    }
    if (debouncedNotes !== notes) return;

    genAbortRef.current?.abort();
    const ac = new AbortController();
    genAbortRef.current = ac;
    void runGenerate(debouncedNotes, ac.signal);
    return () => ac.abort();
  }, [debouncedNotes, notes, runGenerate]);

  useEffect(() => {
    return () => {
      if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
    };
  }, [previewObjectUrl]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!slides.length) {
        setPreviewObjectUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        setPreviewError(null);
        return;
      }
      setLoadingPreview(true);
      setPreviewError(null);
      try {
        const res = await fetch("/api/highstakes/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slides, dnaId: effectiveDna }),
        });
        const data = (await res.json()) as { html?: string; error?: string };
        if (cancelled) return;
        if (!res.ok) {
          throw new Error(
            typeof data.error === "string"
              ? data.error
              : `プレビューAPIエラー (${res.status})`,
          );
        }
        const html = data.html ?? "";
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        setPreviewObjectUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } catch (e) {
        if (cancelled) return;
        setPreviewObjectUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        setPreviewError(
          e instanceof Error ? e.message : "プレビューの取得に失敗しました",
        );
      } finally {
        if (!cancelled) setLoadingPreview(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slides, effectiveDna]);

  const refreshCredits = useCallback(async () => {
    if (!email.includes("@")) {
      setCredits(null);
      return;
    }
    const res = await fetch(
      `/api/highstakes/credits?email=${encodeURIComponent(email)}`,
    );
    const data = (await res.json()) as { balance?: number };
    if (res.ok) setCredits(data.balance ?? 0);
  }, [email]);

  useEffect(() => {
    void refreshCredits();
  }, [refreshCredits]);

  const applyAlternative = useCallback(
    (slideId: string, elementId: string, text: string) => {
      setSlides((prev) =>
        prev.map((sl) =>
          sl.id !== slideId
            ? sl
            : {
                ...sl,
                elements: sl.elements.map((el) =>
                  el.id !== elementId ? el : { ...el, content: text },
                ),
              },
        ),
      );
      setHoverElement(null);
    },
    [],
  );

  const exportPptx = useCallback(async () => {
    if (!slides.length || !email.includes("@")) return;
    setExporting(true);
    try {
      const res = await fetch("/api/highstakes/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          slideCount: slides.length,
          dnaId: selectedDna,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; balance?: number };
      if (!res.ok) {
        alert(data.balance != null ? `クレジット不足（残: ${data.balance}）` : "エクスポート不可");
        return;
      }
      const PptxGenJS = (await import("pptxgenjs")).default;
      const dna = DESIGN_DNAS[selectedDna];
      const pptx = new PptxGenJS();
      pptx.layout = "LAYOUT_WIDE";
      const bg = dna.colors.bg.replace("#", "");
      const fg = dna.colors.fg.replace("#", "");
      const accent = dna.colors.accent.replace("#", "");

      for (const sl of slides) {
        const s = pptx.addSlide();
        s.background = { color: bg };
        const title =
          sl.elements.find((e) => e.kind === "title")?.content ?? sl.keyMessage;
        s.addText(title, {
          x: 0.5,
          y: 0.35,
          w: 9,
          h: 0.9,
          fontSize: 28,
          bold: true,
          color: accent,
          fontFace: dna.layoutProfile.iconForward ? "Arial" : "Georgia",
        });
        const bodyParts = sl.elements
          .filter((e) => e.kind !== "title")
          .map((e) => ({
            text: e.content,
            options: { bullet: true, fontSize: 14, color: fg },
          }));
        if (bodyParts.length) {
          s.addText(bodyParts, {
            x: 0.55,
            y: 1.35,
            w: 8.9,
            h: 3.8,
            valign: "top",
          });
        }
        if (sl.speakerNotes) s.addNotes(sl.speakerNotes);
      }

      await pptx.writeFile({
        fileName: `highstakes-${selectedDna}.pptx`,
      });
      setCredits(data.balance ?? null);
    } catch (e) {
      console.error(e);
      alert("PPTX の生成に失敗しました");
    } finally {
      setExporting(false);
    }
  }, [slides, email, selectedDna]);

  const statusLines = useMemo(() => result?.statusLog ?? [], [result]);

  const popover = useMemo(() => {
    if (!hoverElement || !slides.length) return null;
    const sl = slides.find((s) => s.id === hoverElement.slideId);
    const el = sl?.elements.find((e) => e.id === hoverElement.elementId);
    if (!sl || !el) return null;
    return { slide: sl, el };
  }, [hoverElement, slides]);

  return (
    <div className="flex min-h-[calc(100vh-2rem)] flex-col gap-4 lg:flex-row">
      <section className="glass-panel flex w-full flex-1 flex-col gap-3 p-4 lg:max-w-xl">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          Director Studio
        </h1>
        <p className="text-sm text-slate-600">
          素材を放り込むだけ。エージェント合議で骨子→コピー→図解→校閲まで自律実行。あなたは承認とDNA選択だけ。
        </p>
        <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
          素材（雑多なメモ）
        </label>
        <textarea
          className="min-h-[200px] rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 shadow-inner outline-none focus:border-amber-600"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ここにメモを貼り付け。数秒後に自動生成、または下の「今すぐ生成」を押してください。"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={loadingGen || !notes.trim()}
            onClick={() => {
              genAbortRef.current?.abort();
              const ac = new AbortController();
              genAbortRef.current = ac;
              void runGenerate(notes, ac.signal);
            }}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 hover:bg-amber-700"
          >
            今すぐ生成
          </button>
          <span className="self-center text-xs text-slate-500">
            貼り付けだけでは未入力に見える場合は、一度クリックしてフォーカスを置いてから貼り付け直してください。
          </span>
        </div>
        {genError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
            {genError}
          </div>
        )}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 text-xs font-semibold text-slate-700">
            進捗ステータス
            {loadingGen && (
              <span className="ml-2 text-amber-700">生成中…</span>
            )}
          </div>
          <ul className="max-h-40 space-y-1 overflow-y-auto text-xs text-slate-600">
            {statusLines.map((s, i) => (
              <li key={i}>
                <span className="font-medium text-slate-800">[{s.agent}]</span>{" "}
                {s.phase}: {s.detail}
              </li>
            ))}
            {!statusLines.length && (
              <li className="text-slate-400">
                {notes.trim()
                  ? "生成待ち（自動は入力止めてから約0.35秒後）"
                  : "メモを入力するか貼り付けてください"}
              </li>
            )}
          </ul>
          {result && (
            <div className="mt-2 border-t border-slate-200 pt-2 text-xs">
              <span className="font-semibold">校閲スコア: {result.review.score}</span>
              <span className="text-slate-500">
                {" "}
                / パターン: {result.patternLabel} / 反復 {result.iterations} 回
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Design DNA（ホバーで右プレビューが一時切替）
          </div>
          <div className="flex flex-wrap gap-2">
            {DNA_IDS.map((id) => (
              <button
                key={id}
                type="button"
                title={DESIGN_DNAS[id].name}
                onClick={() => setSelectedDna(id)}
                onMouseEnter={() => setHoverDna(id)}
                onMouseLeave={() => setHoverDna(null)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  selectedDna === id
                    ? "border-amber-700 bg-amber-50 text-amber-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-amber-400"
                }`}
              >
                {DESIGN_DNAS[id].name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-200 pt-3">
          <div className="text-xs font-semibold text-slate-700">
            書き出し（PPTX）・クレジット
          </div>
          <input
            type="email"
            className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
            placeholder="メール（残高確認・消費）"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span>
              残高: {credits === null ? "—" : credits}
            </span>
            <button
              type="button"
              className="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100"
              onClick={() => void refreshCredits()}
            >
              更新
            </button>
          </div>
          <button
            type="button"
            disabled={exporting || !slides.length}
            onClick={() => void exportPptx()}
            className="w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {exporting ? "書き出し中…" : "PPTX エクスポート（1クレジット）"}
          </button>
        </div>

        {slides.length > 0 && (
          <div className="space-y-3 border-t border-slate-200 pt-3">
            <div className="text-xs font-semibold uppercase text-slate-500">
              ホバー提案（根拠＋代替3案）
            </div>
            {slides.map((sl) => (
              <div key={sl.id} className="rounded border border-slate-100 bg-white p-2 text-xs">
                <div className="mb-1 font-medium text-slate-800">{sl.keyMessage}</div>
                <div className="text-slate-500">{sl.layoutRationale}</div>
                <ul className="mt-2 space-y-1">
                  {sl.elements.map((el) => (
                    <li
                      key={el.id}
                      className="cursor-help rounded px-1 hover:bg-amber-50"
                      onMouseEnter={() =>
                        setHoverElement({ slideId: sl.id, elementId: el.id })
                      }
                      onMouseLeave={() => setHoverElement(null)}
                    >
                      <span className="text-slate-700">{el.content}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="glass-panel relative flex min-h-[480px] flex-1 flex-col p-2">
        <div className="mb-2 flex items-center justify-between px-2 text-xs text-slate-600">
          <span>Marp プレビュー（{DESIGN_DNAS[effectiveDna].name}）</span>
          {loadingPreview && <span className="text-amber-700">描画中…</span>}
        </div>
        {previewError && (
          <div className="mx-2 mb-2 rounded border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-900">
            プレビュー: {previewError}
          </div>
        )}
        <iframe
          title="marp-preview"
          className="h-[min(72vh,800px)] w-full flex-1 rounded-lg border border-slate-200 bg-white"
          src={previewObjectUrl ?? undefined}
          srcDoc={
            previewObjectUrl
              ? undefined
              : "<!DOCTYPE html><html><body style='margin:0;padding:1rem;font:14px system-ui;color:#64748b'>左でメモを入力し「今すぐ生成」または自動生成を待つと、ここにスライドが表示されます。</body></html>"
          }
        />

        {popover && (
          <div className="pointer-events-auto absolute bottom-4 left-4 right-4 z-10 max-h-[45vh] overflow-y-auto rounded-xl border border-amber-200 bg-white/95 p-3 shadow-xl backdrop-blur">
            <div className="text-xs font-semibold text-amber-900">エージェント根拠</div>
            <p className="mt-1 text-xs text-slate-700">{popover.el.rationale}</p>
            <div className="mt-2 text-xs font-semibold text-slate-800">代替案</div>
            <ul className="mt-1 space-y-1">
              {popover.el.alternatives.map((a) => (
                <li key={a.label}>
                  <button
                    type="button"
                    className="w-full rounded border border-slate-200 px-2 py-1 text-left text-xs hover:border-amber-500 hover:bg-amber-50"
                    onClick={() =>
                      applyAlternative(
                        popover.slide.id,
                        popover.el.id,
                        a.text,
                      )
                    }
                  >
                    <span className="font-medium">{a.label}</span>
                    <span className="block text-slate-600">{a.text}</span>
                    <span className="text-slate-400">{a.rationale}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
