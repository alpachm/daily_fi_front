// src/screens/_authenticated/DetailsScreen.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/DetailsScreen.css";
import { Balance } from "../../components/DetailsScreen/Balance";
import type { FilterPeriod } from "../../components/DetailsScreen/Balance";
import { HistoryTable } from "../../components/DetailsScreen/HistoryTable";

export const DetailsScreen = () => {
    const { t } = useTranslation("");
    const [currentFilter, setCurrentFilter] = useState<FilterPeriod>("month");

    return (
        <div className="details-screen">
            <h1 className="details-screen__title">{t("DetailsScreen.title")}</h1>
            <Balance currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
            <HistoryTable filter={currentFilter} />
        </div>
    );
};

export default DetailsScreen;
