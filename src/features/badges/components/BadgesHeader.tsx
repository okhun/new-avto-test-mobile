import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/src/theme";

export function BadgesHeader() {
  const router = useRouter();
  const { t } = useTranslation();
  const { palette } = useTheme();

  return (
    <View className="flex-row items-center justify-center px-2 pb-2 pt-0">
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        className="absolute left-2 h-10 w-10 items-center justify-center"
        accessibilityLabel={t("back")}
      >
        <MaterialIcons
          name="chevron-left"
          size={28}
          color={palette.foreground}
        />
      </Pressable>
      <Text
        className="text-center text-lg font-extrabold"
        style={{ color: palette.foreground }}
      >
        {t("badges_page.title")}
      </Text>
      <View className="absolute right-2 h-10 w-10 items-center justify-center">
        <MaterialIcons
          name="workspace-premium"
          size={24}
          color={palette.primary}
        />
      </View>
    </View>
  );
}
