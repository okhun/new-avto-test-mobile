import { api } from "@/services/api";
import type { KnowledgeDetail } from "../types/knowledge-base.types";

export async function fetchKnowledgeBulk(
  items: string,
  lang?: string,
): Promise<KnowledgeDetail[]> {
  if (!items) return [];

  const { data } = await api.get<{ data: KnowledgeDetail[] }>(
    "/knowledge-base/bulk",
    { params: { items, lang } },
  );

  return Array.isArray(data?.data) ? data.data : [];
}
