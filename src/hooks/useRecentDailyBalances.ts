// src/hooks/useRecentDailyBalances.ts
import { useQuery } from "@tanstack/react-query";
import { GetRecentDailyBalanceService } from "../services/GetRecentDailyBalanceService";
import type {
    DailyBalanceItem,
    GetRecentDailyBalancesApiError,
} from "../interfaces/GetRecentDailyBalanceService.interface";

const FIVE_MINUTES_MS = 1000 * 60 * 5;

/**
 * Shared prefix of the recent daily balances query key.
 *
 * It is exported so mutations can invalidate every cached window at once
 * (e.g. `limit=14` for the chart and `limit=100` for the details view) through
 * TanStack Query's default prefix matching, regardless of the requested range.
 */
export const recentDailyBalancesQueryKey = (): readonly [string, string] => [
    "daily-balances",
    "recent",
];

export const useRecentDailyBalances = (limit: number = 14) => {
    return useQuery<DailyBalanceItem[], GetRecentDailyBalancesApiError>({
        queryKey: ["daily-balances", "recent", limit],
        queryFn: () => GetRecentDailyBalanceService.getRecentDailyBalances(limit),
        staleTime: FIVE_MINUTES_MS,
        retry: 1,
    });
};

export default useRecentDailyBalances;
