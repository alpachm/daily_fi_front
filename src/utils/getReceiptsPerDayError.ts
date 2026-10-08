// src/utils/getReceiptsPerDayError.ts
import { GetReceiptsPerDayApiError } from "../interfaces/GetReceiptsPerDayService.interface";

/**
 * Translation keys used to render "get receipts per day" errors. Each key is
 * defined in both `src/locales/es.json` and `src/locales/en.json` under
 * `ReceiptsScreen`.
 */
export type ReceiptsPerDayErrorKey =
    | "ReceiptsScreen.tableErrorValidation"
    | "ReceiptsScreen.tableErrorUnauthorized"
    | "ReceiptsScreen.tableErrorNetwork"
    | "ReceiptsScreen.tableErrorServer";

/**
 * Maps a "get receipts per day" error to a localized translation key.
 *
 * `GetReceiptsPerDayService` classifies every failure into a structured
 * `GetReceiptsPerDayApiError` whose `kind` encodes the response:
 * - `400` → `validation`
 * - `401` → `unauthorized`
 * - fetch failure → `network`
 * - any other non-2xx (e.g. `500`) → `unexpected`
 *
 * This lets the UI render localized text instead of the raw English message
 * returned by the backend.
 */
export const getReceiptsPerDayErrorKey = (
    error: unknown,
): ReceiptsPerDayErrorKey => {
    if (!(error instanceof GetReceiptsPerDayApiError)) {
        return "ReceiptsScreen.tableErrorServer";
    }

    switch (error.kind) {
        case "validation":
            return "ReceiptsScreen.tableErrorValidation";
        case "unauthorized":
            return "ReceiptsScreen.tableErrorUnauthorized";
        case "network":
            return "ReceiptsScreen.tableErrorNetwork";
        case "unexpected":
        default:
            return "ReceiptsScreen.tableErrorServer";
    }
};
