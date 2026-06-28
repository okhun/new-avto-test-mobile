import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNetwork } from "@/src/providers/NetworkProvider";
import { useToast } from "@/src/providers/ToastProvider";

export function useOfflineRefresh(onRefresh: () => void) {
  const { isOffline } = useNetwork();
  const toast = useToast();
  const { t } = useTranslation();

  return useCallback(() => {
    if (isOffline) {
      toast.info(t("network.offline_refresh_blocked"));
      return;
    }
    onRefresh();
  }, [isOffline, onRefresh, toast, t]);
}

export function useIsOffline(): boolean {
  return useNetwork().isOffline;
}
