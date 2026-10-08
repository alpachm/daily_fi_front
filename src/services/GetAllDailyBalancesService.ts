// src/services/GetAllDailyBalancesService.ts
import {
    GetAllDailyBalancesApiError,
    type DailyBalanceItem,
    type DailyBalanceQueryParams,
    type GetAllDailyBalancesGenericErrorResponse,
    type DailyBalancesResponse,
} from "../interfaces/GetAllDailyBalancesService.interface";
import { getAccessToken } from "../utils/auth";

/**
 * Base URL of the backend API, injected at build time by Vite.
 *
 * The variable must be exposed with the `VITE_` prefix (see `.env`) to be
 * available on `import.meta.env`. An empty string is used as a graceful
 * fallback when the variable is not configured.
 */
const API_BASE_URL: string = import.meta.env.VITE_BASE_URL ?? "";

const GET_ALL_DAILY_BALANCES_ENDPOINT = "/daily-balances";

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isDailyBalanceItem = (value: unknown): value is DailyBalanceItem => {
    if (!isObject(value)) {
        return false;
    }
    return (
        typeof value.id === "number" &&
        typeof value.userId === "number" &&
        typeof value.date === "string" &&
        typeof value.openingBalance === "number" &&
        typeof value.closingBalance === "number" &&
        typeof value.totalIncome === "number" &&
        typeof value.totalExpenses === "number" &&
        (value.notes === null || typeof value.notes === "string") &&
        typeof value.createdAt === "string" &&
        typeof value.updatedAt === "string"
    );
};

const isSuccessResponse = (value: unknown): value is DailyBalancesResponse => {
    if (!isObject(value)) {
        return false;
    }
    if (value.status !== "success") {
        return false;
    }
    return Array.isArray(value.data) && value.data.every(isDailyBalanceItem);
};

const isGenericApiErrorResponse = (
    value: unknown,
): value is GetAllDailyBalancesGenericErrorResponse => {
    if (!isObject(value)) {
        return false;
    }
    return value.status === "fail" && typeof value.message === "string";
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
): GetAllDailyBalancesApiError => {
    if (statusCode === 401 && isGenericApiErrorResponse(body)) {
        return new GetAllDailyBalancesApiError(body.message, {
            kind: "unauthorized",
            statusCode,
        });
    }

    return new GetAllDailyBalancesApiError(
        "Get all daily balances failed with an unexpected error.",
        {
            kind: "unexpected",
            statusCode,
        },
    );
};

const buildQueryString = (params: DailyBalanceQueryParams): string => {
    const searchParams = new URLSearchParams();

    if (params.startDate !== undefined) {
        searchParams.set("startDate", params.startDate);
    }
    if (params.endDate !== undefined) {
        searchParams.set("endDate", params.endDate);
    }
    if (params.page !== undefined) {
        searchParams.set("page", String(params.page));
    }
    if (params.limit !== undefined) {
        searchParams.set("limit", String(params.limit));
    }

    const queryString = searchParams.toString();
    return queryString.length > 0 ? `?${queryString}` : "";
};

export const getAllDailyBalances = async (
    params: DailyBalanceQueryParams = {},
): Promise<DailyBalanceItem[]> => {
    const url = `${API_BASE_URL}${GET_ALL_DAILY_BALANCES_ENDPOINT}${buildQueryString(params)}`;
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
        throw new GetAllDailyBalancesApiError(
            "Unable to reach the get all daily balances service.",
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
        throw new GetAllDailyBalancesApiError(
            "Get all daily balances service returned an invalid success response.",
            {
                kind: "unexpected",
                statusCode: response.status,
            },
        );
    }

    return responseBody.data;
};

export const GetAllDailyBalancesService = {
    getAllDailyBalances,
};
