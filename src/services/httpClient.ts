// src/services/httpClient.ts
import { getAccessToken } from "../utils/auth";
import {
    handleSessionExpired,
    isSessionExpiredResponse,
} from "../utils/sessionExpiry";

export type ApiFetchMethod = "GET" | "POST" | "PATCH" | "DELETE";

export interface ApiFetchRequest {
    method: ApiFetchMethod;
    headers?: Record<string, string>;
    body?: BodyInit | null;
    /** When false, the Authorization header is not attached (public endpoints). */
    auth?: boolean;
}

export type ApiFetchResult =
    | { ok: true; response: Response; body: unknown }
    | { ok: false; kind: "network" };

const readResponseBody = async (response: Response): Promise<unknown> => {
    try {
        return await response.json();
    } catch {
        return null;
    }
};

/**
 * Central fetch wrapper used by all authenticated API services.
 *
 * It attaches the stored access token, performs the request, parses the JSON
 * body once, and — when a session-expiration signal is detected — clears the
 * local credentials and triggers the global redirect + notification.
 */
export const performApiFetch = async (
    url: string,
    request: ApiFetchRequest,
): Promise<ApiFetchResult> => {
    const accessToken = request.auth === false ? null : getAccessToken();

    const init: RequestInit = {
        method: request.method,
        headers: {
            ...(request.headers ?? {}),
            ...(accessToken !== null
                ? { Authorization: `Bearer ${accessToken}` }
                : {}),
        },
    };

    if (request.body !== undefined) {
        init.body = request.body;
    }

    let response: Response;
    try {
        response = await fetch(url, init);
    } catch {
        return { ok: false, kind: "network" };
    }

    const body: unknown = await readResponseBody(response);

    if (!response.ok && isSessionExpiredResponse(response.status, body)) {
        handleSessionExpired();
    }

    return { ok: true, response, body };
};
