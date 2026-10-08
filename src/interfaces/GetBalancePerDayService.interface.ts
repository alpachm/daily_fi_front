// src/interfaces/GetBalancePerDayService.interface.ts
import type { DailyBalanceData } from "./DailyBalance.interface";

export type { DailyBalanceData };

/**
 * Response returned by the API when a daily balance exists for the requested
 * date (HTTP 200).
 */
export interface GetBalancePerDaySuccessResponse {
    status: "success";
    data: DailyBalanceData;
}

/**
 * A single field-level validation error.
 */
export interface ValidationErrorItem {
    field: string;
    message: string;
}

/**
 * Response returned by the API when the `date` query parameter fails
 * validation (HTTP 400).
 */
export interface GetBalancePerDayValidationError {
    status: "fail";
    message: string;
    errors: ValidationErrorItem[];
}

/**
 * Response returned by the API for error states that only carry a single
 * message (HTTP 401 Unauthorized / 404 Not Found).
 */
export interface GenericApiErrorResponse {
    status: "fail";
    message: string;
}

/**
 * Union of every error payload the endpoint can return (HTTP 400 and 401).
 */
export type GetBalancePerDayErrorResponse =
    | GetBalancePerDayValidationError
    | GenericApiErrorResponse;

/**
 * Categories used to classify errors thrown by the get balance per day
 * service.
 */
export type GetBalancePerDayApiErrorKind =
    | "validation"
    | "unauthorized"
    | "network"
    | "unexpected";

/**
 * Structured error thrown by `GetBalancePerDayService.getBalancePerDay`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized,
 * user-facing messages instead of rendering `message` directly. When `kind`
 * is `"validation"`, `fieldErrors` carries the structured, per-field feedback
 * returned by the API.
 */
export class GetBalancePerDayApiError extends Error {
    readonly kind: GetBalancePerDayApiErrorKind;
    readonly statusCode: number | null;
    readonly fieldErrors: ValidationErrorItem[];

    constructor(
        message: string,
        options: {
            kind?: GetBalancePerDayApiErrorKind;
            statusCode?: number | null;
            fieldErrors?: ValidationErrorItem[];
        } = {},
    ) {
        super(message);
        this.name = "GetBalancePerDayApiError";
        this.kind = options.kind ?? "unexpected";
        this.statusCode = options.statusCode ?? null;
        this.fieldErrors = options.fieldErrors ?? [];
    }
}
