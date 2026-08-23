import { KnowledgeReferenceChip } from "@/src/components/knowledge-reference/KnowledgeReferenceChip";
import { KnowledgeReferenceSheet } from "@/src/components/knowledge-reference/KnowledgeReferenceSheet";
import { useKnowledgeBulk } from "@/src/features/knowledge-base/hook/useKnowledgeBulk";
import type {
  KnowledgeDetail,
  KnowledgeRefKey,
} from "@/src/features/knowledge-base/types/knowledge-base.types";
import { knowledgeRefKey } from "@/src/features/knowledge-base/utils/parseKnowledgeRefs";
import React, { useCallback, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";
import RenderHTML, {
  type CustomMixedRenderer,
  type TNode,
} from "react-native-render-html";

function tnodeText(node: TNode): string {
  if ("data" in node && typeof (node as { data?: string }).data === "string") {
    return (node as { data: string }).data;
  }
  return (node.children ?? []).map((child) => tnodeText(child)).join("");
}

type Props = {
  html: string;
  color: string;
  tagsStyles: Record<string, object>;
};

export function ExplanationHtml({ html, color, tagsStyles }: Props) {
  const { width } = useWindowDimensions();
  const { getDetail } = useKnowledgeBulk(html);
  const [selected, setSelected] = useState<KnowledgeDetail | null>(null);

  const onOpenRef = useCallback(
    (ref: KnowledgeRefKey) => {
      setSelected(getDetail(ref));
    },
    [getDetail],
  );

  const renderers = useMemo(() => {
    const span: CustomMixedRenderer = ({
      tnode,
      TDefaultRenderer,
      ...props
    }) => {
      if (!tnode.classes.includes("kb-reference")) {
        return <TDefaultRenderer tnode={tnode} {...props} />;
      }

      const type = String(tnode.attributes["data-type"] ?? "");
      const id = String(tnode.attributes["data-id"] ?? "");
      if (!type || !id) {
        return <TDefaultRenderer tnode={tnode} {...props} />;
      }

      const ref: KnowledgeRefKey = {
        type,
        id,
        code:
          String(tnode.attributes["data-code"] ?? "").trim() ||
          tnodeText(tnode).trim() ||
          id,
      };
      const detail = getDetail(ref);

      return (
        <KnowledgeReferenceChip
          key={knowledgeRefKey(ref)}
          refKey={ref}
          code={detail.code || ref.code}
          missing={!detail.title}
          onPress={onOpenRef}
        />
      );
    };

    return { span };
  }, [getDetail, onOpenRef]);

  return (
    <>
      <RenderHTML
        contentWidth={Math.max(0, width - 64)}
        source={{ html }}
        ignoredStyles={["color", "backgroundColor"]}
        baseStyle={{
          color,
          fontSize: 14,
          lineHeight: 21,
        }}
        tagsStyles={tagsStyles}
        renderers={renderers}
      />
      <KnowledgeReferenceSheet
        visible={!!selected}
        detail={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
