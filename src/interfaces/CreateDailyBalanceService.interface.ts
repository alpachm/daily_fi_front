// src/interfaces/CreateDailyBalanceService.interface.ts
import type { DailyBalanceData } from "./DailyBalance.interface";

export type { DailyBalanceData };

/**
 * Payload required to open a new daily balance (shift).
 */
export interface CreateDailyBalancePayload {
    date: string;
    opening_balance: number;
}

/**
 * Response returned by the API on a successful creation (HTTP 201).
 */
export interface CreateDailyBalanceSuccessResponse {
    status: "success";
    data: DailyBalanceData;
}

/**
 * A single field-level validation error.
 */
export interface CreateDailyBalanceFieldError {
    field: string;
    message: string;
}

/**
 * Response returned by the API when the payload fails validation (HTTP 400).
 */
export interface CreateDailyBalanceValidationErrorResponse {
    status: "fail";
    message: string;
    errors: CreateDailyBalanceFieldError[];
}

/**
 * Response returned by the API when the bearer token is missing or
 * invalid (HTTP 401).
 */
export interface CreateDailyBalanceUnauthorizedErrorResponse {
    status: "fail";
    message: string;
}

/**
 * Response returned by the API when a daily balance already exists for the
 * requested date and the current shift must be closed first (HTTP 409).
 */
export interface CreateDailyBalanceConflictErrorResponse {
    status: "fail";
    message: string;
}

/**
 * Union of every error payload the endpoint can return.
 */
export type CreateDailyBalanceErrorResponse =
    | CreateDailyBalanceValidationErrorResponse
    | CreateDailyBalanceUnauthorizedErrorResponse
    | CreateDailyBalanceConflictErrorResponse;

/**
 * Categories used to classify errors thrown by the create daily balance
 * service.
 */
export type CreateDailyBalanceApiErrorKind =
    | "validation"
    | "unauthorized"
    | "conflict"
    | "network"
    | "unexpected";

/**
 * Structured error thrown by `CreateDailyBalanceService.createDailyBalance`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized,
 * user-facing messages instead of rendering `message` directly.
 */
export class CreateDailyBalanceApiError extends Error {
    readonly kind: CreateDailyBalanceApiErrorKind;
    readonly statusCode: number | null;
    readonly fieldErrors: CreateDailyBalanceFieldError[];

    constructor(
        message: string,
        options: {
            kind?: CreateDailyBalanceApiErrorKind;
            statusCode?: number | null;
            fieldErrors?: CreateDailyBalanceFieldError[];
        } = {},
    ) {
        super(message);
        this.name = "CreateDailyBalanceApiError";
        this.kind = options.kind ?? "unexpected";
        this.statusCode = options.statusCode ?? null;
        this.fieldErrors = options.fieldErrors ?? [];
    }
}
