import { getAcceptLanguage } from "@/src/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { fetchKnowledgeBulk } from "../api/knowledge-base.api";
import type {
  KnowledgeDetail,
  KnowledgeRefKey,
} from "../types/knowledge-base.types";
import {
  buildBulkItemsParam,
  extractKnowledgeRefsFromHtml,
  knowledgeRefKey,
} from "../utils/parseKnowledgeRefs";

function fallbackDetail(ref: KnowledgeRefKey): KnowledgeDetail {
  return {
    id: ref.id,
    type: ref.type,
    code: ref.code || ref.id,
    title: ref.code || "",
    description: null,
    imageUrl: null,
    status: "active",
    category: null,
    relatedQuestionCount: 0,
  };
}

export function useKnowledgeBulk(html: string) {
  const { i18n } = useTranslation();
  const lang = getAcceptLanguage();
  const refs = useMemo(() => extractKnowledgeRefsFromHtml(html), [html]);
  const items = useMemo(() => buildBulkItemsParam(refs), [refs]);

  const query = useQuery({
    queryKey: ["knowledge-bulk", items, lang, i18n.resolvedLanguage],
    queryFn: () => fetchKnowledgeBulk(items, lang),
    enabled: items.length > 0,
    staleTime: 5 * 60_000,
  });

  const detailsByKey = useMemo(() => {
    const map = new Map<string, KnowledgeDetail>();
    for (const detail of query.data ?? []) {
      map.set(knowledgeRefKey(detail), detail);
    }
    return map;
  }, [query.data]);

  const getDetail = useCallback(
    (ref: KnowledgeRefKey): KnowledgeDetail => {
      return detailsByKey.get(knowledgeRefKey(ref)) ?? fallbackDetail(ref);
    },
    [detailsByKey],
  );

  return {
    refs,
    hasRefs: refs.length > 0,
    isLoading: query.isLoading,
    getDetail,
  };
}
