import MaterialCommunityIcons, {
  type MaterialCommunityIconsProps,
} from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { useUserBadges } from "../hook/useBadge";
import { fallbackIconNameForType, resolveBadgeIconUrl } from "../utils/badgeUi";

const PRIMARY = "#137fec";

export function ProfileBadgesPreview() {
  const router = useRouter();
  const { data: badges, isPending } = useUserBadges();

  const { earned, total, preview } = useMemo(() => {
    const list = badges?.filter((b) => b.isActive) ?? [];
    const e = list.filter((b) => b.isEarned).length;
    const previewList = list.filter((b) => b.isEarned).slice(0, 4);
    return { earned: e, total: list.length, preview: previewList };
  }, [badges]);

  if (isPending) {
    return (
      <View className="mb-4 h-20 items-center justify-center rounded-2xl bg-slate-50">
        <ActivityIndicator color={PRIMARY} size="small" />
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => router.push("/badges")}
      className="mb-2 rounded-2xl border border-slate-100 bg-slate-50/90 p-4 active:opacity-90"
    >
      <View className="flex-row items-center justify-between">
        <View className="min-w-0 flex-1 pr-2">
          <View className="flex-row items-center gap-1.5">
            <MaterialIcons name="military-tech" size={20} color={PRIMARY} />
            <Text className="text-base font-extrabold text-slate-800">
              Nishonlar
            </Text>
          </View>
          <Text className="mt-0.5 text-xs font-medium text-slate-500">
            {earned} / {total} ochilgan
          </Text>
        </View>

        <View className="flex-row items-center gap-1.5 pr-1">
          {preview.length === 0
            ? [0, 1, 2, 3].map((k) => (
                <View
                  key={k}
                  className="h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white"
                >
                  <MaterialIcons
                    name="military-tech"
                    size={16}
                    color="#cbd5e1"
                  />
                </View>
              ))
            : preview.map((b) => {
                const uri = resolveBadgeIconUrl(b.iconUrl);
                const fall = fallbackIconNameForType(
                  b.type
                ) as MaterialCommunityIconsProps["name"];
                return (
                  <View
                    key={b.id}
                    className="h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white bg-white"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.06,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    {uri ? (
                      <Image
                        source={{ uri }}
                        className="h-7 w-7"
                        resizeMode="contain"
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name={fall}
                        size={20}
                        color={PRIMARY}
                      />
                    )}
                  </View>
                );
              })}
          <MaterialIcons name="chevron-right" size={22} color="#cbd5e1" />
        </View>
      </View>
    </Pressable>
  );
}
