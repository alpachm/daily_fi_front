// src/components/DetailsScreen/Balance.tsx
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { BalanceTone } from "../../hooks/useDailyBalance";
import { useAllDailyBalances } from "../../hooks/useAllDailyBalances";
import { useDetailsBalance } from "../../hooks/useDetailsBalance";
import { formatShortDate } from "../../utils/date";
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
    date?: string;
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
    const { data, isLoading, isError } = useAllDailyBalances({ page: 1, limit: 100 });

    const metrics = useDetailsBalance(data);

    const noDataLabel = t("DetailsScreen.noData");

    const bestDayTone: BalanceTone =
        metrics.bestDay.date === null ? "neutral" : "positive";
    const worstDayTone: BalanceTone =
        metrics.worstDay.date === null ? "neutral" : "negative";

    const bestDayDate =
        metrics.bestDay.date === null
            ? noDataLabel
            : formatShortDate(metrics.bestDay.date, i18n.language);

    const worstDayDate =
        metrics.worstDay.date === null
            ? noDataLabel
            : formatShortDate(metrics.worstDay.date, i18n.language);

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
            value: formatSignedCurrency(metrics.bestDay.value, i18n.language),
            tone: bestDayTone,
            icon: TrendingUp,
            date: bestDayDate,
        },
        {
            key: "worst",
            label: t("DetailsScreen.worstDay"),
            value: formatSignedCurrency(metrics.worstDay.value, i18n.language),
            tone: worstDayTone,
            icon: TrendingDown,
            date: worstDayDate,
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
                    {metricItems.map(({ key, label, value, tone, icon: Icon, date }) => (
                        <div key={key} className="balance-summary__metric">
                            <span className="balance-summary__metric-label">{label}</span>
                            <span
                                className={`balance-summary__metric-value balance-summary__metric-value--${tone}`}
                            >
                                {Icon ? <Icon size={20} aria-hidden="true" /> : null}
                                {value}
                            </span>
                            {date ? (
                                <span className="balance-summary__metric-date">{date}</span>
                            ) : null}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Balance;
