// src/services/LogoutService.ts
import {
    LogoutApiError,
    type LogoutSuccessResponse,
    type LogoutUnauthorizedErrorResponse,
} from "../interfaces/LogoutService.interface";
import { getAccessToken } from "../utils/auth";

/**
 * Base URL of the backend API, injected at build time by Vite.
 *
 * The variable must be exposed with the `VITE_` prefix (see `.env`) to be
 * available on `import.meta.env`. An empty string is used as a graceful
 * fallback when the variable is not configured.
 */
const API_BASE_URL: string = import.meta.env.VITE_BASE_URL ?? "";

const LOGOUT_ENDPOINT = "/auth/logout";

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isUnauthorizedErrorResponse = (
    value: unknown,
): value is LogoutUnauthorizedErrorResponse => {
    if (!isObject(value)) {
        return false;
    }
    return value.status === "fail" && typeof value.message === "string";
};

const isLogoutSuccessResponse = (
    value: unknown,
): value is LogoutSuccessResponse => {
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
    return typeof data.message === "string";
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
): LogoutApiError => {
    if (statusCode === 401 && isUnauthorizedErrorResponse(body)) {
        return new LogoutApiError(body.message, {
            kind: "unauthorized",
            statusCode,
        });
    }

    return new LogoutApiError("Logout failed with an unexpected error.", {
        kind: "unexpected",
        statusCode,
    });
};

const logoutUser = async (): Promise<LogoutSuccessResponse> => {
    const url = `${API_BASE_URL}${LOGOUT_ENDPOINT}`;
    const accessToken = getAccessToken();

    let response: Response;
    try {
        response = await fetch(url, {
            method: "POST",
            headers: {
                ...(accessToken !== null
                    ? { Authorization: `Bearer ${accessToken}` }
                    : {}),
            },
            body: null,
        });
    } catch {
        throw new LogoutApiError("Unable to reach the logout service.", {
            kind: "network",
            statusCode: null,
        });
    }

    const responseBody: unknown = await readResponseBody(response);

    if (!response.ok) {
        throw mapErrorResponse(response.status, responseBody);
    }

    if (!isLogoutSuccessResponse(responseBody)) {
        throw new LogoutApiError(
            "Logout service returned an invalid success response.",
            {
                kind: "unexpected",
                statusCode: response.status,
            },
        );
    }

    return responseBody;
};

export const LogoutService = {
    logoutUser,
};
