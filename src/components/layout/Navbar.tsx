// src/components/Navbar.tsx
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import "./styles/Navbar.css";

interface NavbarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Navbar = ({ isOpen, onClose }: NavbarProps) => {
    const { t } = useTranslation();

    const closeButtonAriaLabel = t("Actions.close");

    return (
        <nav
            className={`dashboard-nav ${isOpen ? "dashboard-nav--open" : "dashboard-nav--closed"}`}
            aria-hidden={!isOpen}
        >
            {/* Overlay backdrop */}
            <div className="dashboard-nav__backdrop" onClick={onClose} aria-hidden="true" />

            {/* Slide-out panel */}
            <div className="dashboard-nav__panel">
                <button
                    type="button"
                    className="dashboard-nav__close-btn"
                    onClick={onClose}
                    aria-label={closeButtonAriaLabel}
                >
                    <span className="dashboard-nav__close-icon" aria-hidden="true" />
                </button>

                <ul className="dashboard-nav__list">
                    <li className="dashboard-nav__item">
                        <Link
                            to="/dashboard"
                            className="dashboard-nav__link"
                            activeProps={{ className: "dashboard-nav__link--active" }}
                            onClick={onClose}
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
                            onClick={onClose}
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
                            onClick={onClose}
                        >
                            <span className="dashboard-nav__icon" aria-hidden="true">
                                👤
                            </span>
                            <span className="dashboard-nav__label">{t("Navbar.profile")}</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
