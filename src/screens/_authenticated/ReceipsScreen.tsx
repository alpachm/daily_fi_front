// src/screens/_authenticated/ReceipsScreen.tsx
import { useTranslation } from "react-i18next";
import "../../styles/ReceipsScreen.css";

export const ReceipsScreen = () => {
    const { t } = useTranslation("");

    return (
        <div className="receips-screen">
            <h1 className="receips-screen__title">{t("ReceipsScreen.title")}</h1>

            <section className="receips-screen__placeholder">
                <p className="receips-screen__placeholder-text">
                    {t("ReceipsScreen.placeholder")}
                </p>
            </section>
        </div>
    );
};

export default ReceipsScreen;
