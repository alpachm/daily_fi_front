// src/interfaces/GetReceiptsPerDayService.interface.ts

/**
 * A single receipt record returned by the "get receipts per day" endpoint.
 */
export interface ReceiptItem {
    id: number;
    userId: number;
    dailyBalanceId: number;
    fileUrl: string;
    type: "PURCHASE" | "SALE";
    date: string;
    description: string | null;
    category: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Payload carried by the success response of the "get receipts per day"
 * endpoint.
 */
export interface GetReceiptsPerDayResponseData {
    date: string;
    count: number;
    receipts: ReceiptItem[];
}

/**
 * Response returned by the API on a successful request (HTTP 200).
 */
export interface GetReceiptsPerDayResponse {
    status: "success";
    message: string;
    data: GetReceiptsPerDayResponseData;
}

/**
 * A single field-level validation error.
 */
export interface GetReceiptsPerDayFieldError {
    field: string;
    message: string;
}

/**
 * Response returned by the API when the `date` query parameter fails
 * validation (HTTP 400).
 */
export interface GetReceiptsPerDayValidationError {
    status: "fail";
    message: string;
    errors: GetReceiptsPerDayFieldError[];
}

/**
 * Response returned by the API for error states that only carry a single
 * message (HTTP 401 Unauthorized).
 */
export interface GetReceiptsPerDayGenericErrorResponse {
    status: "fail";
    message: string;
}

/**
 * Union of every error payload the endpoint can return (HTTP 400 and 401).
 */
export type GetReceiptsPerDayErrorResponse =
    | GetReceiptsPerDayValidationError
    | GetReceiptsPerDayGenericErrorResponse;

/**
 * Categories used to classify errors thrown by the get receipts per day
 * service.
 */
export type GetReceiptsPerDayApiErrorKind =
    | "validation"
    | "unauthorized"
    | "network"
    | "unexpected";

/**
 * Structured error thrown by `GetReceiptsPerDayService.getReceiptsPerDay`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized,
 * user-facing messages instead of rendering `message` directly. When `kind`
 * is `"validation"`, `fieldErrors` carries the structured, per-field feedback
 * returned by the API.
 */
export class GetReceiptsPerDayApiError extends Error {
    readonly kind: GetReceiptsPerDayApiErrorKind;
    readonly statusCode: number | null;
    readonly fieldErrors: GetReceiptsPerDayFieldError[];

    constructor(
        message: string,
        options: {
            kind?: GetReceiptsPerDayApiErrorKind;
            statusCode?: number | null;
            fieldErrors?: GetReceiptsPerDayFieldError[];
        } = {},
    ) {
        super(message);
        this.name = "GetReceiptsPerDayApiError";
        this.kind = options.kind ?? "unexpected";
        this.statusCode = options.statusCode ?? null;
        this.fieldErrors = options.fieldErrors ?? [];
    }
}
