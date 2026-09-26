// src/components/DetailsScreen/HistoryTable.tsx
import { useEffect, useMemo } from "react";
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import type { FilterPeriod } from "./Balance";
import "./styles/HistoryTable.css";

export interface HistoryRecord {
    id: string;
    date: string;
    amount: number;
}

export interface HistoryTableProps {
    filter: FilterPeriod;
    pageSize?: number;
    onRowOptions?: (record: HistoryRecord) => void;
}

type AmountTone = "positive" | "negative" | "neutral";

const columnHelper = createColumnHelper<HistoryRecord>();

const PERIOD_HEADER_KEYS: Record<FilterPeriod, string> = {
    day: "DetailsScreen.tableHeaderDate",
    month: "DetailsScreen.tableHeaderMonth",
    year: "DetailsScreen.tableHeaderYear",
};

const MOCK_DAILY_RECORDS: HistoryRecord[] = [
    { id: "daily-026", date: "26-09-2026", amount: 345.2 },
    { id: "daily-025", date: "25-09-2026", amount: -112.4 },
    { id: "daily-024", date: "24-09-2026", amount: 289.75 },
    { id: "daily-023", date: "23-09-2026", amount: -45.3 },
    { id: "daily-022", date: "22-09-2026", amount: 178.9 },
    { id: "daily-021", date: "21-09-2026", amount: 96.4 },
    { id: "daily-020", date: "20-09-2026", amount: -62.15 },
    { id: "daily-019", date: "19-09-2026", amount: 210.3 },
    { id: "daily-018", date: "18-09-2026", amount: 54.6 },
    { id: "daily-017", date: "17-09-2026", amount: -28.9 },
    { id: "daily-026", date: "26-09-2026", amount: 345.2 },
    { id: "daily-025", date: "25-09-2026", amount: -112.4 },
    { id: "daily-024", date: "24-09-2026", amount: 289.75 },
    { id: "daily-023", date: "23-09-2026", amount: -45.3 },
    { id: "daily-022", date: "22-09-2026", amount: 178.9 },
    { id: "daily-021", date: "21-09-2026", amount: 96.4 },
    { id: "daily-020", date: "20-09-2026", amount: -62.15 },
    { id: "daily-019", date: "19-09-2026", amount: 210.3 },
    { id: "daily-018", date: "18-09-2026", amount: 54.6 },
    { id: "daily-017", date: "17-09-2026", amount: -28.9 },
    { id: "daily-026", date: "26-09-2026", amount: 345.2 },
    { id: "daily-025", date: "25-09-2026", amount: -112.4 },
    { id: "daily-024", date: "24-09-2026", amount: 289.75 },
    { id: "daily-023", date: "23-09-2026", amount: -45.3 },
    { id: "daily-022", date: "22-09-2026", amount: 178.9 },
    { id: "daily-021", date: "21-09-2026", amount: 96.4 },
    { id: "daily-020", date: "20-09-2026", amount: -62.15 },
    { id: "daily-019", date: "19-09-2026", amount: 210.3 },
    { id: "daily-018", date: "18-09-2026", amount: 54.6 },
    { id: "daily-017", date: "17-09-2026", amount: -28.9 },
    { id: "daily-026", date: "26-09-2026", amount: 345.2 },
    { id: "daily-025", date: "25-09-2026", amount: -112.4 },
    { id: "daily-024", date: "24-09-2026", amount: 289.75 },
    { id: "daily-023", date: "23-09-2026", amount: -45.3 },
    { id: "daily-022", date: "22-09-2026", amount: 178.9 },
    { id: "daily-021", date: "21-09-2026", amount: 96.4 },
    { id: "daily-020", date: "20-09-2026", amount: -62.15 },
    { id: "daily-019", date: "19-09-2026", amount: 210.3 },
    { id: "daily-018", date: "18-09-2026", amount: 54.6 },
    { id: "daily-017", date: "17-09-2026", amount: -28.9 },
    { id: "daily-026", date: "26-09-2026", amount: 345.2 },
    { id: "daily-025", date: "25-09-2026", amount: -112.4 },
    { id: "daily-024", date: "24-09-2026", amount: 289.75 },
    { id: "daily-023", date: "23-09-2026", amount: -45.3 },
    { id: "daily-022", date: "22-09-2026", amount: 178.9 },
    { id: "daily-021", date: "21-09-2026", amount: 96.4 },
    { id: "daily-020", date: "20-09-2026", amount: -62.15 },
    { id: "daily-019", date: "19-09-2026", amount: 210.3 },
    { id: "daily-018", date: "18-09-2026", amount: 54.6 },
    { id: "daily-017", date: "17-09-2026", amount: -28.9 },
    { id: "daily-026", date: "26-09-2026", amount: 345.2 },
    { id: "daily-025", date: "25-09-2026", amount: -112.4 },
    { id: "daily-024", date: "24-09-2026", amount: 289.75 },
    { id: "daily-023", date: "23-09-2026", amount: -45.3 },
    { id: "daily-022", date: "22-09-2026", amount: 178.9 },
    { id: "daily-021", date: "21-09-2026", amount: 96.4 },
    { id: "daily-020", date: "20-09-2026", amount: -62.15 },
    { id: "daily-019", date: "19-09-2026", amount: 210.3 },
    { id: "daily-018", date: "18-09-2026", amount: 54.6 },
    { id: "daily-017", date: "17-09-2026", amount: -28.9 },
    { id: "daily-026", date: "26-09-2026", amount: 345.2 },
    { id: "daily-025", date: "25-09-2026", amount: -112.4 },
    { id: "daily-024", date: "24-09-2026", amount: 289.75 },
    { id: "daily-023", date: "23-09-2026", amount: -45.3 },
    { id: "daily-022", date: "22-09-2026", amount: 178.9 },
    { id: "daily-021", date: "21-09-2026", amount: 96.4 },
    { id: "daily-020", date: "20-09-2026", amount: -62.15 },
    { id: "daily-019", date: "19-09-2026", amount: 210.3 },
    { id: "daily-018", date: "18-09-2026", amount: 54.6 },
    { id: "daily-017", date: "17-09-2026", amount: -28.9 },
];

const MOCK_MONTHLY_RECORDS: HistoryRecord[] = [
    { id: "month-2026-09", date: "Septiembre 2026", amount: 4210.45 },
    { id: "month-2026-08", date: "Agosto 2026", amount: 3860.2 },
    { id: "month-2026-07", date: "Julio 2026", amount: 3540.8 },
    { id: "month-2026-06", date: "Junio 2026", amount: 3280.5 },
    { id: "month-2026-05", date: "Mayo 2026", amount: 3120.3 },
    { id: "month-2026-04", date: "Abril 2026", amount: 2980.1 },
    { id: "month-2026-03", date: "Marzo 2026", amount: 2760.9 },
    { id: "month-2026-02", date: "Febrero 2026", amount: 2540.4 },
    { id: "month-2026-01", date: "Enero 2026", amount: 2310.2 },
    { id: "month-2025-12", date: "Diciembre 2025", amount: 2180.75 },
    { id: "month-2025-11", date: "Noviembre 2025", amount: 1980.6 },
    { id: "month-2025-10", date: "Octubre 2025", amount: 1750.3 },
];

const MOCK_YEARLY_RECORDS: HistoryRecord[] = [
    { id: "year-2026", date: "Año 2026", amount: 48250.15 },
    { id: "year-2025", date: "Año 2025", amount: 39800.5 },
    { id: "year-2024", date: "Año 2024", amount: 31500.2 },
    { id: "year-2023", date: "Año 2023", amount: 24750.9 },
    { id: "year-2022", date: "Año 2022", amount: 18200.4 },
    { id: "year-2021", date: "Año 2021", amount: 12450.3 },
];

const HISTORY_RECORDS_BY_PERIOD: Record<FilterPeriod, HistoryRecord[]> = {
    day: MOCK_DAILY_RECORDS,
    month: MOCK_MONTHLY_RECORDS,
    year: MOCK_YEARLY_RECORDS,
};

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

export const HistoryTable = ({ filter, pageSize = 5, onRowOptions }: HistoryTableProps) => {
    const { t, i18n } = useTranslation("");

    const records = useMemo<HistoryRecord[]>(() => HISTORY_RECORDS_BY_PERIOD[filter], [filter]);

    const columns = useMemo(
        () => [
            columnHelper.accessor("date", {
                header: t(PERIOD_HEADER_KEYS[filter]),
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("amount", {
                header: t("DetailsScreen.tableHeaderAmount"),
                cell: (info) => {
                    const value = info.getValue();
                    const tone = getAmountTone(value);

                    return (
                        <span className={`history-table__amount history-table__amount--${tone}`}>
                            {formatSignedCurrency(value, i18n.language)}
                        </span>
                    );
                },
            }),
            columnHelper.display({
                id: "options",
                header: t("DetailsScreen.tableHeaderOptions"),
                cell: (info) => (
                    <button
                        type="button"
                        className="history-table__options-button"
                        aria-label={t("DetailsScreen.tableOptionsMenuLabel")}
                        onClick={() => onRowOptions?.(info.row.original)}
                    >
                        <MoreHorizontal size={18} aria-hidden="true" />
                    </button>
                ),
            }),
        ],
        [t, i18n.language, onRowOptions, filter],
    );
    const table = useReactTable({
        data: records,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize },
        },
    });

    useEffect(() => {
        table.setPageIndex(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const rows = table.getRowModel().rows;
    const pageCount = table.getPageCount();
    const currentPageIndex = table.getState().pagination.pageIndex;
    const pageIndexes = Array.from({ length: pageCount }, (_, index) => index);

    return (
        <section className="history-table" aria-labelledby="history-table-title">
            <h2 id="history-table-title" className="history-table__title">
                {t("DetailsScreen.historyTitle")}
            </h2>

            <div className="history-table__container">
                <table className="history-table__table">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="history-table__header-cell">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext(),
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    className="history-table__empty"
                                    colSpan={table.getAllLeafColumns().length}
                                >
                                    {t("DetailsScreen.tableEmptyState")}
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={row.id} className="history-table__row">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="history-table__cell">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <footer className="history-table__footer">
                <div className="history-table__page-size">
                    <label
                        className="history-table__page-size-label"
                        htmlFor="history-table-page-size"
                    >
                        {t("DetailsScreen.tableRowsPerPageLabel")}
                    </label>
                    <div className="history-table__select-wrapper">
                        <select
                            id="history-table-page-size"
                            className="history-table__select"
                            value={table.getState().pagination.pageSize}
                            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                                table.setPageSize(Number(event.target.value));
                                table.setPageIndex(0);
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <ChevronDown
                            size={16}
                            className="history-table__select-chevron"
                            aria-hidden="true"
                        />
                    </div>
                </div>

                <div className="history-table__pagination">
                    <button
                        type="button"
                        className="history-table__page-btn"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label={t("DetailsScreen.tablePrevPageLabel")}
                    >
                        <ChevronLeft size={18} aria-hidden="true" />
                    </button>

                    {pageIndexes.map((pageIndex) => (
                        <button
                            key={pageIndex}
                            type="button"
                            className={
                                pageIndex === currentPageIndex
                                    ? "history-table__page-btn history-table__page-btn--active"
                                    : "history-table__page-btn"
                            }
                            onClick={() => table.setPageIndex(pageIndex)}
                            aria-label={t("DetailsScreen.tableGoToPageLabel", {
                                page: pageIndex + 1,
                            })}
                            aria-current={pageIndex === currentPageIndex ? "page" : undefined}
                        >
                            {pageIndex + 1}
                        </button>
                    ))}

                    <button
                        type="button"
                        className="history-table__page-btn"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label={t("DetailsScreen.tableNextPageLabel")}
                    >
                        <ChevronRight size={18} aria-hidden="true" />
                    </button>
                </div>
            </footer>
        </section>
    );
};

export default HistoryTable;
