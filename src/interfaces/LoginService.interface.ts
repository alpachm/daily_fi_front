// src/interfaces/LoginService.interface.ts

/**
 * Payload required to authenticate a user.
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Minimal authenticated user entity returned on successful login.
 */
export interface AuthUserData {
    id: number;
    email: string;
}

/**
 * Response returned by the API on a successful login (HTTP 200).
 */
export interface LoginSuccessResponse {
    status: "success";
    data: {
        token: string;
        user: AuthUserData;
    };
}

/**
 * A single field-level validation error.
 */
export interface LoginFieldError {
    field: string;
    message: string;
}

/**
 * Response returned by the API when the payload fails validation (HTTP 400).
 */
export interface LoginValidationErrorResponse {
    status: "fail";
    message: string;
    errors: LoginFieldError[];
}

/**
 * Response returned by the API when credentials are invalid (HTTP 401).
 */
export interface LoginUnauthorizedErrorResponse {
    status: "fail";
    message: string;
}

/**
 * Union of every error payload the login endpoint can return.
 */
export type LoginErrorResponse =
    | LoginValidationErrorResponse
    | LoginUnauthorizedErrorResponse;

/**
 * Categories used to classify errors thrown by the login service.
 */
export type LoginApiErrorKind =
    | "validation"
    | "unauthorized"
    | "network"
    | "unexpected";

/**
 * Structured error thrown by `LoginService.loginUser`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized,
 * user-facing messages instead of rendering `message` directly.
 */
export class LoginApiError extends Error {
    readonly kind: LoginApiErrorKind;
    readonly statusCode: number | null;
    readonly fieldErrors: LoginFieldError[];

    constructor(
        message: string,
        options: {
            kind?: LoginApiErrorKind;
            statusCode?: number | null;
            fieldErrors?: LoginFieldError[];
        } = {},
    ) {
        super(message);
        this.name = "LoginApiError";
        this.kind = options.kind ?? "unexpected";
        this.statusCode = options.statusCode ?? null;
        this.fieldErrors = options.fieldErrors ?? [];
    }
}
