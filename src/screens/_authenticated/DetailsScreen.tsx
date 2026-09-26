// src/screens/DetailsScreen.tsx
import { useTranslation } from "react-i18next";

export const DetailsScreen = () => {
    const { t } = useTranslation("");

    return (
        <div>
            <h3>{t("DetailsScreen.placeholder")}</h3>
        </div>
    );
};

export default DetailsScreen;
