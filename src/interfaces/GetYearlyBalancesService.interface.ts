// src/interfaces/GetYearlyBalancesService.interface.ts

/**
 * Optional query parameters accepted by the "get yearly balances" endpoint
 * to paginate the aggregated yearly results.
 */
export interface YearlyBalanceQueryParams {
    page?: number;
    limit?: number;
}

/**
 * A single aggregated yearly balance record returned by the
 * "get yearly balances" endpoint.
 */
export interface YearlyBalanceItem {
    id: number;
    userId: number;
    year: number;
    openingBalance: number;
    closingBalance: number;
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
}

/**
 * Response returned by the API for the "get yearly balances" endpoint.
 *
 * A `status` of `"success"` carries the list of aggregated yearly balances,
 * while `"fail"` signals an error. The concrete failure payload is described
 * by `GetYearlyBalancesGenericErrorResponse`.
 */
export interface YearlyBalancesResponse {
    status: "success" | "fail";
    data: YearlyBalanceItem[];
}

/**
 * Response returned by the API for error states that only carry a single
 * message (HTTP 401 Unauthorized).
 */
export interface GetYearlyBalancesGenericErrorResponse {
    status: "fail";
    message: string;
}

/**
 * Categories used to classify errors thrown by the get yearly balances
 * service.
 */
export type GetYearlyBalancesApiErrorKind =
    | "unauthorized"
    | "network"
    | "unexpected";

/**
 * Structured error thrown by `GetYearlyBalancesService.getYearlyBalances`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized,
 * user-facing messages instead of rendering `message` directly.
 */
export class GetYearlyBalancesApiError extends Error {
    readonly kind: GetYearlyBalancesApiErrorKind;
    readonly statusCode: number | null;

    constructor(
        message: string,
        options: {
            kind?: GetYearlyBalancesApiErrorKind;
            statusCode?: number | null;
        } = {},
    ) {
        super(message);
        this.name = "GetYearlyBalancesApiError";
        this.kind = options.kind ?? "unexpected";
        this.statusCode = options.statusCode ?? null;
    }
}
