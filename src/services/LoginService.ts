// src/services/LoginService.ts
import {
    LoginApiError,
    type LoginFieldError,
    type LoginRequest,
    type LoginSuccessResponse,
    type LoginUnauthorizedErrorResponse,
    type LoginValidationErrorResponse,
} from "../interfaces/LoginService.interface";

/**
 * Base URL of the backend API, injected at build time by Vite.
 *
 * The variable must be exposed with the `VITE_` prefix (see `.env`) to be
 * available on `import.meta.env`. An empty string is used as a graceful
 * fallback when the variable is not configured.
 */
const API_BASE_URL: string = import.meta.env.VITE_BASE_URL ?? "";

const LOGIN_ENDPOINT = "/auth/login";

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isFieldError = (value: unknown): value is LoginFieldError => {
    if (!isObject(value)) {
        return false;
    }
    return typeof value.field === "string" && typeof value.message === "string";
};

const isValidationErrorResponse = (
    value: unknown,
): value is LoginValidationErrorResponse => {
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
): value is LoginUnauthorizedErrorResponse => {
    if (!isObject(value)) {
        return false;
    }
    return value.status === "fail" && typeof value.message === "string";
};

const isLoginSuccessResponse = (
    value: unknown,
): value is LoginSuccessResponse => {
    if (!isObject(value)) {
        return false;
    }
    if (value.status !== "success") {
        return false;
    }
    const data: unknown = value.data;
    if (!isObject(data)) {
        return false;
    }
    if (typeof data.token !== "string") {
        return false;
    }
    const user: unknown = data.user;
    if (!isObject(user)) {
        return false;
    }
    return typeof user.id === "number" && typeof user.email === "string";
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
): LoginApiError => {
    if (statusCode === 400 && isValidationErrorResponse(body)) {
        return new LoginApiError(body.message, {
            kind: "validation",
            statusCode,
            fieldErrors: body.errors,
        });
    }

    if (statusCode === 401 && isUnauthorizedErrorResponse(body)) {
        return new LoginApiError(body.message, {
            kind: "unauthorized",
            statusCode,
        });
    }

    return new LoginApiError("Login failed with an unexpected error.", {
        kind: "unexpected",
        statusCode,
    });
};

const loginUser = async (
    payload: LoginRequest,
): Promise<LoginSuccessResponse> => {
    const url = `${API_BASE_URL}${LOGIN_ENDPOINT}`;

    let response: Response;
    try {
        response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
    } catch {
        throw new LoginApiError("Unable to reach the login service.", {
            kind: "network",
            statusCode: null,
        });
    }

    const responseBody: unknown = await readResponseBody(response);

    if (!response.ok) {
        throw mapErrorResponse(response.status, responseBody);
    }

    if (!isLoginSuccessResponse(responseBody)) {
        throw new LoginApiError(
            "Login service returned an invalid success response.",
            {
                kind: "unexpected",
                statusCode: response.status,
            },
        );
    }

    return responseBody;
};

export const LoginService = {
    loginUser,
};
