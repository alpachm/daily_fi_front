// src/services/DeleteReceiptService.ts
import { DeleteReceiptApiError } from "../interfaces/DeleteReceiptService.interface";
import { performApiFetch } from "./httpClient";

/**
 * Base URL of the backend API, injected at build time by Vite.
 *
 * The variable must be exposed with the `VITE_` prefix (see `.env`) to be
 * available on `import.meta.env`. An empty string is used as a graceful
 * fallback when the variable is not configured.
 */
const API_BASE_URL: string = import.meta.env.VITE_BASE_URL ?? "";

const deleteReceiptEndpoint = (receiptId: number | string): string =>
    `/receipts/${receiptId}`;

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const readErrorMessage = (body: unknown): string | null => {
    if (!isObject(body)) {
        return null;
    }
    return typeof body.message === "string" ? body.message : null;
};

const mapErrorResponse = (
    statusCode: number,
    body: unknown,
): DeleteReceiptApiError => {
    const message = readErrorMessage(body);

    if (statusCode === 401) {
        return new DeleteReceiptApiError(message ?? "Session expired.", {
            kind: "unauthorized",
            statusCode,
        });
    }

    if (statusCode === 403) {
        return new DeleteReceiptApiError(message ?? "Forbidden.", {
            kind: "forbidden",
            statusCode,
        });
    }

    if (statusCode === 404) {
        return new DeleteReceiptApiError(message ?? "Receipt not found.", {
            kind: "notFound",
            statusCode,
        });
    }

    return new DeleteReceiptApiError(
        "Delete receipt failed with an unexpected error.",
        {
            kind: "unexpected",
            statusCode,
        },
    );
};

export const deleteReceipt = async (
    receiptId: number | string,
): Promise<void> => {
    const url = `${API_BASE_URL}${deleteReceiptEndpoint(receiptId)}`;
    const result = await performApiFetch(url, { method: "DELETE" });
    if (!result.ok) {
        throw new DeleteReceiptApiError(
            "Unable to reach the delete receipt service.",
            {
                kind: "network",
                statusCode: null,
            },
        );
    }

    const response = result.response;

    if (response.status === 204) {
        return;
    }

    const responseBody = result.body;

    if (!response.ok) {
        throw mapErrorResponse(response.status, responseBody);
    }

    // Any other 2xx response (e.g. 200) is treated as a successful deletion.
    return;
};

export const DeleteReceiptService = {
    deleteReceipt,
};
