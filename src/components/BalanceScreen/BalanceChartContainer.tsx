// src/components/BalanceScreen/BalanceChartContainer.tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles/BalanceChartContainer.css";
import type { BalanceTone } from "../../hooks/useDailyBalance";
import { useRecentDailyBalances } from "../../hooks/useRecentDailyBalances";
import { formatShortDate } from "../../utils/date";
import { Skeleton } from "../shared/Skeleton";
import { BalanceChart } from "./BalanceChart";
import { IncomeExpensesChart } from "./IncomeExpensesChart";
import type { IncomeExpenseDataPoint } from "./IncomeExpensesChart";

type BalanceChartTab = "general" | "income";

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
    const [activeTab, setActiveTab] = useState<BalanceChartTab>("general");

    const { data: recentBalances, isLoading, isError } = useRecentDailyBalances();

    const incomeExpenseData = useMemo<IncomeExpenseDataPoint[]>(() => {
        if (!recentBalances || recentBalances.length === 0) {
            return [];
        }

        return [...recentBalances]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((item) => ({
                date: formatShortDate(item.date, i18n.language),
                income: item.totalIncome,
                expenses: item.totalExpenses,
            }));
    }, [recentBalances, i18n.language]);

    return (
        <section className="balance-chart">
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
                    onClick={() => setActiveTab("general")}
                >
                    {t("BalanceScreen.tabGeneral")}
                </button>
                <button
                    type="button"
                    className={`balance-chart__tab${
                        activeTab === "income" ? " balance-chart__tab--active" : ""
                    }`}
                    aria-pressed={activeTab === "income"}
                    onClick={() => setActiveTab("income")}
                >
                    {t("BalanceScreen.tabIncome")}
                </button>
            </div>

            {activeTab === "general" ? (
                <BalanceChart />
            ) : isLoading ? (
                <div className="balance-chart__state" role="status" aria-live="polite" aria-busy="true">
                    <Skeleton className="balance-chart__state-skeleton" />
                    <span className="balance-chart__state-label">{t("Common.loading")}</span>
                </div>
            ) : isError ? (
                <div className="balance-chart__state" role="status" aria-live="polite">
                    <span className="balance-chart__state-label">{t("Common.error")}</span>
                </div>
            ) : incomeExpenseData.length === 0 ? (
                <div className="balance-chart__state" role="status" aria-live="polite">
                    <span className="balance-chart__state-label">{t("BalanceScreen.chartEmpty")}</span>
                </div>
            ) : (
                <IncomeExpensesChart data={incomeExpenseData} />
            )}
        </section>
    );
};

export default BalanceChartContainer;
