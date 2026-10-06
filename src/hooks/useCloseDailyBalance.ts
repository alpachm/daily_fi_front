// src/hooks/useCloseDailyBalance.ts
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CloseDailyBalanceService } from "../services/CloseDailyBalanceService";
import type {
    CloseDailyBalanceApiError,
    CloseDailyBalanceSuccessResponse,
} from "../interfaces/CloseDailyBalanceService.interface";
import type { DailyBalanceData } from "../interfaces/DailyBalance.interface";
import { getTodayIsoDate } from "../utils/date";
import { dailyBalanceQueryKey } from "./useGetBalancePerDay";
import { recentDailyBalancesQueryKey } from "./useRecentDailyBalances";

interface CloseDailyBalanceVariables {
    id: number;
    closingBalance: number;
}

/**
 * Wraps `CloseDailyBalanceService.closeDailyBalance` in a TanStack Query
 * mutation and keeps the `daily-balance` cache entry in sync with the server
 * response so the closing balance, percentage change and net totals react
 * without a manual refresh.
 */
export const useCloseDailyBalance = () => {
    const queryClient = useQueryClient();
    const date = useMemo(() => getTodayIsoDate(), []);

    return useMutation<
        CloseDailyBalanceSuccessResponse,
        CloseDailyBalanceApiError,
        CloseDailyBalanceVariables
    >({
        mutationFn: ({ id, closingBalance }: CloseDailyBalanceVariables) =>
            CloseDailyBalanceService.closeDailyBalance(id, closingBalance),
        onSuccess: (response: CloseDailyBalanceSuccessResponse) => {
            queryClient.setQueryData<DailyBalanceData | null>(
                dailyBalanceQueryKey(date),
                response.data,
            );

            // The closing balance feeds the "Balance general" chart, which reads
            // from the recent list cache. Invalidating it triggers a background
            // refetch so the chart re-renders with the new closingBalance.
            queryClient.invalidateQueries({
                queryKey: recentDailyBalancesQueryKey(),
            });
        },
    });
};

export default useCloseDailyBalance;
