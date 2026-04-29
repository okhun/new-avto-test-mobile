import { ProfileEditSkeleton } from "@/src/features/auth/components/ProfileEditSkeleton";
import {
  useDeleteMyAccount,
  useGetMe,
  useUpdateProfile,
  useUploadAvatar,
} from "@/src/features/auth/hook/useAuth";
import { resolveAvatarUrl } from "@/src/features/auth/utils/avatarUrl";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#137fec";
const TEXT = "#0f172a";
const MUTED = "#64748b";
const MAX_FILE_BYTES = 2 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

function extFromMime(mime: string): string {
  const m = mime.toLowerCase();
  if (m.includes("png")) return "png";
  if (m.includes("webp")) return "webp";
  if (m.includes("heic") || m.includes("heif")) return "heic";
  return "jpg";
}

function mimeFromUri(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".heic") || lower.endsWith(".heif")) return "image/heic";
  return "image/jpeg";
}

function apiErrorMessage(e: unknown, fallback: string): string {
  if (axios.isAxiosError(e)) {
    const m = e.response?.data?.message;
    if (Array.isArray(m)) return String(m[0] ?? fallback);
    if (typeof m === "string") return m;
  }
  if (e instanceof Error) return e.message;
  return fallback;
}

export default function ProfileEditScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: me, isPending: loadingMe, isError } = useGetMe();
  const { mutateAsync: saveProfile, isPending: saving } = useUpdateProfile();
  const { mutateAsync: uploadAvatar, isPending: uploading } = useUploadAvatar();
  const { mutateAsync: deleteAccount, isPending: deleting } =
    useDeleteMyAccount();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!me) return;
    setDisplayName(me.displayName ?? "");
    setEmail(me.email ?? "");
    setAvatarUrl(me.avatarUrl ?? null);
    setLocalPreview(null);
  }, [me]);

  const hasChanges = useMemo(() => {
    if (!me) return false;
    const nameChanged = displayName.trim() !== (me.displayName ?? "").trim();
    const avatarChanged = (avatarUrl ?? "") !== (me.avatarUrl ?? "");
    return nameChanged || avatarChanged;
  }, [me, displayName, avatarUrl]);

  const displayUri = localPreview ?? resolveAvatarUrl(avatarUrl);

  const pickAvatar = useCallback(async () => {
    if (uploading || me?.isGuest) return;

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        t("permission_required"),
        t("permission_required_description")
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    const mime = (asset.mimeType ?? mimeFromUri(asset.uri)).toLowerCase();

    if (!mime.startsWith("image/")) {
      Alert.alert(t("invalid_file"), t("only_images_allowed"));
      return;
    }

    if (!ALLOWED_MIME.has(mime)) {
      Alert.alert(t("format_not_supported"), t("supported_formats"));
      return;
    }

    if (typeof asset.fileSize === "number" && asset.fileSize > MAX_FILE_BYTES) {
      Alert.alert(t("file_too_large"), t("image_size_limit"));
      return;
    }

    setLocalPreview(asset.uri);

    try {
      const { avatarUrl: next } = await uploadAvatar({
        uri: asset.uri,
        name: `avatar.${extFromMime(mime)}`,
        type: mime,
      });
      setAvatarUrl(next);
      setLocalPreview(null);
    } catch (e: unknown) {
      setLocalPreview(null);
      Alert.alert(t("error"), apiErrorMessage(e, t("upload_error")));
    }
  }, [uploading, me?.isGuest, uploadAvatar]);

  const onSave = useCallback(async () => {
    if (!me || !hasChanges || saving) return;
    try {
      await saveProfile({
        displayName: displayName.trim(),
        avatarUrl: avatarUrl ?? null,
      });
      Alert.alert(t("saved"), t("profile_information_updated"));
      router.back();
    } catch (e: unknown) {
      Alert.alert(t("error"), apiErrorMessage(e, t("save_error")));
    }
  }, [me, hasChanges, saving, saveProfile, displayName, avatarUrl, router]);

  const onConfirmDelete = useCallback(async () => {
    setDeleteOpen(false);
    try {
      await deleteAccount();
      router.replace("/auth");
    } catch (e: unknown) {
      Alert.alert(t("error"), apiErrorMessage(e, t("delete_account_error")));
    }
  }, [deleteAccount, router]);

  if (loadingMe && !me) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="flex-row items-center border-b border-slate-100 px-2 py-2">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full"
            hitSlop={8}
          >
            <MaterialIcons name="arrow-back" size={24} color={TEXT} />
          </Pressable>
          <Text
            className="flex-1 text-center text-base font-bold"
            style={{ color: TEXT }}
          >
            {t("profile")}
          </Text>
          <View className="w-10" />
        </View>
        <ProfileEditSkeleton />
      </SafeAreaView>
    );
  }

  if (isError || !me) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-white px-6"
        edges={["top"]}
      >
        <Text className="text-center text-slate-500">
          {t("profile_not_loaded")}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 rounded-xl px-6 py-3"
          style={{ backgroundColor: PRIMARY }}
        >
          <Text className="font-semibold text-white">{t("back")}</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-row items-center border-b border-slate-100 px-2 py-2">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-50"
            hitSlop={8}
          >
            <MaterialIcons name="arrow-back" size={24} color={TEXT} />
          </Pressable>
          <Text
            className="flex-1 text-center text-base font-bold"
            style={{ color: TEXT }}
          >
            {t("profile")}
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center px-6 pb-10 pt-8">
            <Pressable
              onPress={pickAvatar}
              disabled={uploading || me.isGuest}
              className="relative"
            >
              <View className="h-28 w-28 overflow-hidden rounded-full border-4 border-slate-100 bg-slate-100 shadow-lg">
                {displayUri ? (
                  <Image
                    source={{ uri: displayUri }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-full w-full items-center justify-center">
                    <MaterialIcons name="person" size={64} color={PRIMARY} />
                  </View>
                )}
                {uploading ? (
                  <View className="absolute inset-0 items-center justify-center bg-black/50">
                    <ActivityIndicator color="#fff" />
                    <Text className="mt-1 text-[10px] font-bold text-white">
                      {t("loading")}
                    </Text>
                  </View>
                ) : null}
              </View>
              {!uploading && !me.isGuest ? (
                <View
                  className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full border-2 border-white"
                  style={{ backgroundColor: PRIMARY }}
                >
                  <MaterialIcons name="add-a-photo" size={18} color="#fff" />
                </View>
              ) : null}
            </Pressable>
            {me.isGuest ? (
              <Text className="mt-2 text-center text-xs text-amber-700">
                {t("guest_mode_avatar_edit_not_allowed")}
              </Text>
            ) : (
              <Text
                className="mt-2 text-center text-xs"
                style={{ color: MUTED }}
              >
                {t("tap_to_add_photo")}
              </Text>
            )}
            <Text
              className="mt-4 text-center text-2xl font-bold"
              style={{ color: TEXT }}
            >
              {displayName.trim() || me.displayName}
            </Text>
          </View>

          <View className="px-6">
            <View className="mb-2 flex-row items-center gap-2">
              <MaterialIcons name="person-outline" size={22} color={PRIMARY} />
              <Text className="text-base font-bold" style={{ color: TEXT }}>
                {t("profile_information")}
              </Text>
            </View>

            <Text
              className="mb-1.5 text-sm font-medium"
              style={{ color: MUTED }}
            >
              {t("full_name")}
            </Text>
            <TextInput
              className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[15px]"
              style={{ color: TEXT }}
              value={displayName}
              onChangeText={setDisplayName}
              editable={!saving && !me.isGuest}
              placeholder={t("your_name")}
              placeholderTextColor="#94a3b8"
            />

            <Text
              className="mb-1.5 text-sm font-medium"
              style={{ color: MUTED }}
            >
              {t("email")}
            </Text>
            <TextInput
              className="mb-8 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3.5 text-[15px]"
              style={{ color: MUTED }}
              value={email}
              editable={false}
              selectTextOnFocus={false}
            />

            <View className="mb-2 flex-row items-center gap-2">
              <MaterialIcons name="settings" size={22} color={PRIMARY} />
              <Text className="text-base font-bold" style={{ color: TEXT }}>
                {t("account_settings")}
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/settings")}
              className="mb-8 flex-row items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5"
            >
              <Text className="text-[15px] font-medium" style={{ color: TEXT }}>
                {t("app_settings")}
              </Text>
              <MaterialIcons name="chevron-right" size={22} color={MUTED} />
            </Pressable>

            <Pressable
              onPress={onSave}
              disabled={!hasChanges || saving || me.isGuest}
              className="mb-4 items-center rounded-full py-3.5 shadow-md"
              style={{
                backgroundColor:
                  hasChanges && !saving && !me.isGuest ? PRIMARY : "#cbd5e1",
                shadowColor: PRIMARY,
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-sm font-bold text-white">
                  {t("save_changes")}
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => setDeleteOpen(true)}
              className="items-center py-2"
            >
              <Text className="text-xs font-semibold text-slate-400 underline">
                {t("delete_account")}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={deleteOpen} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6">
            <Text className="text-base leading-relaxed" style={{ color: TEXT }}>
              {t("delete_account_confirmation")}
            </Text>
            <View className="mt-6 flex-row justify-end gap-3">
              <Pressable
                onPress={() => setDeleteOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5"
                disabled={deleting}
              >
                <Text className="font-semibold text-slate-700">
                  {t("cancel")}
                </Text>
              </Pressable>
              <Pressable
                onPress={onConfirmDelete}
                disabled={deleting}
                className="rounded-xl px-4 py-2.5"
                style={{ backgroundColor: "#ef4444" }}
              >
                {deleting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="font-bold text-white">{t("delete")}</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
