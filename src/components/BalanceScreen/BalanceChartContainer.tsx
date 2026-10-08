// src/components/BalanceScreen/BalanceChartContainer.tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles/BalanceChartContainer.css";
import type { BalanceTone } from "../../hooks/useDailyBalance";
import { useRecentDailyBalances } from "../../hooks/useRecentDailyBalances";
import { formatShortDate } from "../../utils/date";
import { BalanceChart } from "../shared/BalanceChart";
import type { ChartDataPoint } from "../shared/BalanceChart";

type BalanceChartTab = "general" | "income";

const BALANCE_CHART_TAB_STORAGE_KEY = "selected_balance_chart_tab";

const readStoredTab = (): BalanceChartTab => {
    try {
        const stored = window.localStorage.getItem(BALANCE_CHART_TAB_STORAGE_KEY);
        if (stored === "general" || stored === "income") {
            return stored;
        }
    } catch (error) {
        console.warn(
            `BalanceChartContainer: failed to read "${BALANCE_CHART_TAB_STORAGE_KEY}"`,
            error,
        );
    }
    return "general";
};

interface BalanceChartContainerProps {
    totalNetDisplay: string;
    percentageChangeDisplay: string;
    percentageChangeTone: BalanceTone;
}

export const BalanceChartContainer = ({
    totalNetDisplay,
    percentageChangeDisplay,
    percentageChangeTone,
}: BalanceChartContainerProps) => {
    const { t, i18n } = useTranslation("");
    const [activeTab, setActiveTab] = useState<BalanceChartTab>(readStoredTab);

    const selectTab = (tab: BalanceChartTab): void => {
        setActiveTab(tab);
        try {
            window.localStorage.setItem(BALANCE_CHART_TAB_STORAGE_KEY, tab);
        } catch (error) {
            console.warn(
                `BalanceChartContainer: failed to write "${BALANCE_CHART_TAB_STORAGE_KEY}"`,
                error,
            );
        }
    };

    const { data: recentBalances, isLoading, isError } = useRecentDailyBalances();

    const netBalanceData = useMemo<ChartDataPoint[]>(() => {
        if (!recentBalances || recentBalances.length === 0) {
            return [];
        }

        return [...recentBalances]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((item) => ({
                label: formatShortDate(item.date, i18n.language),
                value: item.totalIncome - item.totalExpenses,
            }));
    }, [recentBalances, i18n.language]);

    const balanceData = useMemo<ChartDataPoint[]>(() => {
        if (!recentBalances || recentBalances.length === 0) {
            return [];
        }

        return [...recentBalances]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((item) => ({
                label: formatShortDate(item.date, i18n.language),
                value: item.closingBalance,
            }));
    }, [recentBalances, i18n.language]);

    return (
        <section className="balance-chart">
            <div className="balance-chart__header">
                <div className="balance-chart__summary">
                    <div className="balance-chart__metric">
                        <span className="balance-chart__metric-label">
                            {t("BalanceScreen.totalNetLabel")}
                        </span>
                        <span className="balance-chart__metric-value balance-chart__metric-value--neutral">
                            {totalNetDisplay}
                        </span>
                    </div>

                    <div className="balance-chart__metric">
                        <span className="balance-chart__metric-label">
                            {t("BalanceScreen.percentageChangeLabel")}
                        </span>
                        <span
                            className={`balance-chart__metric-value balance-chart__metric-value--${percentageChangeTone}`}
                        >
                            {percentageChangeDisplay}
                        </span>
                    </div>
                </div>

                <div
                    className="balance-chart__tabs"
                    role="group"
                    aria-label={t("BalanceScreen.chartTypeLabel")}
                >
                    <button
                        type="button"
                        className={`balance-chart__tab${
                            activeTab === "general" ? " balance-chart__tab--active" : ""
                        }`}
                        aria-pressed={activeTab === "general"}
                        onClick={() => selectTab("general")}
                    >
                        {t("BalanceScreen.tabGeneral")}
                    </button>
                    <button
                        type="button"
                        className={`balance-chart__tab${
                            activeTab === "income" ? " balance-chart__tab--active" : ""
                        }`}
                        aria-pressed={activeTab === "income"}
                        onClick={() => selectTab("income")}
                    >
                        {t("BalanceScreen.tabIncome")}
                    </button>
                </div>
            </div>

            {isError ? (
                <div className="balance-chart__state" role="status" aria-live="polite">
                    <span className="balance-chart__state-label">
                        {t("BalanceScreen.chartLoadError")}
                    </span>
                </div>
            ) : activeTab === "general" ? (
                balanceData.length === 0 && !isLoading ? (
                    <div className="balance-chart__state" role="status" aria-live="polite">
                        <span className="balance-chart__state-label">
                            {t("BalanceScreen.chartEmpty")}
                        </span>
                    </div>
                ) : (
                    <BalanceChart data={balanceData} metricMode="balance" isLoading={isLoading} />
                )
            ) : netBalanceData.length === 0 && !isLoading ? (
                <div className="balance-chart__state" role="status" aria-live="polite">
                    <span className="balance-chart__state-label">
                        {t("BalanceScreen.chartEmpty")}
                    </span>
                </div>
            ) : (
                <BalanceChart data={netBalanceData} metricMode="profit" isLoading={isLoading} />
            )}
        </section>
    );
};

export default BalanceChartContainer;
