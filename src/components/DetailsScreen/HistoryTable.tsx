// src/components/DetailsScreen/HistoryTable.tsx
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
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
    const currentPage = table.getState().pagination.pageIndex + 1;

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
                <span className="history-table__page-info">
                    {t("DetailsScreen.tablePageInfo", {
                        current: currentPage,
                        total: pageCount,
                    })}
                </span>

                <div className="history-table__pagination">
                    <button
                        type="button"
                        className="history-table__page-button"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label={t("DetailsScreen.tablePrevPageLabel")}
                    >
                        <ChevronLeft size={18} aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        className="history-table__page-button"
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
