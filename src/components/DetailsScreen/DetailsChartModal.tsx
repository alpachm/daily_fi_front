// src/components/DetailsScreen/DetailsChartModal.tsx
import { useEffect, useMemo, useRef } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { FilterPeriod } from "./Balance";
import "./styles/DetailsChartModal.css";

export interface DetailsChartModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentFilter: FilterPeriod;
    onFilterChange: (filter: FilterPeriod) => void;
}

interface ChartDataPoint {
    label: string;
    value: number;
}

interface PeriodFilterOption {
    value: FilterPeriod;
    label: string;
}

const DAY_DATA: ChartDataPoint[] = [
    { label: "08:00", value: 320.5 },
    { label: "10:00", value: 335.2 },
    { label: "12:00", value: 328.7 },
    { label: "14:00", value: 342.1 },
    { label: "16:00", value: 355.4 },
    { label: "18:00", value: 348.9 },
    { label: "20:00", value: 345.2 },
];

const MONTH_DATA: ChartDataPoint[] = [
    { label: "01", value: 2100 },
    { label: "06", value: 2280 },
    { label: "11", value: 2210 },
    { label: "16", value: 2540 },
    { label: "21", value: 2630 },
    { label: "26", value: 2575 },
    { label: "30", value: 4210.45 },
];

const YEAR_VALUES: number[] = [
    18000, 19200, 18750, 21400, 22900, 24100, 23800, 25600, 27400, 28900, 30500, 31200,
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

const formatAxisValue = (value: number): string =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);

const formatTooltipValue = (
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

export const DetailsChartModal = ({
    isOpen,
    onClose,
    currentFilter,
    onFilterChange,
}: DetailsChartModalProps) => {
    const { t, i18n } = useTranslation("");
    const dialogRef = useRef<HTMLDivElement | null>(null);

    const filterOptions: PeriodFilterOption[] = useMemo(
        () => [
            { value: "day", label: t("DetailsScreen.filterDay") },
            { value: "month", label: t("DetailsScreen.filterMonth") },
            { value: "year", label: t("DetailsScreen.filterYear") },
        ],
        [t],
    );

    const chartData = useMemo<Record<FilterPeriod, ChartDataPoint[]>>(() => {
        const yearData: ChartDataPoint[] = YEAR_VALUES.map((value, index) => ({
            label: new Intl.DateTimeFormat(i18n.language, { month: "short" }).format(
                new Date(2024, index, 1),
            ),
            value,
        }));
        return { day: DAY_DATA, month: MONTH_DATA, year: yearData };
    }, [i18n.language]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (event: MouseEvent<HTMLDivElement>): void => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return createPortal(
        <div className="details-chart-modal__overlay" onClick={handleOverlayClick}>
            <div
                ref={dialogRef}
                className="details-chart-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="details-chart-modal-title"
                aria-describedby="details-chart-modal-description"
                tabIndex={-1}
            >
                <header className="details-chart-modal__header">
                    <div className="details-chart-modal__heading">
                        <h2 id="details-chart-modal-title" className="details-chart-modal__title">
                            {t("DetailsScreen.chartModalTitle")}
                        </h2>
                        <p
                            id="details-chart-modal-description"
                            className="details-chart-modal__description"
                        >
                            {t("DetailsScreen.chartModalDescription")}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="details-chart-modal__close"
                        onClick={onClose}
                        aria-label={t("Actions.close")}
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </header>

                <div
                    className="details-chart-modal__filters"
                    role="group"
                    aria-label={t("DetailsScreen.chartPeriodLabel")}
                >
                    {filterOptions.map((option) => {
                        const isActive = option.value === currentFilter;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                className={`details-chart-modal__filter${
                                    isActive ? " details-chart-modal__filter--active" : ""
                                }`}
                                aria-pressed={isActive}
                                onClick={() => onFilterChange(option.value)}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>

                <div
                    className="details-chart-modal__plot"
                    role="img"
                    aria-label={t("DetailsScreen.chartAriaLabel")}
                >
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart
                            data={chartData[currentFilter]}
                            margin={{ top: 10, right: 16, bottom: 0, left: 8 }}
                        >
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
                                tickFormatter={formatAxisValue}
                            />
                            <Tooltip
                                formatter={formatTooltipValue}
                                contentStyle={TOOLTIP_CONTENT_STYLE}
                                labelStyle={TOOLTIP_LABEL_STYLE}
                                itemStyle={TOOLTIP_ITEM_STYLE}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                name={t("DetailsScreen.chartSeriesName")}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default DetailsChartModal;

