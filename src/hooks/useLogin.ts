// src/hooks/useLogin.ts
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";

import { LoginService } from "../services/LoginService";
import { LoginApiError } from "../interfaces/LoginService.interface";
import { DASHBOARD_ROUTES } from "../constants/routes";

export type LoginField = "email" | "password";

export type LoginFieldErrors = Partial<Record<LoginField, string>>;

interface UseLoginResult {
    email: string;
    password: string;
    isLoading: boolean;
    errorMessage: string | null;
    fieldErrors: LoginFieldErrors;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

export const useLogin = (): UseLoginResult => {
    const { t } = useTranslation("");
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>): Promise<void> => {
            event.preventDefault();

            const nextFieldErrors: LoginFieldErrors = {};
            if (email.trim() === "") {
                nextFieldErrors.email = t("LoginScreen.errors.emailRequired");
            }
            if (password === "") {
                nextFieldErrors.password = t(
                    "LoginScreen.errors.passwordRequired",
                );
            }

            setFieldErrors(nextFieldErrors);
            setErrorMessage(null);

            if (Object.keys(nextFieldErrors).length > 0) {
                return;
            }

            setIsLoading(true);
            try {
                const response = await LoginService.loginUser({
                    email,
                    password,
                });

                try {
                    window.localStorage.setItem(
                        AUTH_TOKEN_KEY,
                        response.data.token,
                    );
                    window.localStorage.setItem(
                        AUTH_USER_KEY,
                        JSON.stringify(response.data.user),
                    );
                } catch {
                    // Persistence is best-effort; continue with navigation.
                }

                setPassword("");
                navigate({ to: DASHBOARD_ROUTES.DASHBOARD });
            } catch (error: unknown) {
                // Clear sensitive data on execution errors.
                setPassword("");

                if (error instanceof LoginApiError) {
                    if (error.kind === "validation") {
                        const nextErrors: LoginFieldErrors = {};
                        for (const fieldError of error.fieldErrors) {
                            if (
                                fieldError.field === "email" ||
                                fieldError.field === "password"
                            ) {
                                nextErrors[fieldError.field] =
                                    fieldError.message;
                            }
                        }
                        setFieldErrors(nextErrors);
                        if (Object.keys(nextErrors).length === 0) {
                            setErrorMessage(
                                t("LoginScreen.errors.invalidData"),
                            );
                        }
                        return;
                    }

                    if (error.kind === "unauthorized") {
                        setErrorMessage(
                            t("LoginScreen.errors.invalidCredentials"),
                        );
                        return;
                    }

                    if (error.kind === "network") {
                        setErrorMessage(t("LoginScreen.errors.network"));
                        return;
                    }
                }

                setErrorMessage(t("LoginScreen.errors.generic"));
            } finally {
                setIsLoading(false);
            }
        },
        [email, password, navigate, t],
    );

    return {
        email,
        password,
        isLoading,
        errorMessage,
        fieldErrors,
        setEmail,
        setPassword,
        handleSubmit,
    };
};

export default useLogin;
