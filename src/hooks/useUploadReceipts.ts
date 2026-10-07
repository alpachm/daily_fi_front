// src/hooks/useUploadReceipts.ts
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { UploadReceiptsService } from "../services/UploadReceiptsService";
import { UploadReceiptsApiError } from "../interfaces/UploadReceiptsService.interface";
import type {
    UploadReceiptsPayload,
    UploadReceiptsSuccessResponse,
} from "../interfaces/UploadReceiptsService.interface";
import { chunkArray } from "../utils/chunkArray";

/**
 * Maximum number of receipt files sent in a single `POST /receipts/bulk`
 * request. Splitting large selections into batches keeps network bandwidth
 * and server memory usage bounded.
 */
export const RECEIPT_UPLOAD_BATCH_SIZE = 50;

/**
 * Live snapshot of a sequential batch upload. The UI consumes this to render
 * a dynamic progress message such as
 * "Subiendo lote 2 de 3 (100/120 comprobantes)...".
 */
export interface UploadReceiptsProgress {
    /** 1-based index of the batch currently being uploaded. */
    batchIndex: number;
    /** Total number of batches derived from the selected files. */
    totalBatches: number;
    /** Running total of files covered up to and including the current batch. */
    uploadedFiles: number;
    /** Total number of files selected for upload. */
    totalFiles: number;
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
    const [progress, setProgress] = useState<UploadReceiptsProgress | null>(null);

    const mutation = useMutation<
        UploadReceiptsSuccessResponse,
        UploadReceiptsApiError,
        UploadReceiptsPayload
    >({
        mutationFn: async (
            payload: UploadReceiptsPayload,
        ): Promise<UploadReceiptsSuccessResponse> => {
            const batches = chunkArray(payload.receipts, RECEIPT_UPLOAD_BATCH_SIZE);

            let uploadedFiles = 0;
            let lastResponse: UploadReceiptsSuccessResponse | null = null;

            for (let index = 0; index < batches.length; index += 1) {
                const batch = batches[index];

                // Update progress before the request so the UI reflects the
                // current batch immediately (uploadedFiles is the running total
                // including the batch about to be sent).
                uploadedFiles += batch.length;
                setProgress({
                    batchIndex: index + 1,
                    totalBatches: batches.length,
                    uploadedFiles,
                    totalFiles: payload.receipts.length,
                });

                const batchPayload: UploadReceiptsPayload = {
                    ...payload,
                    receipts: batch,
                };

                // Sequential await: each batch completes before the next starts.
                // A rejected request throws here and aborts the remaining batches.
                const response =
                    await UploadReceiptsService.uploadReceipts(batchPayload);
                lastResponse = response;
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
            setProgress(null);
        },
        onError: () => {
            setProgress(null);
        },
    });

    return {
        uploadReceipts: mutation.mutateAsync,
        isPending: mutation.isPending,
        progress,
    };
};

export default useUploadReceipts;
