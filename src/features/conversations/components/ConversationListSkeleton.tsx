import { useTheme } from "@/src/theme";
import React from "react";
import { View } from "react-native";

export function ConversationListSkeleton() {
  const { palette } = useTheme();

  function Row({ wide }: { wide?: boolean }) {
    return (
      <View
        className="mb-2 h-4 rounded-md"
        style={{
          width: wide ? "92%" : "55%",
          backgroundColor: palette.divider,
        }}
      />
    );
  }

  return (
    <View className="px-4 pt-2" style={{ backgroundColor: palette.background }}>
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <View
          key={k}
          className="mb-3 rounded-2xl border p-4"
          style={{
            backgroundColor: palette.card,
            borderColor: palette.border,
          }}
        >
          <View className="mb-2 flex-row justify-between">
            <View
              className="h-5 rounded-md"
              style={{ width: "68%", backgroundColor: palette.divider }}
            />
            <View
              className="h-4 w-12 rounded"
              style={{ backgroundColor: palette.divider }}
            />
          </View>
          <Row />
          <Row wide />
        </View>
      ))}
    </View>
  );
}
