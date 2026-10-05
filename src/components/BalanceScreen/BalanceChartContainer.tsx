// src/components/BalanceScreen/BalanceChartContainer.tsx
import { useTranslation } from "react-i18next";
import "./styles/BalanceChartContainer.css";
import type { BalanceTone } from "../../hooks/useBalanceDiario";
import { BalanceChart } from "./BalanceChart";

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
    const { t } = useTranslation("");

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

            <BalanceChart />
        </section>
    );
};

export default BalanceChartContainer;
