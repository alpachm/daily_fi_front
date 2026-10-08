// src/components/BalanceScreen/BalanceScreenSkeleton.tsx
import { useTranslation } from "react-i18next";
import { Skeleton } from "../shared/Skeleton";
import "./styles/BalanceScreenSkeleton.css";

export const BalanceScreenSkeleton = () => {
    const { t } = useTranslation("");

    return (
        <div
            className="balance-screen-skeleton"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <span className="balance-screen-skeleton__sr-only">
                {t("Common.loading")}
            </span>

            <section className="balance-screen-skeleton__chart">
                <div className="balance-screen-skeleton__summary">
                    <div className="balance-screen-skeleton__metric">
                        <Skeleton className="balance-screen-skeleton__label" />
                        <Skeleton className="balance-screen-skeleton__value" />
                    </div>
                    <div className="balance-screen-skeleton__metric">
                        <Skeleton className="balance-screen-skeleton__label" />
                        <Skeleton className="balance-screen-skeleton__value" />
                    </div>
                </div>

                <Skeleton className="balance-screen-skeleton__plot" />
            </section>

            <div className="balance-screen-skeleton__columns">
                {/* Previous day card: read-only values + net footer (mirrors DayEntryBlock block="previous") */}
                <section className="balance-screen-skeleton__card">
                    <header className="balance-screen-skeleton__header">
                        <Skeleton className="balance-screen-skeleton__title" />
                        <Skeleton className="balance-screen-skeleton__subtitle" />
                    </header>

                    <div className="balance-screen-skeleton__fields">
                        <div className="balance-screen-skeleton__field">
                            <Skeleton className="balance-screen-skeleton__field-label" />
                            <Skeleton className="balance-screen-skeleton__field-value" />
                        </div>
                        <div className="balance-screen-skeleton__field">
                            <Skeleton className="balance-screen-skeleton__field-label" />
                            <Skeleton className="balance-screen-skeleton__field-value" />
                        </div>
                    </div>

                    <footer className="balance-screen-skeleton__footer">
                        <Skeleton className="balance-screen-skeleton__net-label" />
                        <Skeleton className="balance-screen-skeleton__net-value" />
                    </footer>
                </section>

                {/* Today card: editable inputs + confirm button (mirrors DayEntryBlock block="today") */}
                <section className="balance-screen-skeleton__card">
                    <header className="balance-screen-skeleton__header">
                        <Skeleton className="balance-screen-skeleton__title" />
                        <Skeleton className="balance-screen-skeleton__subtitle" />
                    </header>

                    <div className="balance-screen-skeleton__fields">
                        <div className="balance-screen-skeleton__field">
                            <Skeleton className="balance-screen-skeleton__field-label" />
                            <Skeleton className="balance-screen-skeleton__field-input" />
                        </div>
                        <div className="balance-screen-skeleton__field">
                            <Skeleton className="balance-screen-skeleton__field-label" />
                            <Skeleton className="balance-screen-skeleton__field-input" />
                        </div>
                    </div>

                    <Skeleton className="balance-screen-skeleton__confirm" />
                </section>
            </div>
        </div>
    );
};

export default BalanceScreenSkeleton;
