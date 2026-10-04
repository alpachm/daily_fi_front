// src/components/SignupScreen/Step1.tsx
import type { FormEvent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ROUTES } from "../../constants/routes";
import type { RegisterFieldErrors } from "../../hooks/useRegister";
import "./styles/Step1.css";

interface Step1Props {
    email: string;
    password: string;
    confirmPassword: string;
    isLoading: boolean;
    fieldErrors: RegisterFieldErrors;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export const Step1 = ({
    email,
    password,
    confirmPassword,
    isLoading,
    fieldErrors,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onSubmit,
}: Step1Props) => {
    const { t } = useTranslation("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="step1">
            <header className="step1-header">
                <h1 className="step1-title">{t("SignupScreen.title")}</h1>
                <p className="step1-subtitle">{t("SignupScreen.subtitle")}</p>
            </header>

            <form className="step1-form" onSubmit={onSubmit} noValidate>
                <div className="step1-field">
                    <label htmlFor="step1-email" className="step1-label">
                        {t("SignupScreen.emailLabel")}
                    </label>
                    <input
                        id="step1-email"
                        className="step1-input"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder={t("SignupScreen.emailPlaceholder")}
                        value={email}
                        onChange={(event) => onEmailChange(event.target.value)}
                        aria-invalid={fieldErrors.email !== undefined}
                        aria-describedby={
                            fieldErrors.email !== undefined
                                ? "step1-email-error"
                                : undefined
                        }
                    />
                    {fieldErrors.email !== undefined && (
                        <p id="step1-email-error" className="step1-field-error">
                            {fieldErrors.email}
                        </p>
                    )}
                </div>

                <div className="step1-field">
                    <label htmlFor="step1-password" className="step1-label">
                        {t("SignupScreen.passwordLabel")}
                    </label>
                    <div className="step1-input-wrap">
                        <input
                            id="step1-password"
                            className="step1-input"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder={t("SignupScreen.passwordPlaceholder")}
                            value={password}
                            onChange={(event) => onPasswordChange(event.target.value)}
                            aria-invalid={fieldErrors.password !== undefined}
                            aria-describedby={
                                fieldErrors.password !== undefined
                                    ? "step1-password-error"
                                    : undefined
                            }
                        />
                        <button
                            type="button"
                            className="step1-input-toggle"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={
                                showPassword
                                    ? t("Actions.hidePassword")
                                    : t("Actions.showPassword")
                            }
                        >
                            {showPassword ? (
                                <EyeOff size={18} aria-hidden="true" />
                            ) : (
                                <Eye size={18} aria-hidden="true" />
                            )}
                        </button>
                    </div>
                    {fieldErrors.password !== undefined && (
                        <p id="step1-password-error" className="step1-field-error">
                            {fieldErrors.password}
                        </p>
                    )}
                </div>

                <div className="step1-field">
                    <label htmlFor="step1-confirm-password" className="step1-label">
                        {t("SignupScreen.confirmPasswordLabel")}
                    </label>
                    <div className="step1-input-wrap">
                        <input
                            id="step1-confirm-password"
                            className="step1-input"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder={t("SignupScreen.confirmPasswordPlaceholder")}
                            value={confirmPassword}
                            onChange={(event) =>
                                onConfirmPasswordChange(event.target.value)
                            }
                            aria-invalid={fieldErrors.confirmPassword !== undefined}
                            aria-describedby={
                                fieldErrors.confirmPassword !== undefined
                                    ? "step1-confirm-password-error"
                                    : undefined
                            }
                        />
                        <button
                            type="button"
                            className="step1-input-toggle"
                            onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                            }
                            aria-label={
                                showConfirmPassword
                                    ? t("Actions.hidePassword")
                                    : t("Actions.showPassword")
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOff size={18} aria-hidden="true" />
                            ) : (
                                <Eye size={18} aria-hidden="true" />
                            )}
                        </button>
                    </div>
                    {fieldErrors.confirmPassword !== undefined && (
                        <p
                            id="step1-confirm-password-error"
                            className="step1-field-error"
                        >
                            {fieldErrors.confirmPassword}
                        </p>
                    )}
                </div>

                <button type="submit" className="step1-submit" disabled={isLoading}>
                    {isLoading ? t("Common.loading") : t("SignupScreen.submitButton")}
                </button>
            </form>

            <footer className="step1-footer">
                <span className="step1-footer-text">
                    {t("SignupScreen.haveAccount")}
                </span>
                <Link to={ROUTES.LOGIN} className="step1-login-link">
                    {t("SignupScreen.loginLink")}
                </Link>
            </footer>
        </div>
    );
};

export default Step1;
