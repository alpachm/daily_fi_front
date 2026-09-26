// src/components/DetailsScreen/HistoryTable.tsx
import { useMemo } from "react";
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
import "./styles/HistoryTable.css";

export interface HistoryRecord {
    id: string;
    date: string;
    amount: number;
}

interface HistoryTableProps {
    records: HistoryRecord[];
    pageSize?: number;
    onRowOptions?: (record: HistoryRecord) => void;
}

type AmountTone = "positive" | "negative" | "neutral";

const columnHelper = createColumnHelper<HistoryRecord>();

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

export const HistoryTable = ({ records, pageSize = 5, onRowOptions }: HistoryTableProps) => {
    const { t, i18n } = useTranslation("");

    const columns = useMemo(
        () => [
            columnHelper.accessor("date", {
                header: t("DetailsScreen.tableHeaderDate"),
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("amount", {
                header: t("DetailsScreen.tableHeaderAmount"),
                cell: (info) => {
                    const value = info.getValue();
                    const tone = getAmountTone(value);

                    return (
                        <span
                            className={`history-table__amount history-table__amount--${tone}`}
                        >
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
        [t, i18n.language, onRowOptions],
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
                                    <th
                                        key={header.id}
                                        className="history-table__header-cell"
                                    >
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
                            aria-current={
                                pageIndex === currentPageIndex ? "page" : undefined
                            }
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
