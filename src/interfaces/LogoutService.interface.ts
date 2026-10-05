// src/interfaces/LogoutService.interface.ts

/**
 * Response returned by the API on a successful logout (HTTP 200).
 */
export interface LogoutSuccessResponse {
    status: "success";
    data: {
        message: string;
    };
}

/**
 * Response returned by the API when the bearer token is missing,
 * invalid, or has already been revoked (HTTP 401).
 */
export interface LogoutUnauthorizedErrorResponse {
    status: "fail";
    message: string;
}

/**
 * Categories used to classify errors thrown by the logout service.
 */
export type LogoutApiErrorKind = "unauthorized" | "network" | "unexpected";

/**
 * Structured error thrown by `LogoutService.logoutUser`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized,
 * user-facing messages instead of rendering `message` directly.
 */
export class LogoutApiError extends Error {
    readonly kind: LogoutApiErrorKind;
    readonly statusCode: number | null;

    constructor(
        message: string,
        options: {
            kind?: LogoutApiErrorKind;
            statusCode?: number | null;
        } = {},
    ) {
        super(message);
        this.name = "LogoutApiError";
        this.kind = options.kind ?? "unexpected";
        this.statusCode = options.statusCode ?? null;
    }
}
