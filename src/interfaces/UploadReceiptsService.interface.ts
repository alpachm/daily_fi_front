// src/interfaces/UploadReceiptsService.interface.ts

/**
 * Payload required to bulk-upload receipt files for a given date.
 */
export interface UploadReceiptsPayload {
    /** YYYY-MM-DD (required). */
    date: string;
    /** Optional free-text description (max 255). */
    description?: string;
    /** Optional free-text category (max 255). */
    category?: string;
    /** Optional receipt type; the backend defaults to "PURCHASE" when omitted. */
    type?: "PURCHASE" | "SALE";
    /** Required array of files (JPEG, PNG, WebP, PDF). */
    receipts: File[];
}

/**
 * A single field-level validation error.
 */
export interface UploadReceiptsFieldError {
    field: string;
    message: string;
}

/**
 * Summary of a successful bulk upload.
 */
export interface UploadReceiptsSuccessData {
    count: number;
}

/**
 * Response returned by the API on a successful bulk upload.
 */
export interface UploadReceiptsSuccessResponse {
    status: "success";
    message: string;
    data?: UploadReceiptsSuccessData;
}

/**
 * Response returned by the API when the bulk upload fails (e.g. HTTP 400).
 */
export interface UploadReceiptsErrorResponse {
    status: "fail";
    message: string;
    errors?: UploadReceiptsFieldError[];
}

/**
 * Canonical API response contract for `POST /receipts/bulk`.
 */
export type UploadReceiptsResponse =
    | UploadReceiptsSuccessResponse
    | UploadReceiptsErrorResponse;

/**
 * Categories used to classify errors thrown by the upload receipts service.
 */
export type UploadReceiptsApiErrorKind =
    | "validation"
    | "unauthorized"
    | "network"
    | "unexpected";

/**
 * Structured error thrown by `UploadReceiptsService.uploadReceipts`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized,
 * user-facing messages instead of rendering `message` directly.
 */
export class UploadReceiptsApiError extends Error {
    readonly kind: UploadReceiptsApiErrorKind;
    readonly statusCode: number | null;
    readonly fieldErrors: UploadReceiptsFieldError[];

    constructor(
        message: string,
        options: {
            kind?: UploadReceiptsApiErrorKind;
            statusCode?: number | null;
            fieldErrors?: UploadReceiptsFieldError[];
        } = {},
    ) {
        super(message);
        this.name = "UploadReceiptsApiError";
        this.kind = options.kind ?? "unexpected";
        this.statusCode = options.statusCode ?? null;
        this.fieldErrors = options.fieldErrors ?? [];
    }
}
