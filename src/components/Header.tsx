// src/components/Header.tsx
import { useTranslation } from "react-i18next";

export const Header = () => {
    const { t } = useTranslation("");

    return (
        <header className="dashboard-header">
            <div className="dashboard-header__brand">
                <span className="dashboard-header__logo">FI</span>
                <h1 className="dashboard-header__app-name">{t("DashboardLayout.headerTitle")}</h1>
            </div>
            <div className="dashboard-header__actions">
                {/* Future: notification bell, user avatar, dropdown menu */}
            </div>
        </header>
    );
};

export default Header;
