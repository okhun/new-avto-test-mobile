import { useQuery } from "@tanstack/react-query";
import { getUserBadges } from "../api/badge.api";

export const useUserBadges = () => {
  return useQuery({
    queryKey: ["userBadges"],
    queryFn: getUserBadges,
    retry: false,
    gcTime: 0,
    staleTime: 0,
  });
};
