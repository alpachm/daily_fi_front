// src/hooks/useReceiptsUploadError.ts
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { UploadReceiptsApiError } from "../interfaces/UploadReceiptsService.interface";
import { getUploadReceiptsErrorKey } from "../utils/uploadReceiptsError";

/**
 * Alert shape consumed by the receipts upload UI.
 */
export interface UploadReceiptsError {
    /** Localized, user-facing error message for the active language. */
    message: string;
    /** Visual tone for the notification. */
    variant: "error" | "warning";
}

export type TranslateUploadReceiptsError = (
    error: unknown,
) => UploadReceiptsError;

/**
 * Returns a function that maps an upload error to a localized alert.
 *
 * It relies on `getUploadReceiptsErrorKey` to classify the error (which is
 * derived from the HTTP status code by `UploadReceiptsService`) and resolves
 * the corresponding translation key against the active language.
 */
export const useReceiptsUploadError = (): TranslateUploadReceiptsError => {
    const { t } = useTranslation("");

    return useCallback(
        (error: unknown): UploadReceiptsError => {
            const isNotFound =
                error instanceof UploadReceiptsApiError &&
                error.kind === "notFound";

            return {
                message: t(getUploadReceiptsErrorKey(error)),
                variant: isNotFound ? "warning" : "error",
            };
        },
        [t],
    );
};

export default useReceiptsUploadError;
