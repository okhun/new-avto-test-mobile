import i18n from "@/src/i18n";

/** Parse API percentage string; handles "62.5" or "0.65" (fraction). */
export function formatPercentString(
  value: string | undefined,
  fallback = "0"
): string {
  if (value == null || value === "") return `${fallback}%`;
  const n = parseFloat(String(value).replace(",", "."));
  if (Number.isNaN(n)) return `${fallback}%`;
  if (n >= 0 && n <= 1) {
    return `${Math.round(n * 1000) / 10}%`;
  }
  return `${Math.round(n * 10) / 10}%`;
}

export function formatPassRateString(value: string | undefined): string {
  return formatPercentString(value, "0");
}

function getDateLocale(): string {
  const lang = (i18n.resolvedLanguage ?? i18n.language ?? "uz").toLowerCase();
  if (lang === "ru" || lang.startsWith("ru-")) return "ru-RU";
  if (lang === "uz-cyrl" || lang.includes("cyrl")) return "uz-Cyrl-UZ";
  return "uz-UZ";
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(getDateLocale(), {
    day: "numeric",
    month: "short",
  });
}

/** Returns 0–100 (or >100 if API sends that) for charts/badges; `null` if missing/invalid. */
export function parsePercentToNumber(
  value: string | number | undefined | null
): number | null {
  if (value == null || value === "") return null;
  const n = parseFloat(String(value).replace(",", "."));
  if (Number.isNaN(n)) return null;
  if (n >= 0 && n <= 1) {
    return Math.round(n * 1000) / 10;
  }
  return Math.round(n * 10) / 10;
}

export function xpBarWidth(xpProgress: number): string {
  if (!Number.isFinite(xpProgress) || xpProgress < 0) return "0%";
  if (xpProgress <= 1) {
    return `${Math.min(100, Math.round(xpProgress * 1000) / 10)}%`;
  }
  return `${Math.min(100, xpProgress)}%`;
}
