import { useQuery } from "@tanstack/react-query";
import { getTicketsHistory } from "../api/practice.api";

export const useGetTicketsHistory = () => {
  return useQuery({
    queryKey: ["practice", "tickets-history"],
    queryFn: () => getTicketsHistory(),
  });
};
