import type { DesignDnaId } from "@lib/agents/types";

export interface DesignDNA {
  id: DesignDnaId;
  name: string;
  /** レイアウトアルゴリズム: メッセージライン位置・グリッド密度 */
  layoutProfile: {
    messageLine: "top-fixed" | "floating" | "hero" | "asymmetric";
    gridDensity: "tight" | "regular" | "airy" | "editorial";
    iconForward: boolean;
    jumpRate: "moderate" | "high" | "extreme" | "editorial";
  };
  fonts: { heading: string; body: string; importUrl?: string };
  colors: {
    bg: string;
    fg: string;
    muted: string;
    accent: string;
    line: string;
  };
  /** Marp / HTML に注入するセクション用CSS */
  sectionCss: string;
  /** Tailwind 風ユーティリティ（プレビューiframe用） */
  previewClass: string;
}

const serifStack =
  "'Noto Serif JP', 'Source Serif 4', 'Times New Roman', serif";
const interStack = "Inter, system-ui, sans-serif";
const displayStack = "'Playfair Display', 'Noto Serif JP', serif";

export const DESIGN_DNAS: Record<DesignDnaId, DesignDNA> = {
  executive_trust: {
    id: "executive_trust",
    name: "Executive Trust",
    layoutProfile: {
      messageLine: "top-fixed",
      gridDensity: "regular",
      iconForward: false,
      jumpRate: "moderate",
    },
    fonts: {
      heading: serifStack,
      body: serifStack,
      importUrl:
        "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap",
    },
    colors: {
      bg: "#0B1F3B",
      fg: "#F4F1EA",
      muted: "#94A3B8",
      accent: "#C9A227",
      line: "rgba(201,162,39,0.35)",
    },
    sectionCss: `
      section {
        background: linear-gradient(180deg, #0B1F3B 0%, #0a1628 100%);
        color: #F4F1EA;
        font-family: ${serifStack};
      }
      .hs-msgline {
        position: absolute; top: 48px; left: 64px; right: 64px;
        border-bottom: 1px solid rgba(201,162,39,0.45);
        padding-bottom: 12px;
        font-size: 0.85rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #C9A227;
      }
      .hs-layout { padding-top: 96px; }
      .hs-parallel { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
      .hs-trend { display: flex; flex-direction: column; gap: 1rem; border-left: 3px solid #C9A227; padding-left: 1.5rem; }
      .hs-contrast { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
      .hs-nested { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; border: 1px solid rgba(201,162,39,0.25); border-radius: 8px; }
      h1 { color: #C9A227; font-size: 1.75rem; margin-bottom: 1rem; }
      li { margin: 0.35rem 0; }
    `,
    previewClass: "bg-[#0B1F3B] text-[#F4F1EA] font-serif",
  },
  tech_minimal: {
    id: "tech_minimal",
    name: "Tech Minimal",
    layoutProfile: {
      messageLine: "floating",
      gridDensity: "tight",
      iconForward: true,
      jumpRate: "moderate",
    },
    fonts: {
      heading: interStack,
      body: interStack,
      importUrl:
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
    },
    colors: {
      bg: "#FFFFFF",
      fg: "#0F172A",
      muted: "#64748B",
      accent: "#2563EB",
      line: "#E2E8F0",
    },
    sectionCss: `
      section {
        background: #fff;
        color: #0F172A;
        font-family: ${interStack};
        border: 1px solid #E2E8F0;
      }
      .hs-iconrow { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
      .hs-icon { width: 10px; height: 10px; border-radius: 9999px; background: #2563EB; }
      .hs-layout { padding: 2rem; }
      .hs-parallel { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; }
      .hs-trend { border-top: 1px solid #E2E8F0; padding-top: 1rem; }
      .hs-contrast { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      .hs-nested { outline: 1px solid #E2E8F0; border-radius: 6px; padding: 1rem; }
      h1 { font-size: 1.5rem; font-weight: 700; }
      li { font-size: 0.95rem; }
    `,
    previewClass: "bg-white text-slate-900 font-sans border border-slate-200",
  },
  authority_gold: {
    id: "authority_gold",
    name: "Authority Gold",
    layoutProfile: {
      messageLine: "hero",
      gridDensity: "airy",
      iconForward: false,
      jumpRate: "extreme",
    },
    fonts: {
      heading: displayStack,
      body: serifStack,
      importUrl:
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Noto+Serif+JP:wght@400;700&display=swap",
    },
    colors: {
      bg: "#050505",
      fg: "#F5F0E6",
      muted: "#A8A29E",
      accent: "#E8D5B7",
      line: "rgba(232,213,183,0.2)",
    },
    sectionCss: `
      section {
        background: #050505;
        color: #F5F0E6;
        font-family: ${serifStack};
        justify-content: center;
      }
      .hs-layout { text-align: center; max-width: 90%; margin: 0 auto; }
      h1 {
        font-family: ${displayStack};
        font-size: 2.8rem;
        line-height: 1.1;
        color: #E8D5B7;
        letter-spacing: -0.02em;
      }
      li { font-size: 1.15rem; text-align: left; opacity: 0.92; }
      .hs-parallel { display: flex; flex-direction: column; gap: 2rem; align-items: center; }
      .hs-trend, .hs-contrast, .hs-nested { display: flex; flex-direction: column; gap: 1.25rem; }
    `,
    previewClass: "bg-black text-[#F5F0E6] text-center",
  },
  editorial_magazine: {
    id: "editorial_magazine",
    name: "Editorial Magazine",
    layoutProfile: {
      messageLine: "asymmetric",
      gridDensity: "editorial",
      iconForward: false,
      jumpRate: "editorial",
    },
    fonts: {
      heading: displayStack,
      body: serifStack,
      importUrl:
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Noto+Serif+JP:wght@400;600&display=swap",
    },
    colors: {
      bg: "#FAF8F5",
      fg: "#1C1917",
      muted: "#78716C",
      accent: "#B45309",
      line: "#D6D3D1",
    },
    sectionCss: `
      section {
        background: #FAF8F5;
        color: #1C1917;
        font-family: ${serifStack};
      }
      .hs-layout {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 3rem;
        align-items: start;
        padding: 3rem 4rem;
      }
      h1 {
        font-family: ${displayStack};
        font-size: 2.2rem;
        grid-column: 1 / -1;
        margin-bottom: 0.5rem;
      }
      .hs-parallel { grid-column: 1 / -1; columns: 2; column-gap: 2.5rem; }
      .hs-trend { border-top: 4px solid #B45309; padding-top: 1.5rem; }
      .hs-contrast { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
      .hs-nested { background: #fff; padding: 1.5rem; box-shadow: 8px 8px 0 #E7E5E4; }
      li { break-inside: avoid; margin-bottom: 0.5rem; }
    `,
    previewClass: "bg-[#FAF8F5] text-stone-900",
  },
};

export const DNA_IDS = Object.keys(DESIGN_DNAS) as DesignDnaId[];

export function getDna(id: DesignDnaId): DesignDNA {
  return DESIGN_DNAS[id];
}
