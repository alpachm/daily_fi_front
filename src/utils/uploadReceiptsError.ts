// src/utils/uploadReceiptsError.ts
import { UploadReceiptsApiError } from "../interfaces/UploadReceiptsService.interface";

/**
 * Translation keys used to render upload receipts errors. Each key is defined
 * in both `src/locales/es.json` and `src/locales/en.json` under
 * `ReceiptsScreen`.
 */
export type UploadReceiptsErrorKey =
    | "ReceiptsScreen.uploadModalErrorNotFound"
    | "ReceiptsScreen.uploadModalErrorNoFiles"
    | "ReceiptsScreen.uploadModalErrorFileType"
    | "ReceiptsScreen.uploadModalErrorUnauthorized"
    | "ReceiptsScreen.uploadModalErrorServer";

/**
 * Maps an upload receipts error to a localized translation key.
 *
 * `UploadReceiptsService` classifies every HTTP failure into a structured
 * `UploadReceiptsApiError` whose `kind` encodes the response status code:
 * - `404` → `notFound`
 * - `400` → `validation` (no files provided)
 * - `415` → `unsupportedMediaType`
 * - `401` → `unauthorized`
 * - fetch failure → `network`
 * - any other non-2xx → `unexpected`
 *
 * This lets the UI render localized text instead of the raw English message
 * returned by the backend.
 */
export const getUploadReceiptsErrorKey = (
    error: unknown,
): UploadReceiptsErrorKey => {
    if (!(error instanceof UploadReceiptsApiError)) {
        return "ReceiptsScreen.uploadModalErrorServer";
    }

    switch (error.kind) {
        case "notFound":
            return "ReceiptsScreen.uploadModalErrorNotFound";
        case "validation":
            return "ReceiptsScreen.uploadModalErrorNoFiles";
        case "unsupportedMediaType":
            return "ReceiptsScreen.uploadModalErrorFileType";
        case "unauthorized":
            return "ReceiptsScreen.uploadModalErrorUnauthorized";
        case "network":
        case "unexpected":
        default:
            return "ReceiptsScreen.uploadModalErrorServer";
    }
};
