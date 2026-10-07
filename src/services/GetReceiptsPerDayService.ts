// src/services/GetReceiptsPerDayService.ts
import {
    GetReceiptsPerDayApiError,
    type GetReceiptsPerDayFieldError,
    type GetReceiptsPerDayGenericErrorResponse,
    type GetReceiptsPerDayResponse,
    type GetReceiptsPerDayResponseData,
    type GetReceiptsPerDayValidationError,
    type ReceiptItem,
} from "../interfaces/GetReceiptsPerDayService.interface";
import { getAccessToken } from "../utils/auth";

/**
 * Base URL of the backend API, injected at build time by Vite.
 *
 * The variable must be exposed with the `VITE_` prefix (see `.env`) to be
 * available on `import.meta.env`. An empty string is used as a graceful
 * fallback when the variable is not configured.
 */
const API_BASE_URL: string = import.meta.env.VITE_BASE_URL ?? "";

const GET_RECEIPTS_PER_DAY_ENDPOINT = "/receipts/day";

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isReceiptItem = (value: unknown): value is ReceiptItem => {
    if (!isObject(value)) {
        return false;
    }
    return (
        typeof value.id === "number" &&
        typeof value.userId === "number" &&
        typeof value.dailyBalanceId === "number" &&
        typeof value.fileUrl === "string" &&
        (value.type === "PURCHASE" || value.type === "SALE") &&
        typeof value.date === "string" &&
        (value.description === null || typeof value.description === "string") &&
        (value.category === null || typeof value.category === "string") &&
        typeof value.createdAt === "string" &&
        typeof value.updatedAt === "string"
    );
};

const isFieldError = (value: unknown): value is GetReceiptsPerDayFieldError => {
    if (!isObject(value)) {
        return false;
    }
    return typeof value.field === "string" && typeof value.message === "string";
};

const isValidationErrorResponse = (
    value: unknown,
): value is GetReceiptsPerDayValidationError => {
    if (!isObject(value)) {
        return false;
    }
    if (value.status !== "fail" || typeof value.message !== "string") {
        return false;
    }
    const errors: unknown = value.errors;
    return Array.isArray(errors) && errors.every(isFieldError);
};

const isGenericApiErrorResponse = (
    value: unknown,
): value is GetReceiptsPerDayGenericErrorResponse => {
    if (!isObject(value)) {
        return false;
    }
    return value.status === "fail" && typeof value.message === "string";
};

const isSuccessResponse = (
    value: unknown,
): value is GetReceiptsPerDayResponse => {
    if (!isObject(value)) {
        return false;
    }
    if (value.status !== "success" || typeof value.message !== "string") {
        return false;
    }
    const data: unknown = value.data;
    if (!isObject(data)) {
        return false;
    }
    return (
        typeof data.date === "string" &&
        typeof data.count === "number" &&
        Array.isArray(data.receipts) &&
        data.receipts.every(isReceiptItem)
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
): GetReceiptsPerDayApiError => {
    if (statusCode === 400 && isValidationErrorResponse(body)) {
        return new GetReceiptsPerDayApiError(body.message, {
            kind: "validation",
            statusCode,
            fieldErrors: body.errors,
        });
    }

    if (statusCode === 401 && isGenericApiErrorResponse(body)) {
        return new GetReceiptsPerDayApiError(body.message, {
            kind: "unauthorized",
            statusCode,
        });
    }

    return new GetReceiptsPerDayApiError(
        "Get receipts per day failed with an unexpected error.",
        {
            kind: "unexpected",
            statusCode,
        },
    );
};

export const getReceiptsPerDay = async (
    date: string,
): Promise<GetReceiptsPerDayResponseData> => {
    const url = `${API_BASE_URL}${GET_RECEIPTS_PER_DAY_ENDPOINT}?date=${encodeURIComponent(date)}`;
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
        throw new GetReceiptsPerDayApiError(
            "Unable to reach the get receipts per day service.",
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

    if (!isSuccessResponse(responseBody)) {
        throw new GetReceiptsPerDayApiError(
            "Get receipts per day service returned an invalid success response.",
            {
                kind: "unexpected",
                statusCode: response.status,
            },
        );
    }

    return responseBody.data;
};

export const GetReceiptsPerDayService = {
    getReceiptsPerDay,
};
