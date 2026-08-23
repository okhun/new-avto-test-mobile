import type {
  KnowledgeRefKey,
  KnowledgeReferenceType,
} from "../types/knowledge-base.types";

const KB_SPAN_RE =
  /<span\b([^>]*\bkb-reference\b[^>]*)>([\s\S]*?)<\/span>/gi;

function readAttr(attrs: string, name: string): string {
  const match = attrs.match(
    new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"),
  );
  return (match?.[1] ?? "").trim();
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\uFEFF/g, "").trim();
}

export function extractKnowledgeRefsFromHtml(html: string): KnowledgeRefKey[] {
  if (!html?.trim()) return [];

  const refs: KnowledgeRefKey[] = [];
  const seen = new Set<string>();

  for (const match of html.matchAll(KB_SPAN_RE)) {
    const attrs = match[1] ?? "";
    const type = readAttr(attrs, "data-type") as KnowledgeReferenceType;
    const id = readAttr(attrs, "data-id");
    if (!type || !id) continue;

    const key = `${type}:${id}`;
    if (seen.has(key)) continue;
    seen.add(key);

    refs.push({
      type,
      id,
      code: readAttr(attrs, "data-code") || stripTags(match[2] ?? "") || id,
    });
  }

  return refs;
}

export function buildBulkItemsParam(refs: KnowledgeRefKey[]): string {
  return refs
    .filter((ref) => ref.type && ref.id)
    .map((ref) => `${ref.type}:${ref.id}`)
    .join(",");
}

export function knowledgeRefKey(ref: { type: string; id: string }): string {
  return `${ref.type}:${ref.id}`;
}

export function stripThemeInlineStyles(html: string): string {
  if (!html?.trim()) return html ?? "";
  return html.replace(
    /\s*(?:color|background(?:-color|-image)?)\s*:[^;"']*;?/gi,
    "",
  );
}
