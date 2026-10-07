// src/interfaces/GetAllDailyBalancesService.interface.ts

/**
 * Optional query parameters accepted by the "get all daily balances" endpoint
 * to filter and paginate the results.
 */
export interface DailyBalanceQueryParams {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

/**
 * A single daily balance record returned by the "get all daily balances"
 * endpoint.
 */
export interface DailyBalanceItem {
    id: number;
    userId: number;
    date: string;
    openingBalance: number;
    closingBalance: number;
    totalIncome: number;
    totalExpenses: number;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Response returned by the API for the "get all daily balances" endpoint.
 *
 * A `status` of `"success"` carries the list of daily balances, while
 * `"fail"` signals an error. The concrete failure payload is described by
 * `GetAllDailyBalancesGenericErrorResponse`.
 */
export interface DailyBalancesResponse {
    status: "success" | "fail";
    data: DailyBalanceItem[];
}

/**
 * Response returned by the API for error states that only carry a single
 * message (HTTP 401 Unauthorized).
 */
export interface GetAllDailyBalancesGenericErrorResponse {
    status: "fail";
    message: string;
}

/**
 * Categories used to classify errors thrown by the get all daily balances
 * service.
 */
export type GetAllDailyBalancesApiErrorKind =
    | "unauthorized"
    | "network"
    | "unexpected";

/**
 * Structured error thrown by
 * `GetAllDailyBalancesService.getAllDailyBalances`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized,
 * user-facing messages instead of rendering `message` directly.
 */
export class GetAllDailyBalancesApiError extends Error {
    readonly kind: GetAllDailyBalancesApiErrorKind;
    readonly statusCode: number | null;

    constructor(
        message: string,
        options: {
            kind?: GetAllDailyBalancesApiErrorKind;
            statusCode?: number | null;
        } = {},
    ) {
        super(message);
        this.name = "GetAllDailyBalancesApiError";
        this.kind = options.kind ?? "unexpected";
        this.statusCode = options.statusCode ?? null;
    }
}
