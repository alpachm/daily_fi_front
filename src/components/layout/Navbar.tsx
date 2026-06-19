// src/components/layout/Navbar.tsx
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import "./styles/Navbar.css";

interface NavbarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavLinkConfig {
    id: string;
    to: string;
    labelKey: string;
    emoji: string;
}

const NAV_LINKS: NavLinkConfig[] = [
    {
        id: "dashboard-balance",
        to: "/dashboard",
        labelKey: "Navbar.balance",
        emoji: "💰",
    },
    {
        id: "dashboard-details",
        to: "/dashboard/details",
        labelKey: "Navbar.details",
        emoji: "📋",
    },
    {
        id: "dashboard-profile",
        to: "/dashboard/profile",
        labelKey: "Navbar.profile",
        emoji: "👤",
    },
];

export const Navbar = ({ isOpen, onClose }: NavbarProps) => {
    const { t } = useTranslation();

    const closeButtonAriaLabel = t("Actions.close");

    return (
        <nav
            className={`dashboard-nav ${isOpen ? "dashboard-nav--open" : "dashboard-nav--closed"}`}
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
                    {NAV_LINKS.map(({ id, to, labelKey, emoji }) => (
                        <li key={id} className="dashboard-nav__item">
                            <Link
                                to={to}
                                className="dashboard-nav__link"
                                activeProps={{ className: "dashboard-nav__link--active" }}
                                onClick={onClose}
                            >
                                <span className="dashboard-nav__icon" aria-hidden="true">
                                    {emoji}
                                </span>
                                <span className="dashboard-nav__label">{t(labelKey)}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
