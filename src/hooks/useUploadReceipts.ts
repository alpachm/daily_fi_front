// src/hooks/useUploadReceipts.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { UploadReceiptsService } from "../services/UploadReceiptsService";
import type {
    UploadReceiptsApiError,
    UploadReceiptsPayload,
    UploadReceiptsSuccessResponse,
} from "../interfaces/UploadReceiptsService.interface";

/**
 * Wraps `UploadReceiptsService.uploadReceipts` in a TanStack Query mutation.
 *
 * On success it invalidates the daily, monthly and yearly balance queries so
 * any balance/receipt-related totals refetch without a manual reload.
 */
export const useUploadReceipts = () => {
    const queryClient = useQueryClient();

    return useMutation<
        UploadReceiptsSuccessResponse,
        UploadReceiptsApiError,
        UploadReceiptsPayload
    >({
        mutationFn: (payload: UploadReceiptsPayload) =>
            UploadReceiptsService.uploadReceipts(payload),
        onSuccess: () => {
            // Receipt uploads can alter balance-derived totals, so invalidate
            // daily, monthly, and yearly balance queries.
            queryClient.invalidateQueries({ queryKey: ["daily-balances"] });
            queryClient.invalidateQueries({ queryKey: ["monthly-balances"] });
            queryClient.invalidateQueries({ queryKey: ["yearly-balances"] });
        },
    });
};

export default useUploadReceipts;
