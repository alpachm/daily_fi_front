// src/screens/_authenticated/ProfileScreen.tsx
import "../../styles/ProfileScreen.css";
import { SecurityCard } from "../../components/ProfileScreen/SecurityCard";

export const ProfileScreen = () => {
    return (
        <div className="profile-screen">
            <SecurityCard />
        </div>
    );
};

export default ProfileScreen;
