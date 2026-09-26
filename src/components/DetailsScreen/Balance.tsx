// src/components/DetailsScreen/Balance.tsx
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import { Filter, TrendingDown, TrendingUp } from "lucide-react";
import type { BalanceTone } from "../../hooks/useBalanceDiario";
import "../styles/DetailsScreen/Balance.css";

export interface SummaryMetrics {
    totalBalance: number; // e.g., 345.2
    bestDay: number; // e.g., 119.2
    worstDay: number; // e.g., -35.7
}

interface BalanceProps {
    metrics?: SummaryMetrics;
    onFilter?: () => void;
}

interface MetricItem {
    key: "total" | "best" | "worst";
    label: string;
    value: string;
    tone: BalanceTone;
    icon?: LucideIcon;
}

const MOCK_SUMMARY_METRICS: SummaryMetrics = {
    totalBalance: 345.2,
    bestDay: 119.2,
    worstDay: -35.7,
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

export const Balance = ({ metrics = MOCK_SUMMARY_METRICS, onFilter }: BalanceProps) => {
    const { t, i18n } = useTranslation("");

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
                    <p className="balance-summary__period">{t("DetailsScreen.balancePeriod")}</p>
                </div>

                <button
                    type="button"
                    className="balance-summary__filter"
                    onClick={onFilter}
                    aria-label={t("DetailsScreen.balanceFilterLabel")}
                >
                    <Filter size={18} aria-hidden="true" />
                </button>
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
