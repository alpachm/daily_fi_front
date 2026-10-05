// src/utils/auth.ts
export const AUTH_TOKEN_KEY = "auth_token" as const;
export const AUTH_USER_KEY = "auth_user" as const;

export const isAuthenticated = (): boolean => {
    try {
        const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
        return token !== null && token !== "";
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