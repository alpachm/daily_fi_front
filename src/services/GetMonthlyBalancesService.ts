// src/services/GetMonthlyBalancesService.ts
import {
    GetMonthlyBalancesApiError,
    type GetMonthlyBalancesGenericErrorResponse,
    type MonthlyBalanceItem,
    type MonthlyBalanceQueryParams,
    type MonthlyBalancesResponse,
} from "../interfaces/GetMonthlyBalancesService.interface";
import { getAccessToken } from "../utils/auth";

/**
 * Base URL of the backend API, injected at build time by Vite.
 *
 * The variable must be exposed with the `VITE_` prefix (see `.env`) to be
 * available on `import.meta.env`. An empty string is used as a graceful
 * fallback when the variable is not configured.
 */
const API_BASE_URL: string = import.meta.env.VITE_BASE_URL ?? "";

const GET_MONTHLY_BALANCES_ENDPOINT = "/daily-balances/monthly";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isMonthlyBalanceItem = (value: unknown): value is MonthlyBalanceItem => {
    if (!isObject(value)) {
        return false;
    }
    return (
        typeof value.id === "number" &&
        typeof value.userId === "number" &&
        typeof value.year === "number" &&
        typeof value.month === "number" &&
        typeof value.totalIncome === "number" &&
        typeof value.totalExpenses === "number" &&
        typeof value.netProfit === "number"
    );
};

const isSuccessResponse = (value: unknown): value is MonthlyBalancesResponse => {
    if (!isObject(value)) {
        return false;
    }
    if (value.status !== "success") {
        return false;
    }
    return Array.isArray(value.data) && value.data.every(isMonthlyBalanceItem);
};

const isGenericApiErrorResponse = (
    value: unknown,
): value is GetMonthlyBalancesGenericErrorResponse => {
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
): GetMonthlyBalancesApiError => {
    if (statusCode === 401 && isGenericApiErrorResponse(body)) {
        return new GetMonthlyBalancesApiError(body.message, {
            kind: "unauthorized",
            statusCode,
        });
    }

    return new GetMonthlyBalancesApiError(
        "Get monthly balances failed with an unexpected error.",
        {
            kind: "unexpected",
            statusCode,
        },
    );
};

const buildQueryString = (params: MonthlyBalanceQueryParams): string => {
    const searchParams = new URLSearchParams();

    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;

    if (params.startDate !== undefined) {
        searchParams.set("startDate", params.startDate);
    }
    if (params.endDate !== undefined) {
        searchParams.set("endDate", params.endDate);
    }
    searchParams.set("page", String(page));
    searchParams.set("limit", String(limit));

    const queryString = searchParams.toString();
    return queryString.length > 0 ? `?${queryString}` : "";
};

export const getMonthlyBalances = async (
    params: MonthlyBalanceQueryParams = {},
): Promise<MonthlyBalanceItem[]> => {
    const url = `${API_BASE_URL}${GET_MONTHLY_BALANCES_ENDPOINT}${buildQueryString(params)}`;
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
        throw new GetMonthlyBalancesApiError(
            "Unable to reach the get monthly balances service.",
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
        throw new GetMonthlyBalancesApiError(
            "Get monthly balances service returned an invalid success response.",
            {
                kind: "unexpected",
                statusCode: response.status,
            },
        );
    }

    return responseBody.data;
};

export const GetMonthlyBalancesService = {
    getMonthlyBalances,
};
