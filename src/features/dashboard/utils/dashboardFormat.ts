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

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "short",
  });
}

export function xpBarWidth(xpProgress: number): string {
  if (!Number.isFinite(xpProgress) || xpProgress < 0) return "0%";
  if (xpProgress <= 1) {
    return `${Math.min(100, Math.round(xpProgress * 1000) / 10)}%`;
  }
  return `${Math.min(100, xpProgress)}%`;
}
