// src/components/Navbar.tsx
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import "./styles/Navbar.css";

export const Navbar = () => {
    const { t } = useTranslation();

    return (
        <nav className="dashboard-nav">
            <ul className="dashboard-nav__list">
                <li className="dashboard-nav__item">
                    <Link
                        to="/dashboard"
                        className="dashboard-nav__link"
                        activeProps={{ className: "dashboard-nav__link--active" }}
                    >
                        <span className="dashboard-nav__icon" aria-hidden="true">
                            💰
                        </span>
                        <span className="dashboard-nav__label">{t("Navbar.balance")}</span>
                    </Link>
                </li>
                <li className="dashboard-nav__item">
                    <Link
                        to="/dashboard/details"
                        className="dashboard-nav__link"
                        activeProps={{ className: "dashboard-nav__link--active" }}
                    >
                        <span className="dashboard-nav__icon" aria-hidden="true">
                            📋
                        </span>
                        <span className="dashboard-nav__label">{t("Navbar.details")}</span>
                    </Link>
                </li>
                <li className="dashboard-nav__item">
                    <Link
                        to="/dashboard/profile"
                        className="dashboard-nav__link"
                        activeProps={{ className: "dashboard-nav__link--active" }}
                    >
                        <span className="dashboard-nav__icon" aria-hidden="true">
                            👤
                        </span>
                        <span className="dashboard-nav__label">{t("Navbar.profile")}</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
