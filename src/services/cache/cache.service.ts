import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_PREFIX = "autotest_cache:";

type CacheEntry<T> = {
  data: T;
  cachedAt: number;
  expiresAt: number | null;
};

export async function setCache<T>(
  key: string,
  data: T,
  ttlMs?: number
): Promise<void> {
  const entry: CacheEntry<T> = {
    data,
    cachedAt: Date.now(),
    expiresAt: ttlMs ? Date.now() + ttlMs : null,
  };
  await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;

    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

export async function removeCache(key: string): Promise<void> {
  await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
}

export async function clearAllCache(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
  if (cacheKeys.length) {
    await AsyncStorage.multiRemove(cacheKeys);
  }
}

export const CACHE_KEYS = {
  gamificationSummary: "gamification_summary",
  examHistory: "exam_history",
  ticketsHistory: "tickets_history",
  userBadges: "user_badges",
} as const;

export const CACHE_TTL = {
  short: 1000 * 60 * 5,
  medium: 1000 * 60 * 30,
  long: 1000 * 60 * 60 * 24,
} as const;
