// src/screens/_authenticated/DetailsScreen.tsx
import { useTranslation } from "react-i18next";
import "../../styles/DetailsScreen.css";
import { Balance } from "../../components/DetailsScreen/Balance";
import type { FilterPeriod } from "../../components/DetailsScreen/Balance";
import { HistoryTable } from "../../components/DetailsScreen/HistoryTable";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const FILTER_STORAGE_KEY = "daily_fi_details_filter" as const;

export const DetailsScreen = () => {
    const { t } = useTranslation("");
    const [currentFilter, setCurrentFilter] = useLocalStorage<FilterPeriod>(
        FILTER_STORAGE_KEY,
        "month",
    );

    return (
        <div className="details-screen">
            <h1 className="details-screen__title">{t("DetailsScreen.title")}</h1>
            <Balance currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
            <HistoryTable filter={currentFilter} />
        </div>
    );
};

export default DetailsScreen;
