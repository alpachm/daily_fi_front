// src/services/GetBalancePerDayService.ts
import {
    GetBalancePerDayApiError,
    type DailyBalanceData,
    type GenericApiErrorResponse,
    type GetBalancePerDaySuccessResponse,
    type GetBalancePerDayValidationError,
    type ValidationErrorItem,
} from "../interfaces/GetBalancePerDayService.interface";
import { getAccessToken } from "../utils/auth";

/**
 * Base URL of the backend API, injected at build time by Vite.
 *
 * The variable must be exposed with the `VITE_` prefix (see `.env`) to be
 * available on `import.meta.env`. An empty string is used as a graceful
 * fallback when the variable is not configured.
 */
const API_BASE_URL: string = import.meta.env.VITE_BASE_URL ?? "";

const GET_BALANCE_PER_DAY_ENDPOINT = "/daily-balances";

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isValidationErrorItem = (value: unknown): value is ValidationErrorItem => {
    if (!isObject(value)) {
        return false;
    }
    return typeof value.field === "string" && typeof value.message === "string";
};

const isValidationErrorResponse = (
    value: unknown,
): value is GetBalancePerDayValidationError => {
    if (!isObject(value)) {
        return false;
    }
    if (value.status !== "fail" || typeof value.message !== "string") {
        return false;
    }
    const errors: unknown = value.errors;
    return Array.isArray(errors) && errors.every(isValidationErrorItem);
};

const isGenericApiErrorResponse = (
    value: unknown,
): value is GenericApiErrorResponse => {
    if (!isObject(value)) {
        return false;
    }
    return value.status === "fail" && typeof value.message === "string";
};

const isSuccessResponse = (
    value: unknown,
): value is GetBalancePerDaySuccessResponse => {
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
): GetBalancePerDayApiError => {
    if (statusCode === 400 && isValidationErrorResponse(body)) {
        return new GetBalancePerDayApiError(body.message, {
            kind: "validation",
            statusCode,
            fieldErrors: body.errors,
        });
    }

    if (statusCode === 401 && isGenericApiErrorResponse(body)) {
        return new GetBalancePerDayApiError(body.message, {
            kind: "unauthorized",
            statusCode,
        });
    }

    return new GetBalancePerDayApiError(
        "Get balance per day failed with an unexpected error.",
        {
            kind: "unexpected",
            statusCode,
        },
    );
};

export const getBalancePerDay = async (
    date: string,
): Promise<DailyBalanceData | null> => {
    const url = `${API_BASE_URL}${GET_BALANCE_PER_DAY_ENDPOINT}?date=${encodeURIComponent(date)}`;
    const accessToken = getAccessToken();

    let response: Response;
    try {
        response = await fetch(url, {
            method: "GET",
            headers: {
                ...(accessToken !== null
                    ? { Authorization: `Bearer ${accessToken}` }
                    : {}),
            },
        });
    } catch {
        throw new GetBalancePerDayApiError(
            "Unable to reach the get balance per day service.",
            {
                kind: "network",
                statusCode: null,
            },
        );
    }

    const responseBody: unknown = await readResponseBody(response);

    // A 404 means no balance has been created for this date yet. It is not an
    // error condition; callers treat `null` as "nothing to show".
    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw mapErrorResponse(response.status, responseBody);
    }

    if (!isSuccessResponse(responseBody)) {
        throw new GetBalancePerDayApiError(
            "Get balance per day service returned an invalid success response.",
            {
                kind: "unexpected",
                statusCode: response.status,
            },
        );
    }

    return responseBody.data;
};

export const GetBalancePerDayService = {
    getBalancePerDay,
};
