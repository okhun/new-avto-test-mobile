import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type NetworkContextValue = {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  isOffline: boolean;
  lastConnectionTime: number | null;
  refresh: () => Promise<void>;
};

const NetworkContext = createContext<NetworkContextValue | null>(null);

function deriveOffline(state: NetInfoState): boolean {
  if (state.isConnected === false) return true;
  if (state.isInternetReachable === false) return true;
  return false;
}

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(
    true
  );
  const [lastConnectionTime, setLastConnectionTime] = useState<number | null>(
    Date.now()
  );
  const wasOfflineRef = useRef(false);

  const applyState = useCallback((state: NetInfoState) => {
    const offline = deriveOffline(state);
    setIsConnected(state.isConnected ?? false);
    setIsInternetReachable(state.isInternetReachable ?? null);

    if (!offline) {
      setLastConnectionTime(Date.now());
    }

    wasOfflineRef.current = offline;
  }, []);

  useEffect(() => {
    let mounted = true;

    void NetInfo.fetch().then((state) => {
      if (mounted) applyState(state);
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      applyState(state);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [applyState]);

  const refresh = useCallback(async () => {
    const state = await NetInfo.fetch();
    applyState(state);
  }, [applyState]);

  const isOffline = useMemo(() => {
    if (isConnected === false) return true;
    if (isInternetReachable === false) return true;
    return false;
  }, [isConnected, isInternetReachable]);

  const value = useMemo<NetworkContextValue>(
    () => ({
      isConnected,
      isInternetReachable,
      isOffline,
      lastConnectionTime,
      refresh,
    }),
    [isConnected, isInternetReachable, isOffline, lastConnectionTime, refresh]
  );

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextValue {
  const ctx = useContext(NetworkContext);
  if (!ctx) {
    throw new Error("useNetwork must be used within NetworkProvider");
  }
  return ctx;
}

export function useNetworkOptional(): NetworkContextValue | null {
  return useContext(NetworkContext);
}
