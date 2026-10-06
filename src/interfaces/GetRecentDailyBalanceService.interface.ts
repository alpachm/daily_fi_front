// src/interfaces/GetRecentDailyBalanceService.interface.ts
import type { DailyBalanceData } from "./DailyBalance.interface";

export type { DailyBalanceData };

/**
 * A single daily balance record returned by the "recent daily balances"
 * endpoint.
 *
 * It is an alias of the shared `DailyBalanceData` model to keep a single
 * source of truth for the daily balance entity while exposing a
 * list-oriented name for this specific endpoint.
 */
export type DailyBalanceItem = DailyBalanceData;

/**
 * Response returned by the API when recent daily balances are retrieved
 * successfully (HTTP 200).
 */
export interface GetRecentDailyBalancesResponse {
    status: "success";
    data: DailyBalanceItem[];
}

/**
 * Response returned by the API for error states that only carry a single
 * message (HTTP 401 Unauthorized).
 */
export interface GetRecentDailyBalancesGenericErrorResponse {
    status: "fail";
    message: string;
}

/**
 * Categories used to classify errors thrown by the recent daily balances
 * service.
 */
export type GetRecentDailyBalancesApiErrorKind =
    | "unauthorized"
    | "network"
    | "unexpected";

/**
 * Structured error thrown by
 * `GetRecentDailyBalanceService.getRecentDailyBalances`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized,
 * user-facing messages instead of rendering `message` directly.
 */
export class GetRecentDailyBalancesApiError extends Error {
    readonly kind: GetRecentDailyBalancesApiErrorKind;
    readonly statusCode: number | null;

    constructor(
        message: string,
        options: {
            kind?: GetRecentDailyBalancesApiErrorKind;
            statusCode?: number | null;
        } = {},
    ) {
        super(message);
        this.name = "GetRecentDailyBalancesApiError";
        this.kind = options.kind ?? "unexpected";
        this.statusCode = options.statusCode ?? null;
    }
}
