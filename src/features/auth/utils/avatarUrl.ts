import { API_CONFIG } from "@/src/utils/constants";

/** Builds a display URL for user avatar (absolute or API-relative). */
export function resolveAvatarUrl(
  url: string | null | undefined
): string | undefined {
  if (!url || !url.trim()) return undefined;
  const u = url.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = API_CONFIG.API_URL.replace(/\/$/, "");
  return u.startsWith("/") ? `${base}${u}` : `${base}/${u}`;
}
