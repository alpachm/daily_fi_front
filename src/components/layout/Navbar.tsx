// src/components/layout/Navbar.tsx
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { LucideProps } from "lucide-react";
import { Wallet, FileText, Receipt, User } from "lucide-react";
import "./styles/Navbar.css";

interface NavbarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavLinkConfig {
    id: string;
    to: string;
    labelKey: string;
    icon: React.ComponentType<LucideProps>;
}

const NAV_LINKS: NavLinkConfig[] = [
    {
        id: "dashboard-balance",
        to: "/dashboard",
        labelKey: "Navbar.balance",
        icon: Wallet,
    },
    {
        id: "dashboard-details",
        to: "/dashboard/details",
        labelKey: "Navbar.details",
        icon: FileText,
    },
    {
        id: "dashboard-receipts",
        to: "/dashboard/receipts",
        labelKey: "Navbar.receipts",
        icon: Receipt,
    },
];

const PROFILE_LINK: NavLinkConfig = {
    id: "dashboard-profile",
    to: "/dashboard/profile",
    labelKey: "Navbar.profile",
    icon: User,
};

export const Navbar = ({ isOpen, onClose }: NavbarProps) => {
    const { t } = useTranslation();

    const closeButtonAriaLabel = t("Actions.close");

    const renderNavLink = ({ id, to, labelKey, icon }: NavLinkConfig) => {
        const IconComponent = icon;
        return (
            <li key={id} className="dashboard-nav__item">
                <Link
                    to={to}
                    className="dashboard-nav__link"
                    activeProps={{ className: "dashboard-nav__link--active" }}
                    activeOptions={{ exact: true }}
                    onClick={onClose}
                >
                    <IconComponent size={20} className="dashboard-nav__icon" />
                    <span className="dashboard-nav__label">{t(labelKey)}</span>
                </Link>
            </li>
        );
    };

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

                <div className="dashboard-nav__main">
                    <ul className="dashboard-nav__list">
                        {NAV_LINKS.map(renderNavLink)}
                    </ul>
                </div>

                <div className="dashboard-nav__footer">
                    <ul className="dashboard-nav__list">
                        {renderNavLink(PROFILE_LINK)}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
