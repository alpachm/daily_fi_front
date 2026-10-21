// src/interfaces/ChangePasswordService.interface.ts

/**
 * Payload accepted by the change-password endpoint. Both fields are required.
 */
export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

/**
 * Response returned by the API when the password is updated successfully
 * (HTTP 200).
 */
export interface ChangePasswordSuccessResponse {
    status: "success";
    data: {
        message: string;
    };
}

/**
 * A single field-level validation error.
 */
export interface ChangePasswordFieldError {
    field: string;
    message: string;
}

/**
 * Response returned by the API when the payload fails validation (HTTP 400).
 */
export interface ChangePasswordValidationErrorResponse {
    status: "fail";
    message: string;
    errors: ChangePasswordFieldError[];
}

/**
 * Response returned by the API for error states that only carry a single
 * message (HTTP 401 Unauthorized).
 */
export interface ChangePasswordUnauthorizedErrorResponse {
    status: "fail";
    message: string;
}

/**
 * Union of every error payload the change-password endpoint can return.
 */
export type ChangePasswordErrorResponse =
    | ChangePasswordValidationErrorResponse
    | ChangePasswordUnauthorizedErrorResponse;

/**
 * Categories used to classify errors thrown by the change-password service.
 */
export type ChangePasswordApiErrorKind =
    | "validation"
    | "unauthorized"
    | "incorrectPassword"
    | "network"
    | "unexpected";

/**
 * Structured error thrown by `ChangePasswordService.changePassword`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized,
 * user-facing messages instead of rendering `message` directly.
 */
export class ChangePasswordApiError extends Error {
    readonly kind: ChangePasswordApiErrorKind;
    readonly statusCode: number | null;
    readonly fieldErrors: ChangePasswordFieldError[];

    constructor(
        message: string,
        options: {
            kind?: ChangePasswordApiErrorKind;
            statusCode?: number | null;
            fieldErrors?: ChangePasswordFieldError[];
        } = {},
    ) {
        super(message);
        this.name = "ChangePasswordApiError";
        this.kind = options.kind ?? "unexpected";
        this.statusCode = options.statusCode ?? null;
        this.fieldErrors = options.fieldErrors ?? [];
    }

    /**
     * First field-level validation message returned by the backend, or `null`
     * when the error did not include field errors.
     */
    get fieldErrorMessage(): string | null {
        return this.fieldErrors[0]?.message ?? null;
    }
}
