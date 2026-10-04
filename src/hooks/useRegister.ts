// src/hooks/useRegister.ts
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { FormEvent } from "react";

import { RegisterService } from "../services/RegisterService";
import { RegisterApiError } from "../interfaces/RegisterService.interface";

export type RegisterField = "email" | "password" | "confirmPassword";

export type RegisterFieldErrors = Partial<Record<RegisterField, string>>;

interface UseRegisterResult {
    email: string;
    password: string;
    confirmPassword: string;
    isLoading: boolean;
    errorMessage: string | null;
    fieldErrors: RegisterFieldErrors;
    isSuccess: boolean;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
    setConfirmPassword: (value: string) => void;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export const useRegister = (): UseRegisterResult => {
    const { t } = useTranslation("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>): Promise<void> => {
            event.preventDefault();

            setIsSuccess(false);

            const nextFieldErrors: RegisterFieldErrors = {};
            if (email.trim() === "") {
                nextFieldErrors.email = t("SignupScreen.errors.emailRequired");
            }
            if (password === "") {
                nextFieldErrors.password = t("SignupScreen.errors.passwordRequired");
            }
            if (confirmPassword === "") {
                nextFieldErrors.confirmPassword = t(
                    "SignupScreen.errors.confirmPasswordRequired",
                );
            } else if (password !== confirmPassword) {
                nextFieldErrors.confirmPassword = t(
                    "SignupScreen.errors.passwordsDoNotMatch",
                );
            }

            setFieldErrors(nextFieldErrors);
            setErrorMessage(null);

            if (Object.keys(nextFieldErrors).length > 0) {
                return;
            }

            setIsLoading(true);
            try {
                await RegisterService.registerUser({ email, password });
                setIsSuccess(true);
                setEmail("");
                setPassword("");
                setConfirmPassword("");
            } catch (error: unknown) {
                if (error instanceof RegisterApiError) {
                    if (error.kind === "validation") {
                        const mappedErrors: RegisterFieldErrors = {};
                        for (const fieldError of error.fieldErrors) {
                            if (
                                fieldError.field === "email" &&
                                mappedErrors.email === undefined
                            ) {
                                mappedErrors.email = t(
                                    "SignupScreen.errors.emailInvalid",
                                );
                            } else if (
                                fieldError.field === "password" &&
                                mappedErrors.password === undefined
                            ) {
                                mappedErrors.password = t(
                                    "SignupScreen.errors.passwordInvalid",
                                );
                            }
                        }
                        setFieldErrors(mappedErrors);
                        return;
                    }

                    if (error.kind === "conflict") {
                        setErrorMessage(t("SignupScreen.errors.conflict"));
                        return;
                    }

                    if (error.kind === "network") {
                        setErrorMessage(t("SignupScreen.errors.network"));
                        return;
                    }

                    setErrorMessage(t("SignupScreen.errors.generic"));
                    return;
                }

                setErrorMessage(t("SignupScreen.errors.generic"));
            } finally {
                setIsLoading(false);
            }
        },
        [email, password, confirmPassword, t],
    );

    return {
        email,
        password,
        confirmPassword,
        isLoading,
        errorMessage,
        fieldErrors,
        isSuccess,
        setEmail,
        setPassword,
        setConfirmPassword,
        handleSubmit,
    };
};

export default useRegister;