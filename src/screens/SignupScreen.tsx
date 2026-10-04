// src/screens/SignupScreen.tsx
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import "../styles/SignupScreen.css";
import { ROUTES } from "../constants/routes";
import { useRegister } from "../hooks/useRegister";

export const SignupScreen = () => {
    const { t } = useTranslation("");

    const {
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
    } = useRegister();

    return (
        <main className="signup-screen">
            <div className="signup-card">
                <header className="signup-header">
                    <h1 className="signup-title">{t("SignupScreen.title")}</h1>
                    <p className="signup-subtitle">{t("SignupScreen.subtitle")}</p>
                </header>

                <form className="signup-form" onSubmit={handleSubmit} noValidate>
                    {isSuccess && (
                        <p className="signup-success" role="status">
                            {t("SignupScreen.successMessage")}
                        </p>
                    )}

                    {errorMessage !== null && (
                        <p className="signup-global-error" role="alert">
                            {errorMessage}
                        </p>
                    )}

                    <div className="signup-field">
                        <label htmlFor="signup-email" className="signup-label">
                            {t("SignupScreen.emailLabel")}
                        </label>
                        <input
                            id="signup-email"
                            className="signup-input"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder={t("SignupScreen.emailPlaceholder")}
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            aria-invalid={fieldErrors.email !== undefined}
                            aria-describedby={
                                fieldErrors.email !== undefined
                                    ? "signup-email-error"
                                    : undefined
                            }
                        />
                        {fieldErrors.email !== undefined && (
                            <p id="signup-email-error" className="signup-field-error">
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>

                    <div className="signup-field">
                        <label htmlFor="signup-password" className="signup-label">
                            {t("SignupScreen.passwordLabel")}
                        </label>
                        <input
                            id="signup-password"
                            className="signup-input"
                            type="password"
                            autoComplete="new-password"
                            placeholder={t("SignupScreen.passwordPlaceholder")}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            aria-invalid={fieldErrors.password !== undefined}
                            aria-describedby={
                                fieldErrors.password !== undefined
                                    ? "signup-password-error"
                                    : undefined
                            }
                        />
                        {fieldErrors.password !== undefined && (
                            <p id="signup-password-error" className="signup-field-error">
                                {fieldErrors.password}
                            </p>
                        )}
                    </div>

                    <div className="signup-field">
                        <label htmlFor="signup-confirm-password" className="signup-label">
                            {t("SignupScreen.confirmPasswordLabel")}
                        </label>
                        <input
                            id="signup-confirm-password"
                            className="signup-input"
                            type="password"
                            autoComplete="new-password"
                            placeholder={t("SignupScreen.confirmPasswordPlaceholder")}
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            aria-invalid={fieldErrors.confirmPassword !== undefined}
                            aria-describedby={
                                fieldErrors.confirmPassword !== undefined
                                    ? "signup-confirm-password-error"
                                    : undefined
                            }
                        />
                        {fieldErrors.confirmPassword !== undefined && (
                            <p id="signup-confirm-password-error" className="signup-field-error">
                                {fieldErrors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <button type="submit" className="signup-submit" disabled={isLoading}>
                        {isLoading ? t("Common.loading") : t("SignupScreen.submitButton")}
                    </button>
                </form>

                <footer className="signup-footer">
                    <span className="signup-footer-text">{t("SignupScreen.haveAccount")}</span>
                    <Link to={ROUTES.LOGIN} className="signup-login-link">
                        {t("SignupScreen.loginLink")}
                    </Link>
                </footer>
            </div>
        </main>
    );
};

export default SignupScreen;
