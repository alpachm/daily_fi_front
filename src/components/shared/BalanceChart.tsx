// src/components/common/BalanceChart.tsx
import { useMemo } from "react";
import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Skeleton } from "./Skeleton";
import "./styles/BalanceChart.css";

export interface ChartDataPoint {
    label: string;
    value: number;
    income?: number;
    expenses?: number;
}

export interface BalanceChartProps {
    data: ChartDataPoint[];
    metricMode: "balance" | "profit";
    isLoading?: boolean;
    height?: number;
}

type NetValueTone = "positive" | "negative" | "neutral";

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

const BAR_FILL_BY_TONE: Record<NetValueTone, string> = {
    positive: "var(--status-success)",
    negative: "var(--status-error)",
    neutral: "var(--text-secondary)",
};

const resolveNetValueTone = (value: number): NetValueTone => {
    if (value > 0) return "positive";
    if (value < 0) return "negative";
    return "neutral";
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

const formatSignedCurrency = (value: number): string =>
    new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        signDisplay: "exceptZero",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);

const formatTooltipValue = (
    value: number | string | readonly (number | string)[] | undefined,
): string => {
    const numeric =
        typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
    if (!Number.isFinite(numeric)) return "";
    return formatSignedCurrency(numeric);
};

const computeSymmetricalDomain = (data: ChartDataPoint[]): [number, number] => {
    let maxAbsoluteValue = 0;

    for (const point of data) {
        maxAbsoluteValue = Math.max(maxAbsoluteValue, Math.abs(point.value));
    }

    const paddedMax = maxAbsoluteValue === 0 ? 1 : maxAbsoluteValue * 1.1;
    return [-paddedMax, paddedMax];
};

export const BalanceChart = ({
    data,
    metricMode,
    isLoading = false,
    height = 300,
}: BalanceChartProps) => {
    const { t } = useTranslation("");

    const profitDomain = useMemo<[number, number]>(() => computeSymmetricalDomain(data), [data]);

    if (isLoading) {
        return (
            <div
                className="balance-chart__loading"
                role="status"
                aria-live="polite"
                aria-busy="true"
            >
                <Skeleton className="balance-chart__loading-skeleton" />
                <span className="balance-chart__loading-label">{t("Common.loading")}</span>
            </div>
        );
    }

    if (metricMode === "profit") {
        return (
            <div
                className="net-balance-chart__plot"
                role="img"
                aria-label={t("BalanceScreen.netBalanceAriaLabel")}
            >
                <ResponsiveContainer width="100%" height={height}>
                    <BarChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={8}
                            minTickGap={16}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={76}
                            tickMargin={8}
                            domain={profitDomain}
                            tickFormatter={formatSignedCurrency}
                        />
                        <Tooltip
                            formatter={formatTooltipValue}
                            contentStyle={TOOLTIP_CONTENT_STYLE}
                            labelStyle={TOOLTIP_LABEL_STYLE}
                            itemStyle={TOOLTIP_ITEM_STYLE}
                        />
                        <ReferenceLine y={0} stroke="var(--text-secondary)" strokeOpacity={0.5} />
                        <Bar
                            dataKey="value"
                            name={t("BalanceScreen.netResultLabel")}
                            maxBarSize={48}
                        >
                            {data.map((point) => (
                                <Cell
                                    key={point.label}
                                    fill={BAR_FILL_BY_TONE[resolveNetValueTone(point.value)]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }

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
                        dataKey="label"
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
                        dataKey="value"
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
