import type { KnowledgeRefKey } from "@/src/features/knowledge-base/types/knowledge-base.types";
import { useTheme } from "@/src/theme";
import React from "react";
import { Text } from "react-native";

type Props = {
  code: string;
  missing?: boolean;
  onPress: (ref: KnowledgeRefKey) => void;
  refKey: KnowledgeRefKey;
};

export function KnowledgeReferenceChip({
  code,
  missing,
  onPress,
  refKey,
}: Props) {
  const { palette } = useTheme();
  const label = code.trim() || refKey.id;

  return (
    <Text
      onPress={() => onPress(refKey)}
      suppressHighlighting
      style={{
        fontFamily: "Menlo",
        fontSize: 12,
        fontWeight: "700",
        color: missing ? palette.muted : palette.primary,
        backgroundColor: missing
          ? `${palette.muted}22`
          : `${palette.primary}18`,
        overflow: "hidden",
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 1,
      }}
    >
      {label}
    </Text>
  );
}
