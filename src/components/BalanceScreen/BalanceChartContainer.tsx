// src/components/BalanceScreen/BalanceChartContainer.tsx
import { useTranslation } from "react-i18next";
import { TrendingDown, TrendingUp } from "lucide-react";
import "./styles/BalanceChartContainer.css";
import type { BalanceTone } from "../../hooks/useBalanceDiario";
import { BalanceChart } from "./BalanceChart";

interface BalanceChartContainerProps {
    net: number;
    tone: BalanceTone;
    percentageChange: number;
    formatSignedAmount: (value: number) => string;
    formatPercentage: (value: number) => string;
}

export const BalanceChartContainer = ({
    net,
    tone,
    percentageChange,
    formatSignedAmount,
    formatPercentage,
}: BalanceChartContainerProps) => {
    const { t } = useTranslation("");

    return (
        <section className="balance-chart">
            <div className="balance-chart__summary">
                <div className="balance-chart__metric">
                    <span className="balance-chart__metric-label">
                        {t("BalanceScreen.totalNetLabel")}
                    </span>
                    <span
                        className={`balance-chart__metric-value balance-chart__metric-value--${tone}`}
                    >
                        {tone === "negative" ? (
                            <TrendingDown size={22} aria-hidden="true" />
                        ) : tone === "positive" ? (
                            <TrendingUp size={22} aria-hidden="true" />
                        ) : null}
                        {formatSignedAmount(net)}
                    </span>
                </div>

                <div className="balance-chart__metric">
                    <span className="balance-chart__metric-label">
                        {t("BalanceScreen.percentageChangeLabel")}
                    </span>
                    <span
                        className={`balance-chart__metric-value balance-chart__metric-value--${tone}`}
                    >
                        {formatPercentage(percentageChange)}
                    </span>
                </div>
            </div>

            <BalanceChart />
        </section>
    );
};

export default BalanceChartContainer;
