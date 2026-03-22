import { layoutClass } from "@lib/agents/visualizer";
import type { DesignDnaId, SlideDeckSlide } from "@lib/agents/types";
import { getDna } from "@styles/dna";

export function buildMarpMarkdown(
  slides: SlideDeckSlide[],
  dnaId: DesignDnaId,
): string {
  const dna = getDna(dnaId);
  const header = "---\nmarp: true\ntheme: default\npaginate: true\nstyle: |\n  section { box-sizing: border-box; }\n---\n";

  const parts = slides.map((sl) => {
    const lc = layoutClass(sl.layout);
    const titleEl = sl.elements.find((e) => e.kind === "title");
    const title = titleEl?.content ?? sl.keyMessage;
    const bullets = sl.elements
      .filter((e) => e.kind !== "title")
      .map((e) => `- ${e.content}`)
      .join("\n");

    const eyebrow =
      dna.layoutProfile.messageLine === "top-fixed"
        ? "## STRATEGIC DECK // HIGH STAKES\n\n"
        : "";

    const icons = dna.layoutProfile.iconForward ? "- ● ● ●\n\n" : "";

    return `---\n_class: ${lc}\n---\n\n${eyebrow}${icons}# ${title}\n\n${bullets}\n`;
  });

  return header + parts.join("\n");
}

export async function renderMarpToHtml(markdown: string): Promise<{
  html: string;
  css: string;
}> {
  const { Marpit } = await import("@marp-team/marpit");
  const marpit = new Marpit({ inlineSVG: true });
  const { html, css } = marpit.render(markdown);
  return { html, css };
}

export function wrapPreviewDocument(
  bodyHtml: string,
  marpCss: string,
  dnaId: DesignDnaId,
): string {
  const dna = getDna(dnaId);
  const fontLink = dna.fonts.importUrl
    ? `<link rel="stylesheet" href="${dna.fonts.importUrl}" />`
    : "";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>${fontLink}<style>${marpCss}\n${dna.sectionCss}</style></head><body>${bodyHtml}</body></html>`;
}
