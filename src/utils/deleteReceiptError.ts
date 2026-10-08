// src/utils/deleteReceiptError.ts
import { DeleteReceiptApiError } from "../interfaces/DeleteReceiptService.interface";

/**
 * Translation keys used to render delete receipt errors. Each key is defined
 * in both `src/locales/es.json` and `src/locales/en.json` under
 * `ReceiptsScreen`.
 */
export type DeleteReceiptErrorKey =
    | "ReceiptsScreen.deleteReceiptErrorUnauthorized"
    | "ReceiptsScreen.deleteReceiptErrorForbidden"
    | "ReceiptsScreen.deleteReceiptErrorNotFound"
    | "ReceiptsScreen.deleteReceiptErrorServer";

/**
 * Maps a delete receipt error to a localized translation key.
 *
 * `DeleteReceiptService` classifies every failure into a structured
 * `DeleteReceiptApiError` whose `kind` encodes the response:
 * - `401` → `unauthorized`
 * - `403` → `forbidden`
 * - `404` → `notFound`
 * - fetch failure → `network`
 * - any other non-2xx → `unexpected`
 *
 * This lets the UI render localized text instead of the raw English message
 * returned by the backend.
 */
export const getDeleteReceiptErrorKey = (
    error: unknown,
): DeleteReceiptErrorKey => {
    if (!(error instanceof DeleteReceiptApiError)) {
        return "ReceiptsScreen.deleteReceiptErrorServer";
    }

    switch (error.kind) {
        case "unauthorized":
            return "ReceiptsScreen.deleteReceiptErrorUnauthorized";
        case "forbidden":
            return "ReceiptsScreen.deleteReceiptErrorForbidden";
        case "notFound":
            return "ReceiptsScreen.deleteReceiptErrorNotFound";
        case "network":
        case "unexpected":
        default:
            return "ReceiptsScreen.deleteReceiptErrorServer";
    }
};
