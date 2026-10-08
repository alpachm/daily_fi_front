// src/interfaces/DeleteReceiptService.interface.ts

/**
 * Categories used to classify errors thrown by the delete receipt service.
 */
export type DeleteReceiptApiErrorKind =
    | "unauthorized"
    | "forbidden"
    | "notFound"
    | "network"
    | "unexpected";

/**
 * Structured error thrown by `DeleteReceiptService.deleteReceipt`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized, user-facing
 * messages instead of rendering `message` directly.
 */
export class DeleteReceiptApiError extends Error {
    readonly kind: DeleteReceiptApiErrorKind;
    readonly statusCode: number | null;

    constructor(
        message: string,
        options: {
            kind?: DeleteReceiptApiErrorKind;
            statusCode?: number | null;
        } = {},
    ) {
        super(message);
        this.name = "DeleteReceiptApiError";
        this.kind = options.kind ?? "unexpected";
        this.statusCode = options.statusCode ?? null;
    }
}
