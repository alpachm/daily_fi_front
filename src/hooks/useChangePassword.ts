// src/hooks/useChangePassword.ts
import { useMutation } from "@tanstack/react-query";

import { ChangePasswordService } from "../services/ChangePasswordService";
import type {
    ChangePasswordApiError,
    ChangePasswordPayload,
    ChangePasswordSuccessResponse,
} from "../interfaces/ChangePasswordService.interface";

/**
 * Wraps `ChangePasswordService.changePassword` in a TanStack Query mutation so
 * the security card can submit the password form without calling the HTTP
 * layer directly.
 *
 * There are no server-state queries that depend on the user's password (the
 * auth credentials live in `localStorage`, outside the TanStack Query cache),
 * so this mutation has no query keys to invalidate or update on success.
 */
export const useChangePassword = () => {
    return useMutation<
        ChangePasswordSuccessResponse,
        ChangePasswordApiError,
        ChangePasswordPayload
    >({
        mutationFn: (payload: ChangePasswordPayload) =>
            ChangePasswordService.changePassword(payload),
    });
};

export default useChangePassword;
