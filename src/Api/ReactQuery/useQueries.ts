import { useQuery } from "@tanstack/react-query";
import type { AppQueryOptions, CombinedErrorResponse } from "../../Types";

export function useQueries<T, P = void>(queryKey: any[], callback: (param?: P) => Promise<T>, options?: AppQueryOptions<T>) {
  return useQuery<T, CombinedErrorResponse, T, any[]>({
    queryKey,
    queryFn: async () => await callback(),
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
    retry: 0,
    staleTime: 1000 * 60,
    ...options,
  });
}

