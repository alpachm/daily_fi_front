// src/hooks/useAllDailyBalances.ts
import { useQuery } from "@tanstack/react-query";
import { GetAllDailyBalancesService } from "../services/GetAllDailyBalancesService";
import type {
    DailyBalanceItem,
    DailyBalanceQueryParams,
    GetAllDailyBalancesApiError,
} from "../interfaces/GetAllDailyBalancesService.interface";

const FIVE_MINUTES_MS = 1000 * 60 * 5;

/**
 * Wraps `GetAllDailyBalancesService.getAllDailyBalances` in a TanStack Query
 * read query, keyed by the optional filter/pagination params.
 */
export const useAllDailyBalances = (params?: DailyBalanceQueryParams) => {
    return useQuery<DailyBalanceItem[], GetAllDailyBalancesApiError>({
        queryKey: ["daily-balances", params],
        queryFn: () => GetAllDailyBalancesService.getAllDailyBalances(params),
        staleTime: FIVE_MINUTES_MS,
        retry: 1,
    });
};

export default useAllDailyBalances;
