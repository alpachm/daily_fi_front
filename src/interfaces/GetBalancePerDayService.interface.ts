// src/interfaces/GetBalancePerDayService.interface.ts
import type { DailyBalanceData } from "./DailyBalance.interface";

export type { DailyBalanceData };

/**
 * Response returned by the API when a daily balance exists for the requested
 * date (HTTP 200).
 */
export interface GetBalancePerDaySuccessResponse {
    status: "success";
    data: DailyBalanceData;
}

/**
 * Response returned by the API when the request fails.
 *
 * It covers every documented error contract for this endpoint (HTTP 401, 403
 * and 404), since all of them share the same payload shape.
 */
export interface GetBalancePerDayFailResponse {
    status: "fail";
    message: string;
}

/**
 * Categories used to classify errors thrown by the get balance per day
 * service.
 */
export type GetBalancePerDayApiErrorKind =
    | "unauthorized"
    | "forbidden"
    | "network"
    | "unexpected";

/**
 * Structured error thrown by `GetBalancePerDayService.getBalancePerDay`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized,
 * user-facing messages instead of rendering `message` directly.
 */
export class GetBalancePerDayApiError extends Error {
    readonly kind: GetBalancePerDayApiErrorKind;
    readonly statusCode: number | null;

    constructor(
        message: string,
        options: {
            kind?: GetBalancePerDayApiErrorKind;
            statusCode?: number | null;
        } = {},
    ) {
        super(message);
        this.name = "GetBalancePerDayApiError";
        this.kind = options.kind ?? "unexpected";
        this.statusCode = options.statusCode ?? null;
    }
}
