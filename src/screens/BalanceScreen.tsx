// src/screens/BalanceScreen.tsx
import { useTranslation } from "react-i18next";

export const BalanceScreen = () => {
    const { t } = useTranslation("");

    return (
        <div>
            <h3>{t("BalanceScreen.placeholder")}</h3>
        </div>
    );
};

export default BalanceScreen;
