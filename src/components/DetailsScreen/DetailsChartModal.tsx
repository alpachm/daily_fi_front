// src/components/DetailsScreen/DetailsChartModal.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useAllDailyBalances } from "../../hooks/useAllDailyBalances";
import { useMonthlyBalances } from "../../hooks/useMonthlyBalances";
import { useYearlyBalances } from "../../hooks/useYearlyBalances";
import type { DailyBalanceItem } from "../../interfaces/GetAllDailyBalancesService.interface";
import type { MonthlyBalanceItem } from "../../interfaces/GetMonthlyBalancesService.interface";
import type { YearlyBalanceItem } from "../../interfaces/GetYearlyBalancesService.interface";
import { formatShortDate } from "../../utils/date";
import { BalanceChart } from "../shared/BalanceChart";
import type { ChartDataPoint } from "../shared/BalanceChart";
import type { FilterPeriod } from "./Balance";
import "./styles/DetailsChartModal.css";

export interface DetailsChartModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentFilter: FilterPeriod;
    onFilterChange: (filter: FilterPeriod) => void;
}

interface PeriodFilterOption {
    value: FilterPeriod;
    label: string;
}

type MetricMode = "balance" | "profit";

interface MetricOption {
    value: MetricMode;
    label: string;
}

const CHART_PAGE_SIZE = 100;

const formatMonthPeriod = (year: number, month: number, locale: string): string =>
    new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
    }).format(new Date(year, month - 1, 1));

const mapDailyBalanceToChartPoint = (
    item: DailyBalanceItem,
    locale: string,
    metricMode: MetricMode,
): ChartDataPoint => ({
    label: formatShortDate(item.date, locale),
    value:
        metricMode === "balance"
            ? item.closingBalance
            : item.totalIncome - item.totalExpenses,
});

const mapMonthlyBalanceToChartPoint = (
    item: MonthlyBalanceItem,
    locale: string,
    metricMode: MetricMode,
): ChartDataPoint => ({
    label: formatMonthPeriod(item.year, item.month, locale),
    value: metricMode === "balance" ? item.closingBalance : item.netProfit,
});

const mapYearlyBalanceToChartPoint = (
    item: YearlyBalanceItem,
    metricMode: MetricMode,
): ChartDataPoint => ({
    label: String(item.year),
    value: metricMode === "balance" ? item.closingBalance : item.netProfit,
});

export const DetailsChartModal = ({
    isOpen,
    onClose,
    currentFilter,
    onFilterChange,
}: DetailsChartModalProps) => {
    const { t, i18n } = useTranslation("");
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const [metricMode, setMetricMode] = useState<MetricMode>("balance");

    const filterOptions: PeriodFilterOption[] = useMemo(
        () => [
            { value: "day", label: t("DetailsScreen.filterDay") },
            { value: "month", label: t("DetailsScreen.filterMonth") },
            { value: "year", label: t("DetailsScreen.filterYear") },
        ],
        [t],
    );

    const metricOptions: MetricOption[] = useMemo(
        () => [
            { value: "balance", label: t("DetailsScreen.tabGeneral") },
            { value: "profit", label: t("DetailsScreen.tabIncome") },
        ],
        [t],
    );

    const dailyQuery = useAllDailyBalances(
        { page: 1, limit: CHART_PAGE_SIZE },
        { enabled: isOpen && currentFilter === "day" },
    );
    const monthlyQuery = useMonthlyBalances(
        { page: 1, limit: CHART_PAGE_SIZE },
        { enabled: isOpen && currentFilter === "month" },
    );
    const yearlyQuery = useYearlyBalances(
        { page: 1, limit: CHART_PAGE_SIZE },
        { enabled: isOpen && currentFilter === "year" },
    );

    const chartData = useMemo<ChartDataPoint[]>(() => {
        switch (currentFilter) {
            case "day":
                return (dailyQuery.data ?? [])
                    .slice()
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((item) =>
                        mapDailyBalanceToChartPoint(item, i18n.language, metricMode),
                    );
            case "month":
                return (monthlyQuery.data ?? [])
                    .slice()
                    .sort((a, b) => a.year - b.year || a.month - b.month)
                    .map((item) =>
                        mapMonthlyBalanceToChartPoint(item, i18n.language, metricMode),
                    );
            case "year":
                return (yearlyQuery.data ?? [])
                    .slice()
                    .sort((a, b) => a.year - b.year)
                    .map((item) => mapYearlyBalanceToChartPoint(item, metricMode));
        }
    }, [
        currentFilter,
        metricMode,
        dailyQuery.data,
        monthlyQuery.data,
        yearlyQuery.data,
        i18n.language,
    ]);

    const isLoading = useMemo<boolean>(() => {
        switch (currentFilter) {
            case "day":
                return dailyQuery.isLoading;
            case "month":
                return monthlyQuery.isLoading;
            case "year":
                return yearlyQuery.isLoading;
        }
    }, [currentFilter, dailyQuery.isLoading, monthlyQuery.isLoading, yearlyQuery.isLoading]);

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
                    className="details-chart-modal__metrics"
                    role="group"
                    aria-label={t("DetailsScreen.chartMetricLabel")}
                >
                    {metricOptions.map((option) => {
                        const isActive = option.value === metricMode;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                className={`details-chart-modal__metric${
                                    isActive
                                        ? " details-chart-modal__metric--active"
                                        : ""
                                }`}
                                aria-pressed={isActive}
                                onClick={() => setMetricMode(option.value)}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>

                <BalanceChart
                    data={chartData}
                    metricMode={metricMode}
                    isLoading={isLoading}
                    height={320}
                />
            </div>
        </div>,
        document.body,
    );
};

export default DetailsChartModal;

