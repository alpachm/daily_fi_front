// src/screens/LoginScreen.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "@tanstack/react-router";
import "../styles/LoginScreen.css";
import { ROUTES } from "../constants/routes";

const handleLogin = (navigate: ReturnType<typeof useNavigate>): void => {
    // Simulate successful login and redirect to protected /balance route
    navigate({ to: ROUTES.DASHBOARD });
};

const LoginScreen = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        handleLogin(navigate);
    };

    return (
        <main className="login-screen">
            <div className="login-card">
                {/* Header */}
                <header className="login-header">
                    <h1 className="login-title">{t("LoginScreen.title")}</h1>
                    <p className="login-subtitle">{t("LoginScreen.subtitle")}</p>
                </header>

                {/* Form */}
                <form className="login-form" onSubmit={onSubmit} noValidate>
                    <div className="login-field">
                        <label htmlFor="login-usuario" className="login-label">
                            {t("LoginScreen.usernameLabel")}
                        </label>
                        <input
                            id="login-usuario"
                            className="login-input"
                            type="text"
                            inputMode="email"
                            autoComplete="username"
                            placeholder={t("LoginScreen.usernamePlaceholder")}
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="login-contrasena" className="login-label">
                            {t("LoginScreen.passwordLabel")}
                        </label>
                        <input
                            id="login-contrasena"
                            className="login-input"
                            type="password"
                            autoComplete="current-password"
                            placeholder={t("LoginScreen.passwordPlaceholder")}
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-forgot">
                        <button type="button" className="login-forgot-btn">
                            {t("LoginScreen.forgotPassword")}
                        </button>
                    </div>

                    <button type="submit" className="login-submit">
                        {t("Actions.enter")}
                    </button>
                </form>

                {/* Footer */}
                <footer className="login-footer">
                    <span className="login-footer-text">{t("LoginScreen.noAccount")}</span>
                    <Link to={ROUTES.SIGNUP} className="login-signup-link">
                        {t("LoginScreen.signupLink")}
                    </Link>
                </footer>
            </div>
        </main>
    );
};

export default LoginScreen;
