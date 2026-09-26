// src/screens/_authenticated/ReceipsScreen.tsx
import "../../styles/ReceipsScreen.css";
import { ReceipsMenu } from "../../components/ReceipsScreen/ReceipsMenu";

export const ReceipsScreen = () => {
    return (
        <div className="receips-screen">
            <ReceipsMenu />
        </div>
    );
};

export default ReceipsScreen;
