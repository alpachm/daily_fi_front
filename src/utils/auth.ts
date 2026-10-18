// src/utils/auth.ts
export const AUTH_TOKEN_KEY = "auth_token" as const;
export const AUTH_USER_KEY = "auth_user" as const;

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

/**
 * Decodes the payload section of a JWT without verifying its signature.
 * Returns null when the token is not a well-formed JWT.
 */
const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
    try {
        const segments = token.split(".");
        if (segments.length !== 3) {
            return null;
        }

        const payloadSegment = segments[1];
        const base64 = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
        const decoded = window.atob(padded);
        const parsed: unknown = JSON.parse(decoded);

        return isObject(parsed) ? parsed : null;
    } catch {
        return null;
    }
};

/**
 * Determines whether a JWT access token is past its `exp` (expiration) claim.
 *
 * Tokens that cannot be decoded or that lack a numeric `exp` claim are treated
 * as valid: the backend remains the authoritative source of truth and rejects
 * them with a 401 when appropriate.
 */
export const isAccessTokenExpired = (token: string): boolean => {
    const payload = decodeJwtPayload(token);
    if (payload === null) {
        return false;
    }

    const exp: unknown = payload.exp;
    if (typeof exp !== "number") {
        return false;
    }

    return exp * 1000 <= Date.now();
};

export const isAuthenticated = (): boolean => {
    try {
        const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
        if (token === null || token === "") {
            return false;
        }
        return !isAccessTokenExpired(token);
    } catch {
        return false;
    }
};

export const getAccessToken = (): string | null => {
    try {
        return window.localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
        return null;
    }
};

export const clearAuthCredentials = (): void => {
    try {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        window.localStorage.removeItem(AUTH_USER_KEY);
    } catch {
        // Best-effort cleanup; storage may be unavailable (e.g. private mode).
    }
};
