// src/screens/_authenticated/DetailsScreen.tsx
import { useTranslation } from "react-i18next";
import "../../styles/DetailsScreen.css";
import { Balance } from "../../components/DetailsScreen/Balance";

export const DetailsScreen = () => {
    const { t } = useTranslation("");

    return (
        <div className="details-screen">
            <h1 className="details-screen__title">{t("DetailsScreen.title")}</h1>
            <Balance />
        </div>
    );
};

export default DetailsScreen;
