// src/services/GetYearlyBalancesService.ts
import {
    GetYearlyBalancesApiError,
    type GetYearlyBalancesGenericErrorResponse,
    type YearlyBalanceItem,
    type YearlyBalanceQueryParams,
    type YearlyBalancesResponse,
} from "../interfaces/GetYearlyBalancesService.interface";
import { performApiFetch } from "./httpClient";

/**
 * Base URL of the backend API, injected at build time by Vite.
 *
 * The variable must be exposed with the `VITE_` prefix (see `.env`) to be
 * available on `import.meta.env`. An empty string is used as a graceful
 * fallback when the variable is not configured.
 */
const API_BASE_URL: string = import.meta.env.VITE_BASE_URL ?? "";

const GET_YEARLY_BALANCES_ENDPOINT = "/daily-balances/yearly";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isYearlyBalanceItem = (value: unknown): value is YearlyBalanceItem => {
    if (!isObject(value)) {
        return false;
    }
    return (
        typeof value.id === "number" &&
        typeof value.userId === "number" &&
        typeof value.year === "number" &&
        typeof value.openingBalance === "number" &&
        typeof value.closingBalance === "number" &&
        typeof value.totalIncome === "number" &&
        typeof value.totalExpenses === "number" &&
        typeof value.netProfit === "number"
    );
};

const isSuccessResponse = (value: unknown): value is YearlyBalancesResponse => {
    if (!isObject(value)) {
        return false;
    }
    if (value.status !== "success") {
        return false;
    }
    return Array.isArray(value.data) && value.data.every(isYearlyBalanceItem);
};

const isGenericApiErrorResponse = (
    value: unknown,
): value is GetYearlyBalancesGenericErrorResponse => {
    if (!isObject(value)) {
        return false;
    }
    return value.status === "fail" && typeof value.message === "string";
};

const mapErrorResponse = (
    statusCode: number,
    body: unknown,
): GetYearlyBalancesApiError => {
    if (statusCode === 401 && isGenericApiErrorResponse(body)) {
        return new GetYearlyBalancesApiError(body.message, {
            kind: "unauthorized",
            statusCode,
        });
    }

    return new GetYearlyBalancesApiError(
        "Get yearly balances failed with an unexpected error.",
        {
            kind: "unexpected",
            statusCode,
        },
    );
};

const buildQueryString = (params: YearlyBalanceQueryParams): string => {
    const searchParams = new URLSearchParams();

    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;

    searchParams.set("page", String(page));
    searchParams.set("limit", String(limit));

    const queryString = searchParams.toString();
    return queryString.length > 0 ? `?${queryString}` : "";
};

export const getYearlyBalances = async (
    params: YearlyBalanceQueryParams = {},
): Promise<YearlyBalanceItem[]> => {
    const url = `${API_BASE_URL}${GET_YEARLY_BALANCES_ENDPOINT}${buildQueryString(params)}`;
    const result = await performApiFetch(url, { method: "GET" });
    if (!result.ok) {
        throw new GetYearlyBalancesApiError(
            "Unable to reach the get yearly balances service.",
            {
                kind: "network",
                statusCode: null,
            },
        );
    }

    const response = result.response;
    const responseBody = result.body;

    if (!response.ok) {
        throw mapErrorResponse(response.status, responseBody);
    }

    if (!isSuccessResponse(responseBody)) {
        throw new GetYearlyBalancesApiError(
            "Get yearly balances service returned an invalid success response.",
            {
                kind: "unexpected",
                statusCode: response.status,
            },
        );
    }

    return responseBody.data;
};

export const GetYearlyBalancesService = {
    getYearlyBalances,
};
