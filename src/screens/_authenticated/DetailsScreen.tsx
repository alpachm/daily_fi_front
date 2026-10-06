// src/screens/_authenticated/DetailsScreen.tsx
import "../../styles/DetailsScreen.css";
import { Balance } from "../../components/DetailsScreen/Balance";
import type { FilterPeriod } from "../../components/DetailsScreen/Balance";
import { HistoryTable } from "../../components/DetailsScreen/HistoryTable";
import { DetailsScreenSkeleton } from "../../components/DetailsScreen/DetailsScreenSkeleton";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useDetailsSummary } from "../../hooks/useDetailsSummary";

const FILTER_STORAGE_KEY = "daily_fi_details_filter" as const;

export const DetailsScreen = () => {
    const [currentFilter, setCurrentFilter] = useLocalStorage<FilterPeriod>(
        FILTER_STORAGE_KEY,
        "month",
    );

    const { data: metrics, isLoading } = useDetailsSummary();

    // `isLoading` is only true while the query has no cached data and is
    // fetching for the first time (it already implies `isFetching`). Rendering
    // the skeleton during background refetches would introduce a layout shift,
    // so we gate it on the initial load only.
    if (isLoading) {
        return <DetailsScreenSkeleton />;
    }

    return (
        <div className="details-screen">
            <Balance
                metrics={metrics}
                currentFilter={currentFilter}
                onFilterChange={setCurrentFilter}
            />
            <HistoryTable filter={currentFilter} />
        </div>
    );
};

export default DetailsScreen;
