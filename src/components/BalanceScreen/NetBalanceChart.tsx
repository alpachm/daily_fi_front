// src/components/BalanceScreen/NetBalanceChart.tsx
import { useMemo } from "react";
import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import {
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
import "./styles/NetBalanceChart.css";

export interface NetBalanceDataPoint {
    date: string;
    netValue: number;
}

interface NetBalanceChartProps {
    data: NetBalanceDataPoint[];
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

const resolveNetValueTone = (netValue: number): NetValueTone => {
    if (netValue > 0) return "positive";
    if (netValue < 0) return "negative";
    return "neutral";
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

const computeSymmetricalDomain = (data: NetBalanceDataPoint[]): [number, number] => {
    let maxAbsoluteValue = 0;

    for (const point of data) {
        maxAbsoluteValue = Math.max(maxAbsoluteValue, Math.abs(point.netValue));
    }

    const paddedMax = maxAbsoluteValue === 0 ? 1 : maxAbsoluteValue * 1.1;
    return [-paddedMax, paddedMax];
};

export const NetBalanceChart = ({
    data,
    height = 300,
}: NetBalanceChartProps) => {
    const { t } = useTranslation("");

    const domain = useMemo<[number, number]>(
        () => computeSymmetricalDomain(data),
        [data],
    );

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
                        dataKey="date"
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
                        domain={domain}
                        tickFormatter={formatSignedCurrency}
                    />
                    <Tooltip
                        formatter={formatTooltipValue}
                        contentStyle={TOOLTIP_CONTENT_STYLE}
                        labelStyle={TOOLTIP_LABEL_STYLE}
                        itemStyle={TOOLTIP_ITEM_STYLE}
                    />
                    <ReferenceLine
                        y={0}
                        stroke="var(--text-secondary)"
                        strokeOpacity={0.5}
                    />
                    <Bar
                        dataKey="netValue"
                        name={t("BalanceScreen.netResultLabel")}
                        maxBarSize={48}
                    >
                        {data.map((point) => (
                            <Cell
                                key={point.date}
                                fill={BAR_FILL_BY_TONE[resolveNetValueTone(point.netValue)]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default NetBalanceChart;
