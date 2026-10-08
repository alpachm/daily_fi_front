// src/hooks/useCreateDailyBalance.ts
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateDailyBalanceService } from "../services/CreateDailyBalanceService";
import type {
    CreateDailyBalanceApiError,
    CreateDailyBalancePayload,
    CreateDailyBalanceSuccessResponse,
} from "../interfaces/CreateDailyBalanceService.interface";
import type { DailyBalanceData } from "../interfaces/DailyBalance.interface";
import { getTodayIsoDate } from "../utils/date";
import { dailyBalanceQueryKey } from "./useGetBalancePerDay";

/**
 * Wraps `CreateDailyBalanceService.createDailyBalance` in a TanStack Query
 * mutation and keeps the `daily-balance` cache entry in sync with the server
 * response so the UI reacts without a manual refresh.
 */
export const useCreateDailyBalance = () => {
    const queryClient = useQueryClient();
    const date = useMemo(() => getTodayIsoDate(), []);

    return useMutation<
        CreateDailyBalanceSuccessResponse,
        CreateDailyBalanceApiError,
        CreateDailyBalancePayload
    >({
        mutationFn: (payload: CreateDailyBalancePayload) =>
            CreateDailyBalanceService.createDailyBalance(payload),
        onSuccess: (response: CreateDailyBalanceSuccessResponse) => {
            // The creation response is authoritative: writing it straight into
            // the cache keeps the "Balance Neto Total" header and the "Empecé"
            // field reactive without a refetch or page reload.
            queryClient.setQueryData<DailyBalanceData | null>(
                dailyBalanceQueryKey(date),
                response.data,
            );

            // Invalidate daily, monthly, and yearly balance queries
            queryClient.invalidateQueries({ queryKey: ["daily-balances"] });
            queryClient.invalidateQueries({ queryKey: ["monthly-balances"] });
            queryClient.invalidateQueries({ queryKey: ["yearly-balances"] });
        },
    });
};

export default useCreateDailyBalance;
