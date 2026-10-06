// src/components/DetailsScreen/HistoryTable.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import {
    BadgeDollarSign,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    ShoppingCart,
} from "lucide-react";
import { useAllDailyBalances } from "../../hooks/useAllDailyBalances";
import type { DailyBalanceItem } from "../../interfaces/GetAllDailyBalancesService.interface";
import { formatFullDate } from "../../utils/date";
import { Skeleton } from "../shared/Skeleton";
import "./styles/HistoryTable.css";

export interface HistoryRecord {
    id: string;
    date: string;
    amount: number;
}

type ActionMenuHandler = (record: HistoryRecord) => void;

interface ActionMenuItem {
    id: string;
    label: string;
    icon: LucideIcon;
    onSelect: ActionMenuHandler;
}

type AmountTone = "positive" | "negative" | "neutral";

const PAGE_SIZE_OPTIONS: number[] = [10, 50, 100];
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const getAmountTone = (value: number): AmountTone => {
    if (value > 0) return "positive";
    if (value < 0) return "negative";
    return "neutral";
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

const mapDailyBalanceToHistoryRecord = (
    item: DailyBalanceItem,
    locale: string,
): HistoryRecord => ({
    id: String(item.id),
    date: formatFullDate(item.date, locale),
    amount: item.totalIncome - item.totalExpenses,
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

    const { data, isLoading, isError } = useAllDailyBalances({ page, limit });

    const records = useMemo<HistoryRecord[]>(
        () =>
            (data ?? []).map((item) =>
                mapDailyBalanceToHistoryRecord(item, i18n.language),
            ),
        [data, i18n.language],
    );

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
    const hasNextPage = records.length === limit;

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

    return (
        <section className="history-table" aria-labelledby="history-table-title">
            <header className="history-table__header">
                <h2 id="history-table-title" className="history-table__title">
                    {t("DetailsScreen.historyTitle")}
                </h2>
            </header>

            <div className="history-table__container">
                <table className="history-table__table">
                    <thead>
                        <tr>
                            <th scope="col" className="history-table__header-cell">
                                {t("DetailsScreen.tableHeaderDate")}
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
                            Array.from({ length: limit }, (_, index) => (
                                <tr
                                    key={`history-table-skeleton-${index}`}
                                    className="history-table__row"
                                >
                                    <td className="history-table__cell">
                                        <Skeleton className="history-table__skeleton history-table__skeleton--date" />
                                    </td>
                                    <td className="history-table__cell">
                                        <Skeleton className="history-table__skeleton history-table__skeleton--amount" />
                                    </td>
                                    <td className="history-table__cell">
                                        <Skeleton className="history-table__skeleton history-table__skeleton--action" />
                                    </td>
                                </tr>
                            ))
                        ) : isError ? (
                            <tr>
                                <td className="history-table__empty" colSpan={3}>
                                    {t("Common.error")}
                                </td>
                            </tr>
                        ) : records.length === 0 ? (
                            <tr>
                                <td className="history-table__empty" colSpan={3}>
                                    {t("DetailsScreen.tableEmptyState")}
                                </td>
                            </tr>
                        ) : (
                            records.map((record) => (
                                <tr key={record.id} className="history-table__row">
                                    <td className="history-table__cell">{record.date}</td>
                                    <td className="history-table__cell">
                                        <span
                                            className={`history-table__amount history-table__amount--${getAmountTone(record.amount)}`}
                                        >
                                            {formatSignedCurrency(
                                                record.amount,
                                                i18n.language,
                                            )}
                                        </span>
                                    </td>
                                    <td className="history-table__cell">
                                        <div
                                            className="history-table__options-cell"
                                            ref={
                                                openMenuRowId === record.id
                                                    ? popoverRef
                                                    : undefined
                                            }
                                        >
                                            <button
                                                type="button"
                                                className="history-table__options-button"
                                                aria-label={t(
                                                    "DetailsScreen.tableOptionsMenuLabel",
                                                )}
                                                aria-haspopup="menu"
                                                aria-expanded={openMenuRowId === record.id}
                                                onClick={() =>
                                                    setOpenMenuRowId((current) =>
                                                        current === record.id
                                                            ? null
                                                            : record.id,
                                                    )
                                                }
                                            >
                                                <MoreHorizontal size={18} aria-hidden="true" />
                                            </button>

                                            {openMenuRowId === record.id ? (
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
        </section>
    );
};

export default HistoryTable;
