// src/screens/_authenticated/DetailsScreen.tsx
import "../../styles/DetailsScreen.css";
import { Balance } from "../../components/DetailsScreen/Balance";
import { HistoryTable } from "../../components/DetailsScreen/HistoryTable";

export const DetailsScreen = () => {
    return (
        <div className="details-screen">
            <Balance />
            <HistoryTable />
        </div>
    );
};

export default DetailsScreen;
