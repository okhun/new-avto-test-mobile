export function formatConversationTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffM = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffM < 1) return "hozir";
  if (diffM < 60) return `${diffM} daq`;
  if (diffH < 24) return `${diffH} soat`;
  if (diffD < 7) return `${diffD} kun`;
  return d.toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "short",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function formatMessageTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
