// src/hooks/useUpdateDailyBalance.ts
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { UpdateDailyBalanceService } from "../services/UpdateDailyBalanceService";
import type {
    UpdateDailyBalanceApiError,
    UpdateDailyBalancePayload,
    UpdateDailyBalanceSuccessResponse,
} from "../interfaces/UpdateDailyBalanceService.interface";
import type { DailyBalanceData } from "../interfaces/DailyBalance.interface";
import { getTodayIsoDate } from "../utils/date";
import { dailyBalanceQueryKey } from "./useGetBalancePerDay";

interface UpdateDailyBalanceVariables {
    id: number;
    payload: UpdateDailyBalancePayload;
}

interface UseUpdateDailyBalanceOptions {
    /**
     * Invoked after the mutation succeeds and the cache has been updated with
     * the authoritative server response. The UI layer uses it to reset its
     * transient form state (edit flags / drafts) for both inputs.
     */
    onSuccess?: (response: UpdateDailyBalanceSuccessResponse) => void;
}

/**
 * Wraps `UpdateDailyBalanceService.updateDailyBalance` in a TanStack Query
 * mutation and keeps the `daily-balance` cache entry in sync with the server
 * response so the UI reacts without a manual refresh.
 *
 * The optional `onSuccess` callback runs right after the cache write, so every
 * caller can re-synchronize local form state with the returned data.
 */
export const useUpdateDailyBalance = (
    options: UseUpdateDailyBalanceOptions = {},
) => {
    const queryClient = useQueryClient();
    const date = useMemo(() => getTodayIsoDate(), []);
    const { onSuccess } = options;

    return useMutation<
        UpdateDailyBalanceSuccessResponse,
        UpdateDailyBalanceApiError,
        UpdateDailyBalanceVariables
    >({
        mutationFn: ({ id, payload }: UpdateDailyBalanceVariables) =>
            UpdateDailyBalanceService.updateDailyBalance(id, payload),
        onSuccess: (response: UpdateDailyBalanceSuccessResponse) => {
            // The update response is authoritative: writing it straight into
            // the cache keeps the "Empecé"/"Terminé" fields and the header
            // reactive without a refetch or page reload.
            queryClient.setQueryData<DailyBalanceData | null>(
                dailyBalanceQueryKey(date),
                response.data,
            );

            onSuccess?.(response);
        },
    });
};

export default useUpdateDailyBalance;
