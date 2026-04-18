import React from "react";
import { View } from "react-native";
import { CONV } from "../constants/theme";

function Row({ wide }: { wide?: boolean }) {
  return (
    <View
      className="mb-2 h-4 rounded-md bg-slate-200"
      style={{ width: wide ? "92%" : "55%" }}
    />
  );
}

export function ConversationListSkeleton() {
  return (
    <View className="px-4 pt-2" style={{ backgroundColor: CONV.BG }}>
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <View
          key={k}
          className="mb-3 rounded-2xl border border-slate-100 p-4"
          style={{ backgroundColor: CONV.CARD }}
        >
          <View className="mb-2 flex-row justify-between">
            <View
              className="h-5 rounded-md bg-slate-200"
              style={{ width: "68%" }}
            />
            <View className="h-4 w-12 rounded bg-slate-200" />
          </View>
          <Row />
          <Row wide />
        </View>
      ))}
    </View>
  );
}
