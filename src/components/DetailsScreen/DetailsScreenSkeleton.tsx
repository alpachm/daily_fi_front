// src/components/DetailsScreen/DetailsScreenSkeleton.tsx
import { useTranslation } from "react-i18next";
import { Skeleton } from "../shared/Skeleton";
import "./styles/DetailsScreenSkeleton.css";

const METRIC_KEYS = [0, 1, 2] as const;
const HISTORY_ROW_KEYS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export const DetailsScreenSkeleton = () => {
    const { t } = useTranslation("");

    return (
        <div
            className="details-screen-skeleton"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <span className="details-screen-skeleton__sr-only">
                {t("Common.loading")}
            </span>

            {/* Balance summary card (mirrors .balance-summary) */}
            <section className="details-screen-skeleton__summary">
                <header className="details-screen-skeleton__summary-header">
                    <div className="details-screen-skeleton__heading">
                        <Skeleton className="details-screen-skeleton__title" />
                        <Skeleton className="details-screen-skeleton__period" />
                    </div>
                    <div className="details-screen-skeleton__actions">
                        <Skeleton className="details-screen-skeleton__button" />
                        <Skeleton className="details-screen-skeleton__button details-screen-skeleton__button--compact" />
                    </div>
                </header>

                <div className="details-screen-skeleton__metrics">
                    {METRIC_KEYS.map((key) => (
                        <div key={key} className="details-screen-skeleton__metric">
                            <Skeleton className="details-screen-skeleton__metric-label" />
                            <Skeleton className="details-screen-skeleton__metric-value" />
                        </div>
                    ))}
                </div>
            </section>

            {/* History table card (mirrors .history-table) */}
            <section className="details-screen-skeleton__history">
                <Skeleton className="details-screen-skeleton__history-title" />

                <div className="details-screen-skeleton__table">
                    <div className="details-screen-skeleton__row details-screen-skeleton__row--header">
                        <Skeleton className="details-screen-skeleton__cell" />
                        <Skeleton className="details-screen-skeleton__cell" />
                        <Skeleton className="details-screen-skeleton__cell" />
                    </div>

                    {HISTORY_ROW_KEYS.map((key) => (
                        <div key={key} className="details-screen-skeleton__row">
                            <Skeleton className="details-screen-skeleton__cell" />
                            <Skeleton className="details-screen-skeleton__cell" />
                            <Skeleton className="details-screen-skeleton__cell" />
                        </div>
                    ))}
                </div>

                <div className="details-screen-skeleton__pagination">
                    <Skeleton className="details-screen-skeleton__page" />
                    <Skeleton className="details-screen-skeleton__page" />
                    <Skeleton className="details-screen-skeleton__page" />
                </div>
            </section>
        </div>
    );
};

export default DetailsScreenSkeleton;
