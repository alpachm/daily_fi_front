// src/hooks/useDeleteReceipt.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DeleteReceiptService } from "../services/DeleteReceiptService";
import type { DeleteReceiptApiError } from "../interfaces/DeleteReceiptService.interface";

/**
 * Wraps `DeleteReceiptService.deleteReceipt` in a TanStack Query mutation.
 *
 * On success it invalidates every `receipts-day` query, which refetches the
 * active receipts table for the currently consulted day so the deleted row
 * disappears immediately without a manual reload.
 */
export const useDeleteReceipt = () => {
    const queryClient = useQueryClient();

    return useMutation<void, DeleteReceiptApiError, number | string>({
        mutationFn: (receiptId: number | string) =>
            DeleteReceiptService.deleteReceipt(receiptId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["receipts-day"] });
        },
    });
};

export default useDeleteReceipt;
