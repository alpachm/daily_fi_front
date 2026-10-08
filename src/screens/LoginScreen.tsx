// src/screens/LoginScreen.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import { Link } from "@tanstack/react-router";
import "../styles/LoginScreen.css";
import { ROUTES } from "../constants/routes";
import { useLogin } from "../hooks/useLogin";

const LoginScreen = () => {
    const { t } = useTranslation("");
    const {
        email,
        password,
        isLoading,
        errorMessage,
        fieldErrors,
        setEmail,
        setPassword,
        handleSubmit,
    } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="login-screen">
            <div className="login-card">
                <header className="login-header">
                    <h1 className="login-title">{t("LoginScreen.title")}</h1>
                    <p className="login-subtitle">{t("LoginScreen.subtitle")}</p>
                </header>

                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    {errorMessage !== null && (
                        <div className="login-alert" role="alert">
                            <TriangleAlert
                                size={18}
                                className="login-alert-icon"
                                aria-hidden="true"
                            />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <div className="login-field">
                        <label htmlFor="login-email" className="login-label">
                            {t("LoginScreen.emailLabel")}
                        </label>
                        <input
                            id="login-email"
                            className="login-input"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder={t("LoginScreen.emailPlaceholder")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-invalid={fieldErrors.email !== undefined}
                            aria-describedby={
                                fieldErrors.email !== undefined
                                    ? "login-email-error"
                                    : undefined
                            }
                            required
                        />
                        {fieldErrors.email !== undefined && (
                            <p id="login-email-error" className="login-field-error">
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>

                    <div className="login-field">
                        <label htmlFor="login-password" className="login-label">
                            {t("LoginScreen.passwordLabel")}
                        </label>
                        <div className="login-input-wrap">
                            <input
                                id="login-password"
                                className="login-input"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder={t("LoginScreen.passwordPlaceholder")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                aria-invalid={fieldErrors.password !== undefined}
                                aria-describedby={
                                    fieldErrors.password !== undefined
                                        ? "login-password-error"
                                        : undefined
                                }
                                required
                            />
                            <button
                                type="button"
                                className="login-input-toggle"
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
                            <p
                                id="login-password-error"
                                className="login-field-error"
                            >
                                {fieldErrors.password}
                            </p>
                        )}
                    </div>

                    <div className="login-forgot">
                        <button type="button" className="login-forgot-btn">
                            {t("LoginScreen.forgotPassword")}
                        </button>
                    </div>

                    <button type="submit" className="login-submit" disabled={isLoading}>
                        {isLoading ? t("Common.loading") : t("Actions.enter")}
                    </button>
                </form>

                <footer className="login-footer">
                    <span className="login-footer-text">
                        {t("LoginScreen.noAccount")}
                    </span>
                    <Link to={ROUTES.SIGNUP} className="login-signup-link">
                        {t("LoginScreen.signupLink")}
                    </Link>
                </footer>
            </div>
        </main>
    );
};

export default LoginScreen;
