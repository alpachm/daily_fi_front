// src/hooks/useUploadReceipts.ts
import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { UploadReceiptsService } from "../services/UploadReceiptsService";
import { UploadReceiptsApiError } from "../interfaces/UploadReceiptsService.interface";
import type {
    UploadReceiptsPayload,
    UploadReceiptsSuccessResponse,
} from "../interfaces/UploadReceiptsService.interface";
import { chunkArray } from "../utils/chunkArray";
import { getUploadReceiptsErrorKey } from "../utils/uploadReceiptsError";
import type { UploadReceiptsErrorKey } from "../utils/uploadReceiptsError";

/**
 * Maximum number of receipt files sent in a single `POST /receipts/bulk`
 * request. Splitting large selections into batches keeps network bandwidth
 * and server memory usage bounded.
 */
export const RECEIPT_UPLOAD_BATCH_SIZE = 50;

/**
 * Lifecycle status of a single receipt upload batch.
 */
export type BatchStatusKind = "pending" | "uploading" | "completed" | "error";

/**
 * Breakdown row for a single batch of the receipt upload. The UI consumes
 * this to render a checklist that advances in real time as the sequential
 * HTTP requests resolve.
 */
export interface BatchStatus {
    /** 1-based identifier of the batch within the current upload. */
    id: number;
    /** Number of files that belong to this batch. */
    totalFiles: number;
    /** Current lifecycle status of the batch. */
    status: BatchStatusKind;
    /** Localized error key when the batch fails, resolved by the UI. */
    errorKey?: UploadReceiptsErrorKey;
}

/**
 * Wraps `UploadReceiptsService.uploadReceipts` in a TanStack Query mutation
 * that processes the selected files in sequential batches of
 * `RECEIPT_UPLOAD_BATCH_SIZE` files.
 *
 * On success it invalidates the daily, monthly, and yearly balance queries so
 * any receipt-derived totals refetch without a manual reload.
 */
export const useUploadReceipts = () => {
    const queryClient = useQueryClient();
    const [batches, setBatches] = useState<BatchStatus[]>([]);

    const updateBatchStatus = useCallback(
        (
            batchId: number,
            status: BatchStatusKind,
            errorKey?: UploadReceiptsErrorKey,
        ): void => {
            setBatches((previous) =>
                previous.map((item) =>
                    item.id === batchId
                        ? {
                              ...item,
                              status,
                              ...(errorKey !== undefined ? { errorKey } : {}),
                          }
                        : item,
                ),
            );
        },
        [],
    );

    const resetBatches = useCallback((): void => {
        setBatches([]);
    }, []);

    const mutation = useMutation<
        UploadReceiptsSuccessResponse,
        UploadReceiptsApiError,
        UploadReceiptsPayload
    >({
        mutationFn: async (
            payload: UploadReceiptsPayload,
        ): Promise<UploadReceiptsSuccessResponse> => {
            const chunks = chunkArray(payload.receipts, RECEIPT_UPLOAD_BATCH_SIZE);

            // Seed the breakdown as all-pending so the UI can render the full
            // checklist before the first request starts.
            setBatches(
                chunks.map((chunk, index): BatchStatus => ({
                    id: index + 1,
                    totalFiles: chunk.length,
                    status: "pending",
                })),
            );

            let lastResponse: UploadReceiptsSuccessResponse | null = null;

            for (let index = 0; index < chunks.length; index += 1) {
                const batch = chunks[index];
                const batchId = index + 1;

                updateBatchStatus(batchId, "uploading");

                const batchPayload: UploadReceiptsPayload = {
                    ...payload,
                    receipts: batch,
                };

                try {
                    // Sequential await: each batch completes before the next
                    // starts. A rejected request marks this batch as failed and
                    // aborts the remaining batches.
                    const response =
                        await UploadReceiptsService.uploadReceipts(batchPayload);
                    lastResponse = response;
                    updateBatchStatus(batchId, "completed");
                } catch (error: unknown) {
                    updateBatchStatus(
                        batchId,
                        "error",
                        getUploadReceiptsErrorKey(error),
                    );
                    throw error;
                }
            }

            if (lastResponse === null) {
                throw new UploadReceiptsApiError(
                    "No receipt batches were uploaded.",
                    { kind: "unexpected", statusCode: null },
                );
            }

            return lastResponse;
        },
        onSuccess: () => {
            // Receipt uploads can alter balance-derived totals, so invalidate
            // the daily, monthly, and yearly balance queries.
            queryClient.invalidateQueries({ queryKey: ["daily-balances"] });
            queryClient.invalidateQueries({ queryKey: ["monthly-balances"] });
            queryClient.invalidateQueries({ queryKey: ["yearly-balances"] });
        },
    });

    return {
        uploadReceipts: mutation.mutateAsync,
        isPending: mutation.isPending,
        batches,
        resetBatches,
    };
};

export default useUploadReceipts;
