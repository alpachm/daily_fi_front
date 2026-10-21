// src/utils/changePasswordError.ts
import { ChangePasswordApiError } from "../interfaces/ChangePasswordService.interface";

/**
 * Translation keys used to render change-password errors. Each key is defined
 * in both `src/locales/es.json` and `src/locales/en.json` under
 * `ProfileScreen`.
 */
export type ChangePasswordErrorKey =
    | "ProfileScreen.securityUpdatePasswordErrorValidation"
    | "ProfileScreen.securityUpdatePasswordErrorIncorrectPassword"
    | "ProfileScreen.securityUpdatePasswordErrorNetwork"
    | "ProfileScreen.securityUpdatePasswordErrorServer";

/**
 * Maps a change-password error to a localized translation key.
 *
 * `ChangePasswordService` classifies every failure into a structured
 * `ChangePasswordApiError` whose `kind` encodes the response:
 * - `400` validation → `validation`
 * - `401` wrong current password → `incorrectPassword`
 * - `401` missing/invalid token → `unauthorized`
 * - fetch failure → `network`
 * - any other non-2xx → `unexpected`
 *
 * The `unauthorized` kind falls back to the server-error key here because the
 * component already skips rendering an alert for it: the service triggers the
 * global session-expiry redirect and notification for that case.
 */
export const getChangePasswordErrorKey = (
    error: unknown,
): ChangePasswordErrorKey => {
    if (!(error instanceof ChangePasswordApiError)) {
        return "ProfileScreen.securityUpdatePasswordErrorServer";
    }

    switch (error.kind) {
        case "validation":
            return "ProfileScreen.securityUpdatePasswordErrorValidation";
        case "incorrectPassword":
            return "ProfileScreen.securityUpdatePasswordErrorIncorrectPassword";
        case "network":
            return "ProfileScreen.securityUpdatePasswordErrorNetwork";
        case "unauthorized":
        case "unexpected":
        default:
            return "ProfileScreen.securityUpdatePasswordErrorServer";
    }
};

/**
 * Returns the specific field-level message when the backend rejected the
 * request with a 400 validation payload (for example, "New password cannot be
 * the same as the current password"), or `null` when no field message is
 * available and the caller should fall back to a localized generic error.
 */
export const getChangePasswordFieldErrorMessage = (
    error: unknown,
): string | null => {
    if (!(error instanceof ChangePasswordApiError)) {
        return null;
    }

    if (error.statusCode !== 400) {
        return null;
    }

    return error.fieldErrorMessage;
};
