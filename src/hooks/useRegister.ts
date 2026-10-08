// src/hooks/useRegister.ts
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { FormEvent } from "react";

import { RegisterService } from "../services/RegisterService";
import { RegisterApiError } from "../interfaces/RegisterService.interface";

export type RegisterField = "email" | "password" | "confirmPassword";

export type RegisterFieldErrors = Partial<Record<RegisterField, string>>;

export type RegisterStep = 1 | 2;

interface UseRegisterResult {
    email: string;
    password: string;
    confirmPassword: string;
    currentStep: RegisterStep;
    isLoading: boolean;
    errorMessage: string | null;
    fieldErrors: RegisterFieldErrors;
    isSuccess: boolean;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
    setConfirmPassword: (value: string) => void;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    goToStep1: () => void;
}

export const useRegister = (): UseRegisterResult => {
    const { t } = useTranslation("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentStep, setCurrentStep] = useState<RegisterStep>(1);
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
                setCurrentStep(2);
            } catch (error: unknown) {
                setIsSuccess(false);

                let message = t("SignupScreen.errors.generic");
                if (error instanceof RegisterApiError) {
                    if (error.kind === "validation") {
                        message = t("SignupScreen.errors.invalidData");
                    } else if (error.kind === "conflict") {
                        message = t("SignupScreen.errors.conflict");
                    } else if (error.kind === "network") {
                        message = t("SignupScreen.errors.network");
                    }
                }

                setErrorMessage(message);
                setCurrentStep(2);
            } finally {
                setIsLoading(false);
            }
        },
        [email, password, confirmPassword, t],
    );

    const goToStep1 = useCallback((): void => {
        setIsSuccess(false);
        setErrorMessage(null);
        setFieldErrors({});
        setCurrentStep(1);
    }, []);

    return {
        email,
        password,
        confirmPassword,
        currentStep,
        isSuccess,
        isLoading,
        errorMessage,
        fieldErrors,
        setEmail,
        setPassword,
        setConfirmPassword,
        handleSubmit,
        goToStep1,
    };
};

export default useRegister;