// src/interfaces/RegisterService.interface.ts

/**
 * Payload required to create a new user account.
 */
export interface RegisterRequest {
  email: string;
  password: string;
}

/**
 * Minimal user entity returned after a successful registration.
 */
export interface RegisterSuccessData {
  id: number;
  email: string;
}

/**
 * Response returned by the API on a successful registration (HTTP 201).
 */
export interface RegisterSuccessResponse {
  status: "success";
  data: RegisterSuccessData;
}

/**
 * A single field-level validation error.
 */
export interface RegisterFieldError {
  field: string;
  message: string;
}

/**
 * Response returned by the API when the payload fails validation (HTTP 400).
 */
export interface RegisterValidationErrorResponse {
  status: "fail";
  message: string;
  errors: RegisterFieldError[];
}

/**
 * Response returned by the API when the email is already registered (HTTP 409).
 */
export interface RegisterConflictErrorResponse {
  status: "fail";
  message: string;
}

/**
 * Union of every error payload the registration endpoint can return.
 */
export type RegisterErrorResponse =
  | RegisterValidationErrorResponse
  | RegisterConflictErrorResponse;

/**
 * Categories used to classify errors thrown by the registration service.
 */
export type RegisterApiErrorKind =
  | "validation"
  | "conflict"
  | "network"
  | "unexpected";

/**
 * Structured error thrown by `RegisterService.registerUser`.
 *
 * The consuming layer (hooks/UI) should map `kind` to localized,
 * user-facing messages instead of rendering `message` directly.
 */
export class RegisterApiError extends Error {
  readonly kind: RegisterApiErrorKind;
  readonly statusCode: number | null;
  readonly fieldErrors: RegisterFieldError[];

  constructor(
    message: string,
    options: {
      kind?: RegisterApiErrorKind;
      statusCode?: number | null;
      fieldErrors?: RegisterFieldError[];
    } = {},
  ) {
    super(message);
    this.name = "RegisterApiError";
    this.kind = options.kind ?? "unexpected";
    this.statusCode = options.statusCode ?? null;
    this.fieldErrors = options.fieldErrors ?? [];
  }
}
