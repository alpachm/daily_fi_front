// src/services/RegisterService.ts
import {
  RegisterApiError,
  type RegisterConflictErrorResponse,
  type RegisterFieldError,
  type RegisterRequest,
  type RegisterSuccessResponse,
  type RegisterValidationErrorResponse,
} from "../interfaces/RegisterService.interface";

/**
 * Base URL of the backend API, injected at build time by Vite.
 *
 * The variable must be exposed with the `VITE_` prefix (see `.env`) to be
 * available on `import.meta.env`. An empty string is used as a graceful
 * fallback when the variable is not configured.
 */
const API_BASE_URL: string = import.meta.env.VITE_BASE_URL ?? "";

const REGISTER_ENDPOINT = "/auth/register";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isFieldError = (value: unknown): value is RegisterFieldError => {
  if (!isObject(value)) {
    return false;
  }
  return typeof value.field === "string" && typeof value.message === "string";
};

const isValidationErrorResponse = (
  value: unknown,
): value is RegisterValidationErrorResponse => {
  if (!isObject(value)) {
    return false;
  }
  if (value.status !== "fail" || typeof value.message !== "string") {
    return false;
  }
  const errors: unknown = value.errors;
  return Array.isArray(errors) && errors.every(isFieldError);
};

const isConflictErrorResponse = (
  value: unknown,
): value is RegisterConflictErrorResponse => {
  if (!isObject(value)) {
    return false;
  }
  return value.status === "fail" && typeof value.message === "string";
};

const isRegisterSuccessResponse = (
  value: unknown,
): value is RegisterSuccessResponse => {
  if (!isObject(value)) {
    return false;
  }
  if (value.status !== "success") {
    return false;
  }
  const data: unknown = value.data;
  if (!isObject(data)) {
    return false;
  }
  return typeof data.id === "number" && typeof data.email === "string";
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
): RegisterApiError => {
  if (statusCode === 400 && isValidationErrorResponse(body)) {
    return new RegisterApiError(body.message, {
      kind: "validation",
      statusCode,
      fieldErrors: body.errors,
    });
  }

  if (statusCode === 409 && isConflictErrorResponse(body)) {
    return new RegisterApiError(body.message, {
      kind: "conflict",
      statusCode,
    });
  }

  return new RegisterApiError("Registration failed with an unexpected error.", {
    kind: "unexpected",
    statusCode,
  });
};

const registerUser = async (
  payload: RegisterRequest,
): Promise<RegisterSuccessResponse> => {
  const url = `${API_BASE_URL}${REGISTER_ENDPOINT}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new RegisterApiError("Unable to reach the registration service.", {
      kind: "network",
      statusCode: null,
    });
  }

  const responseBody: unknown = await readResponseBody(response);

  if (!response.ok) {
    throw mapErrorResponse(response.status, responseBody);
  }

  if (!isRegisterSuccessResponse(responseBody)) {
    throw new RegisterApiError(
      "Registration service returned an invalid success response.",
      {
        kind: "unexpected",
        statusCode: response.status,
      },
    );
  }

  return responseBody;
};

export const RegisterService = {
  registerUser,
};
