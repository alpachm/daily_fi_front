// src/screens/LoginScreen.tsx
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ROUTES } from "../routes";
import "../styles/LoginScreen.css";

const handleLogin = (navigate: ReturnType<typeof useNavigate>): void => {
    // Simulate successful login and redirect to protected /balance route
    navigate({ to: ROUTES.BALANCE });
};

const LoginScreen = () => {
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
                    <h1 className="login-title">Daily FI</h1>
                    <p className="login-subtitle">Gestión financiera P2P</p>
                </header>

                {/* Form */}
                <form className="login-form" onSubmit={onSubmit} noValidate>
                    <div className="login-field">
                        <label htmlFor="login-usuario" className="login-label">
                            Usuario
                        </label>
                        <input
                            id="login-usuario"
                            className="login-input"
                            type="text"
                            inputMode="email"
                            autoComplete="username"
                            placeholder="tu@correo.com"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="login-contrasena" className="login-label">
                            Contraseña
                        </label>
                        <input
                            id="login-contrasena"
                            className="login-input"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-forgot">
                        <button type="button" className="login-forgot-btn">
                            Olvidó su contraseña
                        </button>
                    </div>

                    <button type="submit" className="login-submit">
                        Ingresar
                    </button>
                </form>

                {/* Footer */}
                <footer className="login-footer">
                    <span className="login-footer-text">¿No tienes una cuenta?</span>
                    <Link to={ROUTES.SIGNUP} className="login-signup-link">
                        Registrarse
                    </Link>
                </footer>
            </div>
        </main>
    );
};

export default LoginScreen;
