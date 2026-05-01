import React from "react";
import { View } from "react-native";

import { useTheme } from "@/src/theme";

export function ProfileEditSkeleton() {
  const { palette } = useTheme();

  const Sk = ({ className }: { className?: string }) => (
    <View className={className} style={{ backgroundColor: palette.divider }} />
  );

  return (
    <View className="px-6 pt-8" style={{ backgroundColor: palette.background }}>
      <View className="mb-8 items-center">
        <Sk className="mb-4 h-28 w-28 rounded-full" />
        <Sk className="h-8 w-48 rounded-lg" />
      </View>
      <Sk className="mb-3 h-4 w-40 rounded" />
      <Sk className="mb-6 h-12 w-full rounded-xl" />
      <Sk className="mb-3 h-4 w-32 rounded" />
      <Sk className="mb-10 h-12 w-full rounded-xl" />
      <Sk className="h-14 w-full rounded-full" />
    </View>
  );
}
