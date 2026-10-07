// src/hooks/useYearlyBalances.ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GetYearlyBalancesService } from "../services/GetYearlyBalancesService";
import type {
    GetYearlyBalancesApiError,
    YearlyBalanceItem,
    YearlyBalanceQueryParams,
} from "../interfaces/GetYearlyBalancesService.interface";

const FIVE_MINUTES_MS = 1000 * 60 * 5;

interface UseYearlyBalancesOptions {
    enabled?: boolean;
}

/**
 * Wraps `GetYearlyBalancesService.getYearlyBalances` in a TanStack Query
 * read query, keyed by the optional pagination params, and exposes a minimal
 * surface (`data`, `isLoading`, `isError`, `error`) for consumers.
 */
export const useYearlyBalances = (
    params?: YearlyBalanceQueryParams,
    options: UseYearlyBalancesOptions = {},
) => {
    const { data, isLoading, isError, error } = useQuery<
        YearlyBalanceItem[],
        GetYearlyBalancesApiError
    >({
        queryKey: ["yearly-balances", params],
        queryFn: () => GetYearlyBalancesService.getYearlyBalances(params),
        enabled: options.enabled,
        placeholderData: keepPreviousData,
        staleTime: FIVE_MINUTES_MS,
        retry: 1,
    });

    return { data, isLoading, isError, error };
};

export default useYearlyBalances;
