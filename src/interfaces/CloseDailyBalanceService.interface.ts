// src/interfaces/CloseDailyBalanceService.interface.ts
import type { DailyBalanceData } from "./DailyBalance.interface";

export type { DailyBalanceData };

/**
 * Response returned by the API when the active day is closed successfully
 * (HTTP 200).
 */
export interface CloseDailyBalanceSuccessResponse {
    status: "success";
    data: DailyBalanceData;
}

/**
 * A single field-level validation error.
 */
export interface CloseDailyBalanceFieldError {
    field: string;
    message: string;
}

/**
 * Response returned by the API when the payload fails validation (HTTP 400).
 */
export interface CloseDailyBalanceValidationErrorResponse {
    status: "fail";
    message: string;
    errors: CloseDailyBalanceFieldError[];
}

/**
 * Response returned by the API for error states that only carry a single
 * message (HTTP 401 Unauthorized / 403 Forbidden / 404 Not Found).
 */
export interface CloseDailyBalanceGenericErrorResponse {
    status: "fail";
    message: string;
}

/**
 * Union of every error payload the endpoint can return.
 */
export type CloseDailyBalanceErrorResponse =
    | CloseDailyBalanceValidationErrorResponse
    | CloseDailyBalanceGenericErrorResponse;

/**
 * Categories used to classify errors thrown by the close daily balance
 * service.
 */
export type CloseDailyBalanceApiErrorKind =
    | "validation"
    | "unauthorized"
    | "forbidden"
    | "notFound"
    | "network"
    | "unexpected";

/**
 * Structured error thrown by `CloseDailyBalanceService.closeDailyBalance`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized,
 * user-facing messages instead of rendering `message` directly.
 */
export class CloseDailyBalanceApiError extends Error {
    readonly kind: CloseDailyBalanceApiErrorKind;
    readonly statusCode: number | null;
    readonly fieldErrors: CloseDailyBalanceFieldError[];

    constructor(
        message: string,
        options: {
            kind?: CloseDailyBalanceApiErrorKind;
            statusCode?: number | null;
            fieldErrors?: CloseDailyBalanceFieldError[];
        } = {},
    ) {
        super(message);
        this.name = "CloseDailyBalanceApiError";
        this.kind = options.kind ?? "unexpected";
        this.statusCode = options.statusCode ?? null;
        this.fieldErrors = options.fieldErrors ?? [];
    }
}
