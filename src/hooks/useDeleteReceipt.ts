// src/hooks/useDeleteReceipt.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DeleteReceiptService } from "../services/DeleteReceiptService";
import type { DeleteReceiptApiError } from "../interfaces/DeleteReceiptService.interface";

interface UseDeleteReceiptOptions {
    /**
     * Runs synchronously right before the DELETE request is issued. The UI
     * layer uses it to switch the confirmation modal into its loading/pending
     * state while `deleteReceipt` is executing.
     */
    onMutate?: (receiptId: number) => void;
    /**
     * Runs after the receipt has been deleted and the `receipts-day` cache has
     * been invalidated. The UI layer uses it to show the success state/toast
     * immediately.
     */
    onSuccess?: () => void;
    /**
     * Runs when the deletion fails so the UI can render a localized error.
     */
    onError?: (error: DeleteReceiptApiError) => void;
}

/**
 * Wraps `DeleteReceiptService.deleteReceipt` in a TanStack Query mutation.
 *
 * On success it invalidates every `receipts-day` query using `refetchType:
 * "active"`, which forces the mounted receipts table to refetch immediately so
 * the deleted row disappears without a manual reload.
 */
export const useDeleteReceipt = (options: UseDeleteReceiptOptions = {}) => {
    const queryClient = useQueryClient();
    const { onMutate, onSuccess, onError } = options;

    return useMutation<void, DeleteReceiptApiError, number>({
        mutationFn: (receiptId: number) =>
            DeleteReceiptService.deleteReceipt(receiptId),
        onMutate,
        onError,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["receipts-day"],
                refetchType: "active",
            });
            onSuccess?.();
        },
    });
};

export default useDeleteReceipt;
