// src/screens/_authenticated/ReceipsScreen.tsx
import { useTranslation } from "react-i18next";
import "../../styles/ReceipsScreen.css";
import { ReceipsMenu } from "../../components/ReceipsScreen/ReceipsMenu";

export const ReceipsScreen = () => {
    const { t } = useTranslation("");

    return (
        <div className="receips-screen">
            <h1 className="receips-screen__title">{t("ReceipsScreen.title")}</h1>
            <ReceipsMenu />
        </div>
    );
};

export default ReceipsScreen;
