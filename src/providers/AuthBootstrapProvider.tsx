import { api } from "@/services/api";
import React, { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";

export function AuthBootstrapProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasInitialized = React.useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    (async () => {
      const store = useAuthStore.getState();

      const hasStored = await store.loadStoredAuth();

      if (hasStored) {
        try {
          const { data } = await api.get("/auth/me");

          store.setUser(data);
        } catch {
          store.logout();
        }
      } else {
        store.setLoading(false);
      }
    })();
  }, []);

  return children;
}
