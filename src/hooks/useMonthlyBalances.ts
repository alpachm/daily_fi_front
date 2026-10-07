// src/hooks/useMonthlyBalances.ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GetMonthlyBalancesService } from "../services/GetMonthlyBalancesService";
import type {
    GetMonthlyBalancesApiError,
    MonthlyBalanceItem,
    MonthlyBalanceQueryParams,
} from "../interfaces/GetMonthlyBalancesService.interface";

const FIVE_MINUTES_MS = 1000 * 60 * 5;

interface UseMonthlyBalancesOptions {
    enabled?: boolean;
}

/**
 * Wraps `GetMonthlyBalancesService.getMonthlyBalances` in a TanStack Query
 * read query, keyed by the optional filter/pagination params, and exposes a
 * minimal surface (`data`, `isLoading`, `isError`, `error`) for consumers.
 */
export const useMonthlyBalances = (
    params?: MonthlyBalanceQueryParams,
    options: UseMonthlyBalancesOptions = {},
) => {
    const { data, isLoading, isError, error } = useQuery<
        MonthlyBalanceItem[],
        GetMonthlyBalancesApiError
    >({
        queryKey: ["monthly-balances", params],
        queryFn: () => GetMonthlyBalancesService.getMonthlyBalances(params),
        enabled: options.enabled,
        placeholderData: keepPreviousData,
        staleTime: FIVE_MINUTES_MS,
        retry: 1,
    });

    return { data, isLoading, isError, error };
};

export default useMonthlyBalances;
