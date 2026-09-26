// src/screens/_authenticated/DetailsScreen.tsx
import { useTranslation } from "react-i18next";
import "../../styles/DetailsScreen.css";
import { Balance } from "../../components/DetailsScreen/Balance";
import { DailyHistoryTable } from "../../components/DetailsScreen/HistoryTable";
import { useDailyHistory } from "../../hooks/useDailyHistory";

export const DetailsScreen = () => {
    const { t } = useTranslation("");
    const { records } = useDailyHistory();

    return (
        <div className="details-screen">
            <h1 className="details-screen__title">{t("DetailsScreen.title")}</h1>
            <Balance />
            <DailyHistoryTable records={records} />
        </div>
    );
};

export default DetailsScreen;
