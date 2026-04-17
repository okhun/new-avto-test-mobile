import { useQuery } from "@tanstack/react-query";
import { getTicketsHistory } from "../api/practice.api";
import type { TicketHistory } from "../types/practice.types";

export const useGetTicketsHistory = () => {
  return useQuery({
    queryKey: ["practice", "tickets-history"],
    queryFn: () => getTicketsHistory(),
    select: (data): TicketHistory[] =>
      Array.isArray(data) ? data : ((data as any)?.data ?? []),
  });
};
