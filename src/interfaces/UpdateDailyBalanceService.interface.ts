// src/interfaces/UpdateDailyBalanceService.interface.ts
import type { DailyBalanceData } from "./DailyBalance.interface";

export type { DailyBalanceData };

/**
 * Payload accepted by the update daily balance endpoint. Both fields are
 * required: a PATCH request must always send the opening and closing balances.
 */
export interface UpdateDailyBalancePayload {
    opening_balance: number;
    closing_balance: number;
}

/**
 * Response returned by the API when the daily balance is updated successfully
 * (HTTP 200).
 */
export interface UpdateDailyBalanceSuccessResponse {
    status: "success";
    data: DailyBalanceData;
}

/**
 * A single field-level validation error.
 */
export interface UpdateDailyBalanceFieldError {
    field: string;
    message: string;
}

/**
 * Response returned by the API when the payload fails validation (HTTP 400).
 */
export interface UpdateDailyBalanceValidationErrorResponse {
    status: "fail";
    message: string;
    errors: UpdateDailyBalanceFieldError[];
}

/**
 * Response returned by the API for error states that only carry a single
 * message (HTTP 401 Unauthorized / 403 Forbidden / 404 Not Found).
 */
export interface UpdateDailyBalanceGenericErrorResponse {
    status: "fail";
    message: string;
}

/**
 * Union of every error payload the endpoint can return.
 */
export type UpdateDailyBalanceErrorResponse =
    | UpdateDailyBalanceValidationErrorResponse
    | UpdateDailyBalanceGenericErrorResponse;

/**
 * Categories used to classify errors thrown by the update daily balance
 * service.
 */
export type UpdateDailyBalanceApiErrorKind =
    | "validation"
    | "unauthorized"
    | "forbidden"
    | "notFound"
    | "network"
    | "unexpected";

/**
 * Structured error thrown by `UpdateDailyBalanceService.updateDailyBalance`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized,
 * user-facing messages instead of rendering `message` directly.
 */
export class UpdateDailyBalanceApiError extends Error {
    readonly kind: UpdateDailyBalanceApiErrorKind;
    readonly statusCode: number | null;
    readonly fieldErrors: UpdateDailyBalanceFieldError[];

    constructor(
        message: string,
        options: {
            kind?: UpdateDailyBalanceApiErrorKind;
            statusCode?: number | null;
            fieldErrors?: UpdateDailyBalanceFieldError[];
        } = {},
    ) {
        super(message);
        this.name = "UpdateDailyBalanceApiError";
        this.kind = options.kind ?? "unexpected";
        this.statusCode = options.statusCode ?? null;
        this.fieldErrors = options.fieldErrors ?? [];
    }
}
