// src/components/Header.tsx
import { useTranslation } from "react-i18next";
import "./styles/Header.css";

interface HeaderProps {
    onMenuToggle: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
    const { t } = useTranslation();

    const menuButtonAriaLabel = t("DashboardLayout.menuToggle");

    return (
        <header className="dashboard-header">
            <div className="dashboard-header__brand">
                <span className="dashboard-header__logo">FI</span>
                <h1 className="dashboard-header__app-name">{t("DashboardLayout.headerTitle")}</h1>
            </div>
            <div className="dashboard-header__actions">
                <button
                    type="button"
                    className="dashboard-header__hamburger"
                    onClick={onMenuToggle}
                    aria-label={menuButtonAriaLabel}
                >
                    <span className="dashboard-header__hamburger-bar" />
                    <span className="dashboard-header__hamburger-bar" />
                    <span className="dashboard-header__hamburger-bar" />
                </button>
                {/* Future: notification bell, user avatar, dropdown menu */}
            </div>
        </header>
    );
};

export default Header;
