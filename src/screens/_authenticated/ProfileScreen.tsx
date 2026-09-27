// src/screens/_authenticated/ProfileScreen.tsx
import "../../styles/ProfileScreen.css";
import { SecurityCard } from "../../components/ProfileScreen/SecurityCard";
import { PreferencesCard } from "../../components/ProfileScreen/PreferencesCard";

export const ProfileScreen = () => {
    return (
        <div className="profile-screen">
            <SecurityCard />
            <PreferencesCard />
        </div>
    );
};

export default ProfileScreen;
