// src/services/ChangePasswordService.ts
import {
    ChangePasswordApiError,
    type ChangePasswordFieldError,
    type ChangePasswordPayload,
    type ChangePasswordSuccessResponse,
    type ChangePasswordUnauthorizedErrorResponse,
    type ChangePasswordValidationErrorResponse,
} from "../interfaces/ChangePasswordService.interface";
import { getAccessToken } from "../utils/auth";
import { handleSessionExpired } from "../utils/sessionExpiry";

/**
 * Base URL of the backend API, injected at build time by Vite.
 *
 * The variable must be exposed with the `VITE_` prefix (see `.env`) to be
 * available on `import.meta.env`. An empty string is used as a graceful
 * fallback when the variable is not configured.
 */
const API_BASE_URL: string = import.meta.env.VITE_BASE_URL ?? "";

const CHANGE_PASSWORD_ENDPOINT = "/users/change-password";

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isFieldError = (value: unknown): value is ChangePasswordFieldError => {
    if (!isObject(value)) {
        return false;
    }
    return typeof value.field === "string" && typeof value.message === "string";
};

const isValidationErrorResponse = (
    value: unknown,
): value is ChangePasswordValidationErrorResponse => {
    if (!isObject(value)) {
        return false;
    }
    if (value.status !== "fail" || typeof value.message !== "string") {
        return false;
    }
    const errors: unknown = value.errors;
    return Array.isArray(errors) && errors.every(isFieldError);
};

const isUnauthorizedErrorResponse = (
    value: unknown,
): value is ChangePasswordUnauthorizedErrorResponse => {
    if (!isObject(value)) {
        return false;
    }
    return value.status === "fail" && typeof value.message === "string";
};

const isChangePasswordSuccessResponse = (
    value: unknown,
): value is ChangePasswordSuccessResponse => {
    if (!isObject(value)) {
        return false;
    }
    if (value.status !== "success") {
        return false;
    }
    const data: unknown = value.data;
    return isObject(data) && typeof data.message === "string";
};

/**
 * Detects the backend signal for a wrong current password. This message is a
 * normal business error and must never terminate the local session.
 */
const isIncorrectPasswordMessage = (message: string): boolean => {
    const normalized = message.trim().toLowerCase();
    return (
        normalized === "current password is incorrect" ||
        normalized === "current password is incorrect." ||
        normalized === "incorrect current password" ||
        (normalized.includes("current password") &&
            normalized.includes("incorrect"))
    );
};

const readResponseBody = async (response: Response): Promise<unknown> => {
    try {
        return await response.json();
    } catch {
        return null;
    }
};

const mapErrorResponse = (
    statusCode: number,
    body: unknown,
): ChangePasswordApiError => {
    if (statusCode === 400 && isValidationErrorResponse(body)) {
        const validationMessage = body.errors[0]?.message ?? body.message;
        return new ChangePasswordApiError(validationMessage, {
            kind: "validation",
            statusCode,
            fieldErrors: body.errors,
        });
    }

    if (statusCode === 401 && isUnauthorizedErrorResponse(body)) {
        // A wrong current password must NOT clear credentials or redirect;
        // every other 401 on this protected endpoint means the stored token
        // is missing, invalid, or expired.
        if (isIncorrectPasswordMessage(body.message)) {
            return new ChangePasswordApiError(body.message, {
                kind: "incorrectPassword",
                statusCode,
            });
        }

        handleSessionExpired();
        return new ChangePasswordApiError(body.message, {
            kind: "unauthorized",
            statusCode,
        });
    }

    return new ChangePasswordApiError(
        "Change password failed with an unexpected error.",
        {
            kind: "unexpected",
            statusCode,
        },
    );
};

const changePassword = async (
    payload: ChangePasswordPayload,
): Promise<ChangePasswordSuccessResponse> => {
    const url = `${API_BASE_URL}${CHANGE_PASSWORD_ENDPOINT}`;
    const accessToken = getAccessToken();

    let response: Response;
    try {
        response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(accessToken !== null
                    ? { Authorization: `Bearer ${accessToken}` }
                    : {}),
            },
            body: JSON.stringify(payload),
        });
    } catch {
        throw new ChangePasswordApiError(
            "Unable to reach the change password service.",
            {
                kind: "network",
                statusCode: null,
            },
        );
    }

    const responseBody: unknown = await readResponseBody(response);

    if (!response.ok) {
        throw mapErrorResponse(response.status, responseBody);
    }

    if (!isChangePasswordSuccessResponse(responseBody)) {
        throw new ChangePasswordApiError(
            "Change password service returned an invalid success response.",
            {
                kind: "unexpected",
                statusCode: response.status,
            },
        );
    }

    return responseBody;
};

export const ChangePasswordService = {
    changePassword,
};
