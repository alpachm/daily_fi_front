// src/services/CreateDailyBalanceService.ts
import {
    CreateDailyBalanceApiError,
    type CreateDailyBalanceConflictErrorResponse,
    type CreateDailyBalanceFieldError,
    type CreateDailyBalancePayload,
    type CreateDailyBalanceSuccessResponse,
    type CreateDailyBalanceUnauthorizedErrorResponse,
    type CreateDailyBalanceValidationErrorResponse,
} from "../interfaces/CreateDailyBalanceService.interface";
import { getAccessToken } from "../utils/auth";

/**
 * Base URL of the backend API, injected at build time by Vite.
 *
 * The variable must be exposed with the `VITE_` prefix (see `.env`) to be
 * available on `import.meta.env`. An empty string is used as a graceful
 * fallback when the variable is not configured.
 */
const API_BASE_URL: string = import.meta.env.VITE_BASE_URL ?? "";

const CREATE_DAILY_BALANCE_ENDPOINT = "/daily-balances";

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isFieldError = (value: unknown): value is CreateDailyBalanceFieldError => {
    if (!isObject(value)) {
        return false;
    }
    return typeof value.field === "string" && typeof value.message === "string";
};

const isValidationErrorResponse = (
    value: unknown,
): value is CreateDailyBalanceValidationErrorResponse => {
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
): value is CreateDailyBalanceUnauthorizedErrorResponse => {
    if (!isObject(value)) {
        return false;
    }
    return value.status === "fail" && typeof value.message === "string";
};

const isConflictErrorResponse = (
    value: unknown,
): value is CreateDailyBalanceConflictErrorResponse => {
    if (!isObject(value)) {
        return false;
    }
    return value.status === "fail" && typeof value.message === "string";
};

const isCreateDailyBalanceSuccessResponse = (
    value: unknown,
): value is CreateDailyBalanceSuccessResponse => {
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
    return (
        typeof data.id === "number" &&
        typeof data.userId === "number" &&
        typeof data.date === "string"
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
): CreateDailyBalanceApiError => {
    if (statusCode === 400 && isValidationErrorResponse(body)) {
        return new CreateDailyBalanceApiError(body.message, {
            kind: "validation",
            statusCode,
            fieldErrors: body.errors,
        });
    }

    if (statusCode === 401 && isUnauthorizedErrorResponse(body)) {
        return new CreateDailyBalanceApiError(body.message, {
            kind: "unauthorized",
            statusCode,
        });
    }

    if (statusCode === 409 && isConflictErrorResponse(body)) {
        return new CreateDailyBalanceApiError(body.message, {
            kind: "conflict",
            statusCode,
        });
    }

    return new CreateDailyBalanceApiError(
        "Create daily balance failed with an unexpected error.",
        {
            kind: "unexpected",
            statusCode,
        },
    );
};

export const createDailyBalance = async (
    payload: CreateDailyBalancePayload,
): Promise<CreateDailyBalanceSuccessResponse> => {
    const url = `${API_BASE_URL}${CREATE_DAILY_BALANCE_ENDPOINT}`;
    const accessToken = getAccessToken();

    let response: Response;
    try {
        response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(accessToken !== null
                    ? { Authorization: `Bearer ${accessToken}` }
                    : {}),
            },
            body: JSON.stringify(payload),
        });
    } catch {
        throw new CreateDailyBalanceApiError(
            "Unable to reach the create daily balance service.",
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

    if (!isCreateDailyBalanceSuccessResponse(responseBody)) {
        throw new CreateDailyBalanceApiError(
            "Create daily balance service returned an invalid success response.",
            {
                kind: "unexpected",
                statusCode: response.status,
            },
        );
    }

    return responseBody;
};

export const CreateDailyBalanceService = {
    createDailyBalance,
};
