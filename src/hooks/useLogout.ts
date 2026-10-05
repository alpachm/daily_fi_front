// src/hooks/useLogout.ts
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";

import { LogoutService } from "../services/LogoutService";
import { LogoutApiError } from "../interfaces/LogoutService.interface";
import { ROUTES } from "../constants/routes";
import { clearAuthCredentials } from "../utils/auth";

interface UseLogoutResult {
    isLoading: boolean;
    errorMessage: string | null;
    logout: () => void;
}

export const useLogout = (): UseLogoutResult => {
    const { t } = useTranslation("");
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const logout = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            try {
                await LogoutService.logoutUser();
            } catch (error: unknown) {
                // A 401 during logout still ends the local session: the token
                // is either missing or already revoked server-side.
                if (
                    error instanceof LogoutApiError &&
                    error.kind === "unauthorized"
                ) {
                    clearAuthCredentials();
                    navigate({ to: ROUTES.LOGIN });
                    return;
                }
                throw error;
            }

            clearAuthCredentials();
            navigate({ to: ROUTES.LOGIN });
        } catch (error: unknown) {
            if (error instanceof LogoutApiError && error.kind === "network") {
                setErrorMessage(
                    t("ProfileScreen.securityLogoutNetworkError"),
                );
            } else {
                setErrorMessage(
                    t("ProfileScreen.securityLogoutGenericError"),
                );
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigate, t]);

    return {
        isLoading,
        errorMessage,
        logout,
    };
};

export default useLogout;
