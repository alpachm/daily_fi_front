// src/services/UpdateDailyBalanceService.ts
import {
    UpdateDailyBalanceApiError,
    type UpdateDailyBalanceFieldError,
    type UpdateDailyBalanceGenericErrorResponse,
    type UpdateDailyBalancePayload,
    type UpdateDailyBalanceSuccessResponse,
    type UpdateDailyBalanceValidationErrorResponse,
} from "../interfaces/UpdateDailyBalanceService.interface";
import { getAccessToken } from "../utils/auth";

/**
 * Base URL of the backend API, injected at build time by Vite.
 *
 * The variable must be exposed with the `VITE_` prefix (see `.env`) to be
 * available on `import.meta.env`. An empty string is used as a graceful
 * fallback when the variable is not configured.
 */
const API_BASE_URL: string = import.meta.env.VITE_BASE_URL ?? "";

const updateDailyBalanceEndpoint = (id: number): string =>
    `/daily-balances/${id}`;

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isFieldError = (value: unknown): value is UpdateDailyBalanceFieldError => {
    if (!isObject(value)) {
        return false;
    }
    return typeof value.field === "string" && typeof value.message === "string";
};

const isValidationErrorResponse = (
    value: unknown,
): value is UpdateDailyBalanceValidationErrorResponse => {
    if (!isObject(value)) {
        return false;
    }
    if (value.status !== "fail" || typeof value.message !== "string") {
        return false;
    }
    const errors: unknown = value.errors;
    return Array.isArray(errors) && errors.every(isFieldError);
};

const isGenericErrorResponse = (
    value: unknown,
): value is UpdateDailyBalanceGenericErrorResponse => {
    if (!isObject(value)) {
        return false;
    }
    return value.status === "fail" && typeof value.message === "string";
};

const isUpdateDailyBalanceSuccessResponse = (
    value: unknown,
): value is UpdateDailyBalanceSuccessResponse => {
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
        typeof data.date === "string" &&
        typeof data.openingBalance === "number" &&
        typeof data.closingBalance === "number" &&
        typeof data.totalIncome === "number" &&
        typeof data.totalExpenses === "number" &&
        (data.notes === null || typeof data.notes === "string") &&
        typeof data.createdAt === "string" &&
        typeof data.updatedAt === "string"
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
): UpdateDailyBalanceApiError => {
    if (statusCode === 400 && isValidationErrorResponse(body)) {
        return new UpdateDailyBalanceApiError(body.message, {
            kind: "validation",
            statusCode,
            fieldErrors: body.errors,
        });
    }

    if (statusCode === 401 && isGenericErrorResponse(body)) {
        return new UpdateDailyBalanceApiError(body.message, {
            kind: "unauthorized",
            statusCode,
        });
    }

    if (statusCode === 403 && isGenericErrorResponse(body)) {
        return new UpdateDailyBalanceApiError(body.message, {
            kind: "forbidden",
            statusCode,
        });
    }

    if (statusCode === 404 && isGenericErrorResponse(body)) {
        return new UpdateDailyBalanceApiError(body.message, {
            kind: "notFound",
            statusCode,
        });
    }

    return new UpdateDailyBalanceApiError(
        "Update daily balance failed with an unexpected error.",
        {
            kind: "unexpected",
            statusCode,
        },
    );
};

export const updateDailyBalance = async (
    id: number,
    payload: UpdateDailyBalancePayload,
): Promise<UpdateDailyBalanceSuccessResponse> => {
    const url = `${API_BASE_URL}${updateDailyBalanceEndpoint(id)}`;
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
        throw new UpdateDailyBalanceApiError(
            "Unable to reach the update daily balance service.",
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

    if (!isUpdateDailyBalanceSuccessResponse(responseBody)) {
        throw new UpdateDailyBalanceApiError(
            "Update daily balance service returned an invalid success response.",
            {
                kind: "unexpected",
                statusCode: response.status,
            },
        );
    }

    return responseBody;
};

export const UpdateDailyBalanceService = {
    updateDailyBalance,
};
