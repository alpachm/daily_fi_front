// src/components/DetailsScreen/Balance.tsx
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { BalanceTone } from "../../hooks/useDailyBalance";
import { useDetailsBalance } from "../../hooks/useDetailsBalance";
import { Skeleton } from "../shared/Skeleton";
import "./styles/Balance.css";

// Kept in this module because the details screen's filter controls
// (BalanceFilterMenu, useBalanceFilter, DetailsChartModal and HistoryTable)
// still import it from here while the filter is moved to the history table.
export type FilterPeriod = "day" | "month" | "year";

interface MetricItem {
    key: "total" | "best" | "worst";
    label: string;
    value: string;
    tone: BalanceTone;
    icon?: LucideIcon;
}

const METRIC_SKELETON_KEYS: MetricItem["key"][] = ["total", "best", "worst"];

const getTone = (value: number): BalanceTone => {
    if (value > 0) return "positive";
    if (value < 0) return "negative";
    return "neutral";
};

const formatCurrency = (value: number, locale: string): string =>
    new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);

const formatSignedCurrency = (value: number, locale: string): string => {
    const absolute = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Math.abs(value));
    if (value > 0) return `+${absolute}`;
    if (value < 0) return `-${absolute}`;
    return absolute;
};

export const Balance = () => {
    const { t, i18n } = useTranslation("");
    const { metrics, isLoading, isError } = useDetailsBalance();

    const metricItems: MetricItem[] = [
        {
            key: "total",
            label: t("DetailsScreen.totalBalance"),
            value: formatCurrency(metrics.totalBalance, i18n.language),
            tone: getTone(metrics.totalBalance),
        },
        {
            key: "best",
            label: t("DetailsScreen.bestDay"),
            value: formatSignedCurrency(metrics.bestDay, i18n.language),
            tone: "positive",
            icon: TrendingUp,
        },
        {
            key: "worst",
            label: t("DetailsScreen.worstDay"),
            value: formatSignedCurrency(metrics.worstDay, i18n.language),
            tone: "negative",
            icon: TrendingDown,
        },
    ];

    return (
        <section className="balance-summary" aria-labelledby="balance-summary-title">
            <header className="balance-summary__header">
                <div className="balance-summary__heading">
                    <h2 id="balance-summary-title" className="balance-summary__title">
                        {t("DetailsScreen.balanceSummaryTitle")}
                    </h2>
                    <p className="balance-summary__period">
                        {t("DetailsScreen.balanceTitleDay")}
                    </p>
                </div>
            </header>

            {isLoading ? (
                <div
                    className="balance-summary__metrics"
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                >
                    {METRIC_SKELETON_KEYS.map((key) => (
                        <div key={key} className="balance-summary__metric">
                            <Skeleton className="balance-summary__metric-skeleton balance-summary__metric-skeleton--label" />
                            <Skeleton className="balance-summary__metric-skeleton balance-summary__metric-skeleton--value" />
                        </div>
                    ))}
                </div>
            ) : isError ? (
                <p className="balance-summary__state" role="status" aria-live="polite">
                    {t("Common.error")}
                </p>
            ) : (
                <div className="balance-summary__metrics">
                    {metricItems.map(({ key, label, value, tone, icon: Icon }) => (
                        <div key={key} className="balance-summary__metric">
                            <span className="balance-summary__metric-label">{label}</span>
                            <span
                                className={`balance-summary__metric-value balance-summary__metric-value--${tone}`}
                            >
                                {Icon ? <Icon size={20} aria-hidden="true" /> : null}
                                {value}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Balance;
