// src/utils/sessionExpiry.ts
import { clearAuthCredentials, getAccessToken } from "./auth";

/**
 * Event dispatched on `window` whenever a protected API call reports that the
 * stored session has expired. `main.tsx` listens to it to redirect to `/login`
 * and the global notifier surfaces a brief toast.
 */
export const SESSION_EXPIRED_EVENT = "app:session-expired" as const;

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isSessionExpiredMessage = (message: string): boolean => {
    const normalized = message.trim().toLowerCase();
    return (
        normalized === "invalid or expired token." ||
        normalized === "invalid or expired token" ||
        normalized.includes("expired token") ||
        normalized.includes("token expired")
    );
};

/**
 * Detects the backend's session-expiration signal: an HTTP 401/403 whose JSON
 * body is shaped like `{ status: "fail", message: "Invalid or expired token." }`.
 */
export const isSessionExpiredResponse = (
    statusCode: number,
    body: unknown,
): boolean => {
    if (!isObject(body) || body.status !== "fail") {
        return false;
    }

    // A 401 on a protected endpoint always means the stored credentials are no
    // longer valid (missing, malformed, or expired).
    if (statusCode === 401) {
        return true;
    }

    // Some deployments signal an expired token with a 403 instead; only treat
    // it as a session expiry when the message clearly indicates expiration so
    // that genuine permission errors do not terminate the session.
    if (statusCode === 403) {
        return (
            typeof body.message === "string" &&
            isSessionExpiredMessage(body.message)
        );
    }

    return false;
};

/**
 * Clears the local session and notifies the rest of the app so it can redirect
 * to `/login` and show a session-expired notification. It is a no-op when no
 * token is currently stored (e.g. after the first of several concurrent 401s).
 */
export const handleSessionExpired = (): void => {
    const token = getAccessToken();
    if (token === null || token === "") {
        return;
    }

    clearAuthCredentials();
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
};
