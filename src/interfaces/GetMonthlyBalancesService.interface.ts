// src/interfaces/GetMonthlyBalancesService.interface.ts

/**
 * Optional query parameters accepted by the "get monthly balances" endpoint
 * to filter and paginate the aggregated monthly results.
 */
export interface MonthlyBalanceQueryParams {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

/**
 * A single aggregated monthly balance record returned by the
 * "get monthly balances" endpoint.
 */
export interface MonthlyBalanceItem {
    id: number;
    userId: number;
    year: number;
    month: number;
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
}

/**
 * Response returned by the API for the "get monthly balances" endpoint.
 *
 * A `status` of `"success"` carries the list of aggregated monthly balances,
 * while `"fail"` signals an error. The concrete failure payload is described
 * by `GetMonthlyBalancesGenericErrorResponse`.
 */
export interface MonthlyBalancesResponse {
    status: "success" | "fail";
    data: MonthlyBalanceItem[];
}

/**
 * Response returned by the API for error states that only carry a single
 * message (HTTP 401 Unauthorized).
 */
export interface GetMonthlyBalancesGenericErrorResponse {
    status: "fail";
    message: string;
}

/**
 * Categories used to classify errors thrown by the get monthly balances
 * service.
 */
export type GetMonthlyBalancesApiErrorKind =
    | "unauthorized"
    | "network"
    | "unexpected";

/**
 * Structured error thrown by `GetMonthlyBalancesService.getMonthlyBalances`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized,
 * user-facing messages instead of rendering `message` directly.
 */
export class GetMonthlyBalancesApiError extends Error {
    readonly kind: GetMonthlyBalancesApiErrorKind;
    readonly statusCode: number | null;

    constructor(
        message: string,
        options: {
            kind?: GetMonthlyBalancesApiErrorKind;
            statusCode?: number | null;
        } = {},
    ) {
        super(message);
        this.name = "GetMonthlyBalancesApiError";
        this.kind = options.kind ?? "unexpected";
        this.statusCode = options.statusCode ?? null;
    }
}
