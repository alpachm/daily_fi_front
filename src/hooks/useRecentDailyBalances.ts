// src/hooks/useRecentDailyBalances.ts
import { useQuery } from "@tanstack/react-query";
import { GetRecentDailyBalanceService } from "../services/GetRecentDailyBalanceService";
import type {
    DailyBalanceItem,
    GetRecentDailyBalancesApiError,
} from "../interfaces/GetRecentDailyBalanceService.interface";

const FIVE_MINUTES_MS = 1000 * 60 * 5;

/**
 * Canonical query key for the list of recent daily balances.
 *
 * It is exported so future mutations can invalidate or update the exact same
 * cache entry this read query subscribes to.
 */
export const recentDailyBalancesQueryKey = (): readonly [string, string] => [
    "daily-balances",
    "recent",
];

export const useRecentDailyBalances = () => {
    return useQuery<DailyBalanceItem[], GetRecentDailyBalancesApiError>({
        queryKey: recentDailyBalancesQueryKey(),
        queryFn: () => GetRecentDailyBalanceService.getRecentDailyBalances(),
        staleTime: FIVE_MINUTES_MS,
        retry: 1,
    });
};

export default useRecentDailyBalances;
