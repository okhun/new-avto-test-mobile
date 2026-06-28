import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { refreshUserProfileIfOnline } from "@/src/services/auth/bootstrapAuth";
import { runBackgroundSync } from "@/src/services/sync/sync-manager";
import { useNetwork } from "@/src/providers/NetworkProvider";
import { useToast } from "@/src/providers/ToastProvider";

export function NetworkSyncBridge() {
  const { isOffline, isConnected } = useNetwork();
  const toast = useToast();
  const { t } = useTranslation();
  const wasOfflineRef = useRef(isOffline);

  useEffect(() => {
    const wasOffline = wasOfflineRef.current;
    wasOfflineRef.current = isOffline;

    if (!wasOffline || isOffline || !isConnected) return;

    void (async () => {
      toast.success(t("network.back_online"));
      await refreshUserProfileIfOnline();
      const before = await import("@/src/services/sync/sync-queue.service").then(
        (m) => m.getPendingCount()
      );
      await runBackgroundSync();
      const after = await import("@/src/services/sync/sync-queue.service").then(
        (m) => m.getPendingCount()
      );
      if (before > 0 && after < before) {
        toast.success(t("network.sync_completed"));
      } else if (before > 0 && after === before) {
        toast.error(t("network.sync_failed"));
      }
    })();
  }, [isOffline, isConnected, toast, t]);

  return null;
}
