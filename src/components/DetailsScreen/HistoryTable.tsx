// src/components/DetailsScreen/HistoryTable.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import {
    BadgeDollarSign,
    ChartLine,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    ShoppingCart,
} from "lucide-react";
import { useAllDailyBalances } from "../../hooks/useAllDailyBalances";
import { useMonthlyBalances } from "../../hooks/useMonthlyBalances";
import { useBalanceFilter } from "../../hooks/useBalanceFilter";
import type { FilterOption } from "../../hooks/useBalanceFilter";
import type { DailyBalanceItem } from "../../interfaces/GetAllDailyBalancesService.interface";
import type { MonthlyBalanceItem } from "../../interfaces/GetMonthlyBalancesService.interface";
import { formatFullDate } from "../../utils/date";
import type { FilterPeriod } from "./Balance";
import { BalanceFilterMenu } from "./BalanceFilterMenu";
import { DetailsChartModal } from "./DetailsChartModal";
import { Skeleton } from "../shared/Skeleton";
import "./styles/HistoryTable.css";

export interface HistoryRecord {
    id: string;
    isoDate: string;
    date: string;
    openingBalance: number;
    closingBalance: number;
    totalIncome: number;
    totalExpenses: number;
}

interface AggregatedHistoryRecord {
    id: string;
    period: string;
    openingBalance: number;
    closingBalance: number;
    netProfit: number;
}

type ActionMenuHandler = (
    record: HistoryRecord | AggregatedHistoryRecord,
) => void;

interface ActionMenuItem {
    id: string;
    label: string;
    icon: LucideIcon;
    onSelect: ActionMenuHandler;
}

type AmountTone = "positive" | "negative" | "neutral";

type ViewMode = "days" | "months" | "years";

const PAGE_SIZE_OPTIONS: number[] = [10, 50, 100];
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_FILTER: FilterPeriod = "day";
const DEFAULT_VIEW_MODE: ViewMode = "days";

const FILTER_TO_VIEW_MODE: Record<FilterPeriod, ViewMode> = {
    day: "days",
    month: "months",
    year: "years",
};

const getAmountTone = (value: number): AmountTone => {
    if (value > 0) return "positive";
    if (value < 0) return "negative";
    return "neutral";
};

const getNetProfitTone = (value: number): AmountTone =>
    value >= 0 ? "positive" : "negative";

const resolveDayProfitLoss = (record: HistoryRecord): number => {
    if (record.totalIncome > 0) return record.totalIncome;
    if (record.totalExpenses > 0) return -record.totalExpenses;
    return 0;
};

const formatSignedCurrency = (value: number, locale: string): string => {
    const absolute = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Math.abs(value));

    if (value > 0) return `+${absolute}`;
    if (value < 0) return `-${absolute}`;
    return absolute;
};

const formatCurrency = (value: number, locale: string): string =>
    new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);

const formatMonthPeriod = (year: number, month: number, locale: string): string =>
    new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
    }).format(new Date(year, month - 1, 1));

const mapMonthlyBalanceToHistoryRecord = (
    item: MonthlyBalanceItem,
    locale: string,
): AggregatedHistoryRecord => ({
    id: String(item.id),
    period: formatMonthPeriod(item.year, item.month, locale),
    openingBalance: item.openingBalance,
    closingBalance: item.closingBalance,
    netProfit: item.netProfit,
});

const mapDailyBalanceToHistoryRecord = (
    item: DailyBalanceItem,
    locale: string,
): HistoryRecord => ({
    id: String(item.id),
    isoDate: item.date,
    date: formatFullDate(item.date, locale),
    openingBalance: item.openingBalance,
    closingBalance: item.closingBalance,
    totalIncome: item.totalIncome,
    totalExpenses: item.totalExpenses,
});

const handleShowPurchaseVouchers: ActionMenuHandler = (record) => {
    console.log("HistoryTable: show purchase vouchers", record.id);
};

const handleShowSaleVouchers: ActionMenuHandler = (record) => {
    console.log("HistoryTable: show sale vouchers", record.id);
};

export const HistoryTable = () => {
    const { t, i18n } = useTranslation("");
    const [page, setPage] = useState<number>(DEFAULT_PAGE);
    const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
    const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const [filter, setFilter] = useState<FilterPeriod>(DEFAULT_FILTER);
    const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW_MODE);
    const [isChartModalOpen, setIsChartModalOpen] = useState<boolean>(false);

    const { isOpen, containerRef, toggle, select } = useBalanceFilter(
        filter,
        setFilter,
    );

    const filterOptions = useMemo<FilterOption[]>(
        () => [
            { value: "day", label: t("DetailsScreen.filterDays") },
            { value: "month", label: t("DetailsScreen.filterMonths") },
            { value: "year", label: t("DetailsScreen.filterYears") },
        ],
        [t],
    );

    const dailyQuery = useAllDailyBalances(
        { page, limit },
        { enabled: viewMode === "days" },
    );

    const monthlyQuery = useMonthlyBalances(
        { page, limit },
        { enabled: viewMode === "months" },
    );

    const openChartModal = (): void => setIsChartModalOpen(true);
    const closeChartModal = (): void => setIsChartModalOpen(false);

    const handleFilterSelect = (nextFilter: FilterPeriod): void => {
        select(nextFilter);
        setViewMode(FILTER_TO_VIEW_MODE[nextFilter]);
        setPage(DEFAULT_PAGE);
    };

    const dailyRecords = useMemo<HistoryRecord[]>(
        () =>
            (dailyQuery.data ?? []).map((item) =>
                mapDailyBalanceToHistoryRecord(item, i18n.language),
            ),
        [dailyQuery.data, i18n.language],
    );

    const monthlyRecords = useMemo<AggregatedHistoryRecord[]>(
        () =>
            (monthlyQuery.data ?? []).map((item) =>
                mapMonthlyBalanceToHistoryRecord(item, i18n.language),
            ),
        [monthlyQuery.data, i18n.language],
    );

    // Placeholder: the "years" aggregation endpoint is not available yet.
    const yearsRecords: AggregatedHistoryRecord[] = [];

    const aggregatedRecords: AggregatedHistoryRecord[] =
        viewMode === "months" ? monthlyRecords : yearsRecords;

    const activeRecords =
        viewMode === "days" ? dailyRecords : aggregatedRecords;

    const isLoading =
        viewMode === "days"
            ? dailyQuery.isLoading
            : viewMode === "months"
              ? monthlyQuery.isLoading
              : false;

    const isError =
        viewMode === "days"
            ? dailyQuery.isError
            : viewMode === "months"
              ? monthlyQuery.isError
              : false;

    const actionItems = useMemo<ActionMenuItem[]>(
        () => [
            {
                id: "purchase-vouchers",
                label: t("DetailsScreen.optionShowPurchaseVouchers"),
                icon: ShoppingCart,
                onSelect: handleShowPurchaseVouchers,
            },
            {
                id: "sale-vouchers",
                label: t("DetailsScreen.optionShowSaleVouchers"),
                icon: BadgeDollarSign,
                onSelect: handleShowSaleVouchers,
            },
        ],
        [t],
    );

    const hasPreviousPage = page > DEFAULT_PAGE;
    const hasNextPage = activeRecords.length === limit;

    const handleLimitChange = (event: ChangeEvent<HTMLSelectElement>): void => {
        setLimit(Number(event.target.value));
        setPage(DEFAULT_PAGE);
    };

    const handlePreviousPage = (): void => {
        setPage((current) => Math.max(DEFAULT_PAGE, current - 1));
    };

    const handleNextPage = (): void => {
        setPage((current) => current + 1);
    };

    useEffect(() => {
        if (openMenuRowId === null) return;

        const handleOutsidePointerDown = (event: MouseEvent): void => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node)
            ) {
                setOpenMenuRowId(null);
            }
        };

        const handleEscapeKeyDown = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                setOpenMenuRowId(null);
            }
        };

        document.addEventListener("mousedown", handleOutsidePointerDown);
        document.addEventListener("keydown", handleEscapeKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleOutsidePointerDown);
            document.removeEventListener("keydown", handleEscapeKeyDown);
        };
    }, [openMenuRowId]);

    const renderOptionsCell = (
        record: HistoryRecord | AggregatedHistoryRecord,
    ) => {
        const isOpen = openMenuRowId === record.id;

        return (
            <td className="history-table__cell">
                <div
                    className="history-table__options-cell"
                    ref={isOpen ? popoverRef : undefined}
                >
                    <button
                        type="button"
                        className="history-table__options-button"
                        aria-label={t("DetailsScreen.tableOptionsMenuLabel")}
                        aria-haspopup="menu"
                        aria-expanded={isOpen}
                        onClick={() =>
                            setOpenMenuRowId((current) =>
                                current === record.id ? null : record.id,
                            )
                        }
                    >
                        <MoreHorizontal size={18} aria-hidden="true" />
                    </button>

                    {isOpen ? (
                        <div
                            className="history-table__action-popover"
                            role="menu"
                            aria-label={t(
                                "DetailsScreen.tableOptionsMenuLabel",
                            )}
                        >
                            {actionItems.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className="history-table__action-item"
                                    role="menuitem"
                                    onClick={() => {
                                        item.onSelect(record);
                                        setOpenMenuRowId(null);
                                    }}
                                >
                                    <item.icon
                                        size={16}
                                        aria-hidden="true"
                                    />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>
            </td>
        );
    };

    return (
        <section className="history-table" aria-labelledby="history-table-title">
            <header className="history-table__header">
                <h2 id="history-table-title" className="history-table__title">
                    {t("DetailsScreen.historyTitle")}
                </h2>

                <div className="history-table__actions">
                    <button
                        type="button"
                        className="history-table__chart-button"
                        onClick={openChartModal}
                    >
                        <ChartLine size={18} aria-hidden="true" />
                        <span>{t("DetailsScreen.viewChart")}</span>
                    </button>

                    <BalanceFilterMenu
                        options={filterOptions}
                        selected={filter}
                        isOpen={isOpen}
                        containerRef={containerRef}
                        menuId="history-table-filter-menu"
                        triggerLabel={t("DetailsScreen.balanceFilterLabel")}
                        note={t("DetailsScreen.filterNote")}
                        onToggle={toggle}
                        onSelect={handleFilterSelect}
                    />
                </div>
            </header>

            <div className="history-table__container">
                <table className="history-table__table">
                    <thead>
                        <tr>
                            <th scope="col" className="history-table__header-cell">
                                {viewMode === "days"
                                    ? t("DetailsScreen.tableHeaderDate")
                                    : t("DetailsScreen.tableHeaderPeriod")}
                            </th>
                            <th scope="col" className="history-table__header-cell">
                                {t("DetailsScreen.tableHeaderOpeningBalance")}
                            </th>
                            <th scope="col" className="history-table__header-cell">
                                {t("DetailsScreen.tableHeaderClosingBalance")}
                            </th>
                            <th scope="col" className="history-table__header-cell">
                                {t("DetailsScreen.tableHeaderAmount")}
                            </th>
                            <th scope="col" className="history-table__header-cell">
                                {t("DetailsScreen.tableHeaderOptions")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: limit }, (_, rowIndex) => (
                                <tr
                                    key={`history-table-skeleton-${rowIndex}`}
                                    className="history-table__row"
                                >
                                    {Array.from(
                                        { length: 5 },
                                        (_, cellIndex) => (
                                            <td
                                                key={`history-table-skeleton-cell-${cellIndex}`}
                                                className="history-table__cell"
                                            >
                                                <Skeleton className="history-table__skeleton" />
                                            </td>
                                        ),
                                    )}
                                </tr>
                            ))
                        ) : isError ? (
                            <tr>
                                <td
                                    className="history-table__empty"
                                    colSpan={5}
                                >
                                    {t("Common.error")}
                                </td>
                            </tr>
                        ) : activeRecords.length === 0 ? (
                            <tr>
                                <td
                                    className="history-table__empty"
                                    colSpan={5}
                                >
                                    {t("DetailsScreen.tableEmptyState")}
                                </td>
                            </tr>
                        ) : viewMode === "days" ? (
                            dailyRecords.map((record) => (
                                <tr key={record.id} className="history-table__row">
                                    <td className="history-table__cell">{record.date}</td>
                                    <td className="history-table__cell">
                                        <span className="history-table__amount history-table__amount--neutral">
                                            {formatCurrency(
                                                record.openingBalance,
                                                i18n.language,
                                            )}
                                        </span>
                                    </td>
                                    <td className="history-table__cell">
                                        <span className="history-table__amount history-table__amount--neutral">
                                            {formatCurrency(
                                                record.closingBalance,
                                                i18n.language,
                                            )}
                                        </span>
                                    </td>
                                    <td className="history-table__cell">
                                        <span
                                            className={`history-table__amount history-table__amount--${getAmountTone(
                                                resolveDayProfitLoss(record),
                                            )}`}
                                        >
                                            {formatSignedCurrency(
                                                resolveDayProfitLoss(record),
                                                i18n.language,
                                            )}
                                        </span>
                                    </td>
                                    {renderOptionsCell(record)}
                                </tr>
                            ))
                        ) : (
                            aggregatedRecords.map((record) => (
                                <tr key={record.id} className="history-table__row">
                                    <td className="history-table__cell">{record.period}</td>
                                    <td className="history-table__cell">
                                        <span className="history-table__amount history-table__amount--neutral">
                                            {formatCurrency(
                                                record.openingBalance,
                                                i18n.language,
                                            )}
                                        </span>
                                    </td>
                                    <td className="history-table__cell">
                                        <span className="history-table__amount history-table__amount--neutral">
                                            {formatCurrency(
                                                record.closingBalance,
                                                i18n.language,
                                            )}
                                        </span>
                                    </td>
                                    <td className="history-table__cell">
                                        <span
                                            className={`history-table__amount history-table__amount--${getNetProfitTone(
                                                record.netProfit,
                                            )}`}
                                        >
                                            {formatSignedCurrency(
                                                record.netProfit,
                                                i18n.language,
                                            )}
                                        </span>
                                    </td>
                                    {renderOptionsCell(record)}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <footer className="history-table__pagination">
                <div className="history-table__page-size">
                    <label
                        className="history-table__page-size-label"
                        htmlFor="history-table-page-size"
                    >
                        {t("TablePagination.rowsPerPageLabel")}
                    </label>
                    <div className="history-table__select-wrapper">
                        <select
                            id="history-table-page-size"
                            className="history-table__select"
                            value={limit}
                            onChange={handleLimitChange}
                        >
                            {PAGE_SIZE_OPTIONS.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            size={16}
                            className="history-table__select-chevron"
                            aria-hidden="true"
                        />
                    </div>
                </div>

                <div className="history-table__pager">
                    <button
                        type="button"
                        className="history-table__page-btn"
                        onClick={handlePreviousPage}
                        disabled={!hasPreviousPage}
                        aria-label={t("TablePagination.prevPageLabel")}
                    >
                        <ChevronLeft size={18} aria-hidden="true" />
                    </button>

                    <span
                        className="history-table__page-indicator"
                        aria-live="polite"
                    >
                        {t("DetailsScreen.paginationPageLabel", { page })}
                    </span>

                    <button
                        type="button"
                        className="history-table__page-btn"
                        onClick={handleNextPage}
                        disabled={!hasNextPage}
                        aria-label={t("TablePagination.nextPageLabel")}
                    >
                        <ChevronRight size={18} aria-hidden="true" />
                    </button>
                </div>
            </footer>

            <DetailsChartModal
                isOpen={isChartModalOpen}
                onClose={closeChartModal}
                currentFilter={filter}
                onFilterChange={handleFilterSelect}
            />
        </section>
    );
};

export default HistoryTable;
