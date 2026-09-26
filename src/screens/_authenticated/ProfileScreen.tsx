// src/screens/ProfileScreen.tsx
import { useTranslation } from "react-i18next";

export const ProfileScreen = () => {
    const { t } = useTranslation("");

    return (
        <div>
            <h3>{t("ProfileScreen.placeholder")}</h3>
        </div>
    );
};

export default ProfileScreen;
