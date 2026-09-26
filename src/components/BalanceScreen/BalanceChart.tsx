// src/components/BalanceScreen/BalanceChart.tsx
import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import "./styles/BalanceChart.css";

export interface BalanceDataPoint {
    date: string;
    amount: number;
}

interface BalanceChartProps {
    data?: BalanceDataPoint[];
    height?: number;
}

const MOCK_BALANCE_DATA: BalanceDataPoint[] = [
    { date: "01 Sep", amount: 1000 },
    { date: "03 Sep", amount: 1120 },
    { date: "05 Sep", amount: 1085 },
    { date: "07 Sep", amount: 1250 },
    { date: "09 Sep", amount: 1180 },
    { date: "11 Sep", amount: 1320 },
    { date: "13 Sep", amount: 1410 },
    { date: "15 Sep", amount: 1350 },
    { date: "17 Sep", amount: 1480 },
    { date: "19 Sep", amount: 1560 },
    { date: "21 Sep", amount: 1495 },
    { date: "23 Sep", amount: 1620 },
];

const TOOLTIP_CONTENT_STYLE: CSSProperties = {
    backgroundColor: "var(--card-background)",
    border: "1px solid var(--text-secondary)",
    borderRadius: "10px",
    color: "var(--text-primary)",
    fontSize: "0.875rem",
};

const TOOLTIP_LABEL_STYLE: CSSProperties = {
    color: "var(--text-secondary)",
    marginBottom: "0.25rem",
};

const TOOLTIP_ITEM_STYLE: CSSProperties = {
    color: "var(--text-primary)",
};

const formatAxisAmount = (value: number): string =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);

const formatTooltipAmount = (
    value: number | string | readonly (number | string)[] | undefined,
): string => {
    const numeric =
        typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
    if (!Number.isFinite(numeric)) return "";
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(numeric);
};

export const BalanceChart = ({
    data = MOCK_BALANCE_DATA,
    height = 300,
}: BalanceChartProps) => {
    const { t } = useTranslation("");

    return (
        <div
            className="balance-chart__plot"
            role="img"
            aria-label={t("BalanceScreen.chartAriaLabel")}
        >
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={8}
                        minTickGap={16}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        width={56}
                        tickMargin={8}
                        allowDecimals={false}
                        tickFormatter={formatAxisAmount}
                    />
                    <Tooltip
                        formatter={formatTooltipAmount}
                        contentStyle={TOOLTIP_CONTENT_STYLE}
                        labelStyle={TOOLTIP_LABEL_STYLE}
                        itemStyle={TOOLTIP_ITEM_STYLE}
                    />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        name={t("BalanceScreen.chartSeriesName")}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BalanceChart;
