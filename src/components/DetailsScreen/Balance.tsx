// src/components/DetailsScreen/Balance.tsx
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { BalanceTone } from "../../hooks/useBalanceDiario";
import { useBalanceFilter } from "../../hooks/useBalanceFilter";
import type { FilterOption } from "../../hooks/useBalanceFilter";
import { BalanceFilterMenu } from "./BalanceFilterMenu";
import "./styles/Balance.css";

export type FilterPeriod = "day" | "month" | "year";

export interface SummaryMetrics {
    totalBalance: number;
    bestDay: number;
    worstDay: number;
}

export type SummaryMetricsByPeriod = Record<FilterPeriod, SummaryMetrics>;

interface BalanceProps {
    metrics?: SummaryMetricsByPeriod;
    initialPeriod?: FilterPeriod;
    onFilterChange?: (period: FilterPeriod) => void;
}

interface MetricItem {
    key: "total" | "best" | "worst";
    label: string;
    value: string;
    tone: BalanceTone;
    icon?: LucideIcon;
}

const MOCK_SUMMARY_METRICS: SummaryMetricsByPeriod = {
    day: { totalBalance: 345.2, bestDay: 119.2, worstDay: -35.7 },
    month: { totalBalance: 4210.45, bestDay: 320.8, worstDay: -112.4 },
    year: { totalBalance: 48250.15, bestDay: 980, worstDay: -450.25 },
};

const PERIOD_LABEL_KEYS: Record<FilterPeriod, string> = {
    day: "DetailsScreen.periodDay",
    month: "DetailsScreen.periodMonth",
    year: "DetailsScreen.periodYear",
};

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

export const Balance = ({
    metrics = MOCK_SUMMARY_METRICS,
    initialPeriod = "month",
    onFilterChange,
}: BalanceProps) => {
    const { t, i18n } = useTranslation("");
    const { period, isOpen, containerRef, toggle, select } = useBalanceFilter(initialPeriod);

    const currentMetrics = metrics[period];

    const filterOptions: FilterOption[] = useMemo(
        () => [
            { value: "day", label: t("DetailsScreen.filterDay") },
            { value: "month", label: t("DetailsScreen.filterMonth") },
            { value: "year", label: t("DetailsScreen.filterYear") },
        ],
        [t],
    );

    const metricItems: MetricItem[] = [
        {
            key: "total",
            label: t("DetailsScreen.totalBalance"),
            value: formatCurrency(currentMetrics.totalBalance, i18n.language),
            tone: getTone(currentMetrics.totalBalance),
        },
        {
            key: "best",
            label: t("DetailsScreen.bestDay"),
            value: formatSignedCurrency(currentMetrics.bestDay, i18n.language),
            tone: "positive",
            icon: TrendingUp,
        },
        {
            key: "worst",
            label: t("DetailsScreen.worstDay"),
            value: formatSignedCurrency(currentMetrics.worstDay, i18n.language),
            tone: "negative",
            icon: TrendingDown,
        },
    ];

    const handleSelect = (next: FilterPeriod): void => {
        select(next);
        onFilterChange?.(next);
    };

    return (
        <section className="balance-summary" aria-labelledby="balance-summary-title">
            <header className="balance-summary__header">
                <div className="balance-summary__heading">
                    <h2 id="balance-summary-title" className="balance-summary__title">
                        {t("DetailsScreen.balanceSummaryTitle")}
                    </h2>
                    <p className="balance-summary__period">{t(PERIOD_LABEL_KEYS[period])}</p>
                </div>

                <BalanceFilterMenu
                    options={filterOptions}
                    selected={period}
                    isOpen={isOpen}
                    containerRef={containerRef}
                    menuId="balance-summary-filter-menu"
                    triggerLabel={t("DetailsScreen.balanceFilterLabel")}
                    note={t("DetailsScreen.filterNote")}
                    onToggle={toggle}
                    onSelect={handleSelect}
                />
            </header>

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
        </section>
    );
};

export default Balance;
