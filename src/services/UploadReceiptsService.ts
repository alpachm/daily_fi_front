// src/services/UploadReceiptsService.ts
import {
    UploadReceiptsApiError,
    type UploadReceiptsErrorResponse,
    type UploadReceiptsFieldError,
    type UploadReceiptsPayload,
    type UploadReceiptsSuccessResponse,
} from "../interfaces/UploadReceiptsService.interface";
import { getAccessToken } from "../utils/auth";

/**
 * Base URL of the backend API, injected at build time by Vite.
 *
 * The variable must be exposed with the `VITE_` prefix (see `.env`) to be
 * available on `import.meta.env`. An empty string is used as a graceful
 * fallback when the variable is not configured.
 */
const API_BASE_URL: string = import.meta.env.VITE_BASE_URL ?? "";

const UPLOAD_RECEIPTS_ENDPOINT = "/receipts/bulk";

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isFieldError = (value: unknown): value is UploadReceiptsFieldError => {
    if (!isObject(value)) {
        return false;
    }
    return typeof value.field === "string" && typeof value.message === "string";
};

const isErrorResponse = (
    value: unknown,
): value is UploadReceiptsErrorResponse => {
    if (!isObject(value)) {
        return false;
    }
    if (value.status !== "fail" || typeof value.message !== "string") {
        return false;
    }
    const errors: unknown = value.errors;
    if (errors === undefined) {
        return true;
    }
    return Array.isArray(errors) && errors.every(isFieldError);
};

const isSuccessResponse = (
    value: unknown,
): value is UploadReceiptsSuccessResponse => {
    if (!isObject(value)) {
        return false;
    }
    if (value.status !== "success" || typeof value.message !== "string") {
        return false;
    }
    const data: unknown = value.data;
    if (data === undefined) {
        return true;
    }
    return isObject(data) && typeof data.count === "number";
};

const readResponseBody = async (response: Response): Promise<unknown> => {
    try {
        return await response.json();
    } catch {
        return null;
    }
};

const mapErrorResponse = (
    statusCode: number,
    body: unknown,
): UploadReceiptsApiError => {
    if (statusCode === 400 && isErrorResponse(body)) {
        return new UploadReceiptsApiError(body.message, {
            kind: "validation",
            statusCode,
            fieldErrors: body.errors ?? [],
        });
    }

    if (statusCode === 401 && isErrorResponse(body)) {
        return new UploadReceiptsApiError(body.message, {
            kind: "unauthorized",
            statusCode,
        });
    }

    if (statusCode === 404 && isErrorResponse(body)) {
        return new UploadReceiptsApiError(body.message, {
            kind: "notFound",
            statusCode,
        });
    }

    if (statusCode === 415 && isErrorResponse(body)) {
        return new UploadReceiptsApiError(body.message, {
            kind: "unsupportedMediaType",
            statusCode,
        });
    }

    return new UploadReceiptsApiError(
        "Upload receipts failed with an unexpected error.",
        {
            kind: "unexpected",
            statusCode,
        },
    );
};

const buildFormData = (payload: UploadReceiptsPayload): FormData => {
    const formData = new FormData();

    formData.append("date", payload.date);

    if (payload.description !== undefined) {
        formData.append("description", payload.description);
    }

    if (payload.category !== undefined) {
        formData.append("category", payload.category);
    }

    // Omitted by default: the backend falls back to "PURCHASE".
    if (payload.type !== undefined) {
        formData.append("type", payload.type);
    }

    for (const receipt of payload.receipts) {
        formData.append("receipts", receipt);
    }

    return formData;
};

export const uploadReceipts = async (
    payload: UploadReceiptsPayload,
): Promise<UploadReceiptsSuccessResponse> => {
    const url = `${API_BASE_URL}${UPLOAD_RECEIPTS_ENDPOINT}`;
    const accessToken = getAccessToken();

    let response: Response;
    try {
        // Do NOT set a "Content-Type" header manually: the browser derives the
        // multipart boundary from the `FormData` instance.
        response = await fetch(url, {
            method: "POST",
            headers: {
                ...(accessToken !== null
                    ? { Authorization: `Bearer ${accessToken}` }
                    : {}),
            },
            body: buildFormData(payload),
        });
    } catch {
        throw new UploadReceiptsApiError(
            "Unable to reach the upload receipts service.",
            {
                kind: "network",
                statusCode: null,
            },
        );
    }

    const responseBody: unknown = await readResponseBody(response);

    if (!response.ok) {
        throw mapErrorResponse(response.status, responseBody);
    }

    if (!isSuccessResponse(responseBody)) {
        throw new UploadReceiptsApiError(
            "Upload receipts service returned an invalid success response.",
            {
                kind: "unexpected",
                statusCode: response.status,
            },
        );
    }

    return responseBody;
};

export const UploadReceiptsService = {
    uploadReceipts,
};
