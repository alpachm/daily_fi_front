// src/components/BalanceScreen/IncomeExpensesChart.tsx
import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import "./styles/IncomeExpensesChart.css";

export interface IncomeExpenseDataPoint {
    date: string;
    income: number;
    expenses: number;
}

interface IncomeExpensesChartProps {
    data: IncomeExpenseDataPoint[];
    height?: number;
}

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

export const IncomeExpensesChart = ({
    data,
    height = 300,
}: IncomeExpensesChartProps) => {
    const { t } = useTranslation("");

    return (
        <div
            className="income-expenses-chart__plot"
            role="img"
            aria-label={t("BalanceScreen.incomeExpensesAriaLabel")}
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
                    <Legend verticalAlign="top" height={36} />
                    <Area
                        type="monotone"
                        dataKey="income"
                        name={t("BalanceScreen.incomeLegend")}
                        className="income-expenses-chart__area--income"
                        stroke="var(--status-success)"
                        fill="var(--status-success)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, stroke: "var(--card-background)" }}
                    />
                    <Area
                        type="monotone"
                        dataKey="expenses"
                        name={t("BalanceScreen.expensesLegend")}
                        className="income-expenses-chart__area--expenses"
                        stroke="var(--status-error)"
                        fill="var(--status-error)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, stroke: "var(--card-background)" }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IncomeExpensesChart;
