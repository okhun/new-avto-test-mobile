import { QueryClient, onlineManager } from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
import {
  shouldRetryMutation,
  shouldRetryQuery,
} from "@/src/utils/network/retry";

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    const offline =
      state.isConnected === false || state.isInternetReachable === false;
    setOnline(!offline);
  });
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: shouldRetryQuery,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      networkMode: "offlineFirst",
    },
    mutations: {
      retry: shouldRetryMutation,
      networkMode: "offlineFirst",
    },
  },
});
