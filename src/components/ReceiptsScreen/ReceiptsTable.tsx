// src/components/ReceiptsScreen/ReceiptsTable.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import {
    Download,
    Eye,
    LoaderCircle,
    MoreHorizontal,
    Trash2,
    TriangleAlert,
} from "lucide-react";
import type { ReceiptItem } from "../../interfaces/GetReceiptsPerDayService.interface";
import type { UseGetReceiptsPerDayResult } from "../../hooks/useGetReceiptsPerDay";
import { downloadReceiptFile } from "../../services/DownloadReceiptService";
import { getReceiptsPerDayErrorKey } from "../../utils/getReceiptsPerDayError";
import { AutomaticAlertModal } from "../shared/AutomaticAlertModal";
import { TablePagination } from "../shared/TablePagination";
import { Skeleton } from "../shared/Skeleton";
import { ReceiptPreviewModal } from "./ReceiptPreviewModal";
import "./styles/ReceiptsTable.css";

interface ReceiptRow {
    id: number;
    date: string;
    type: ReceiptItem["type"];
    typeLabel: string;
    fileName: string;
    fileUrl: string;
}

const columnHelper = createColumnHelper<ReceiptRow>();

type ReceiptMenuAction = (record: ReceiptRow) => void;

interface ReceiptMenuOption {
    id: string;
    label: string;
    icon: LucideIcon;
    danger?: boolean;
    onSelect: ReceiptMenuAction;
}

const handleDeleteReceipt: ReceiptMenuAction = (record) => {
    // Future integration: delete the receipt through a dedicated service.
    console.log("ReceiptsTable: delete receipt", record.id);
};

const formatReceiptDate = (value: string): string => {
    const datePart = value.slice(0, 10);
    const [year = "", month = "", day = ""] = datePart.split("-");
    if (!year || !month || !day) {
        return value;
    }
    return `${day}-${month}-${year.slice(-2)}`;
};

const extractFileName = (
    fileUrl: string,
    description: string | null,
): string => {
    const withoutQuery = fileUrl.split("?")[0] ?? "";
    const segments = withoutQuery.split("/").filter(Boolean);
    const fileName = segments[segments.length - 1] ?? "";
    return fileName !== "" ? fileName : (description ?? fileUrl);
};

interface ReceiptsTableProps {
    query: UseGetReceiptsPerDayResult;
}

const SKELETON_ROW_COUNT = 5;

export const ReceiptsTable = ({ query }: ReceiptsTableProps) => {
    const { t } = useTranslation("");
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [previewReceipt, setPreviewReceipt] = useState<ReceiptRow | null>(
        null,
    );
    const [downloadingReceiptId, setDownloadingReceiptId] = useState<
        number | null
    >(null);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const popoverRef = useRef<HTMLDivElement | null>(null);

    const handlePreviewReceipt = useCallback((record: ReceiptRow): void => {
        setPreviewReceipt(record);
    }, []);

    const handleClosePreview = useCallback((): void => {
        setPreviewReceipt(null);
    }, []);

    const handleDownloadReceipt = useCallback(
        async (record: ReceiptRow): Promise<void> => {
            setDownloadingReceiptId(record.id);
            setDownloadError(null);
            try {
                await downloadReceiptFile(
                    record.fileUrl,
                    `comprobante-${record.id}`,
                );
            } catch {
                setDownloadError(t("ReceiptsScreen.downloadReceiptError"));
            } finally {
                setDownloadingReceiptId(null);
            }
        },
        [t],
    );

    const handleDownloadErrorClose = useCallback((): void => {
        setDownloadError(null);
    }, []);

    const typeLabels = useMemo(
        () => ({
            PURCHASE: t("ReceiptsScreen.purchaseLabel"),
            SALE: t("ReceiptsScreen.saleLabel"),
        }),
        [t],
    );

    const rows = useMemo<ReceiptRow[]>(
        () =>
            query.receipts.map((receipt) => ({
                id: receipt.id,
                date: formatReceiptDate(receipt.date),
                type: receipt.type,
                typeLabel: typeLabels[receipt.type],
                fileName: extractFileName(receipt.fileUrl, receipt.description),
                fileUrl: receipt.fileUrl,
            })),
        [query.receipts, typeLabels],
    );

    const menuOptions = useMemo<ReceiptMenuOption[]>(
        () => [
            {
                id: "view-receipt",
                label: t("ReceiptsScreen.optionViewReceipt"),
                icon: Eye,
                onSelect: handlePreviewReceipt,
            },
            {
                id: "download-receipt",
                label: t("ReceiptsScreen.optionDownloadReceipt"),
                icon: Download,
                onSelect: handleDownloadReceipt,
            },
            {
                id: "delete-receipt",
                label: t("ReceiptsScreen.optionDeleteReceipt"),
                icon: Trash2,
                danger: true,
                onSelect: handleDeleteReceipt,
            },
        ],
        [t, handlePreviewReceipt, handleDownloadReceipt],
    );

    useEffect(() => {
        if (activeMenuId === null) return;

        const handleOutsidePointerDown = (event: MouseEvent): void => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node)
            ) {
                setActiveMenuId(null);
            }
        };

        const handleEscapeKeyDown = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                setActiveMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleOutsidePointerDown);
        document.addEventListener("keydown", handleEscapeKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleOutsidePointerDown);
            document.removeEventListener("keydown", handleEscapeKeyDown);
        };
    }, [activeMenuId]);

    const columns = useMemo(
        () => [
            columnHelper.accessor("date", {
                header: t("ReceiptsScreen.tableHeaderDate"),
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("typeLabel", {
                header: t("ReceiptsScreen.tableHeaderType"),
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("fileName", {
                header: t("ReceiptsScreen.tableHeaderName"),
                cell: (info) => info.getValue(),
            }),
            columnHelper.display({
                id: "options",
                header: t("ReceiptsScreen.tableHeaderOptions"),
                cell: (info) => {
                    const record = info.row.original;
                    const rowId = info.row.id;
                    const isOpen = activeMenuId === rowId;
                    const isDownloading = downloadingReceiptId === record.id;

                    return (
                        <div
                            className="receipts-table__options-cell"
                            ref={isOpen ? popoverRef : undefined}
                        >
                            <button
                                type="button"
                                className="receipts-table__options-btn"
                                aria-label={t(
                                    "ReceiptsScreen.tableOptionsMenuLabel",
                                )}
                                aria-haspopup="menu"
                                aria-expanded={isOpen}
                                disabled={isDownloading}
                                onClick={() =>
                                    setActiveMenuId((current) =>
                                        current === rowId ? null : rowId,
                                    )
                                }
                            >
                                {isDownloading ? (
                                    <LoaderCircle
                                        size={18}
                                        className="receipts-table__spinner"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <MoreHorizontal
                                        size={18}
                                        aria-hidden="true"
                                    />
                                )}
                            </button>

                            {isOpen ? (
                                <div
                                    className="receipts-table__popover"
                                    role="menu"
                                    aria-label={t(
                                        "ReceiptsScreen.tableOptionsMenuLabel",
                                    )}
                                >
                                    {menuOptions.map((option) => {
                                        const isOptionDownloading =
                                            option.id === "download-receipt" &&
                                            isDownloading;

                                        return (
                                            <button
                                                key={option.id}
                                                type="button"
                                                className={`receipts-table__popover-item${
                                                    option.danger
                                                        ? " receipts-table__popover-item--danger"
                                                        : ""
                                                }`}
                                                role="menuitem"
                                                disabled={isOptionDownloading}
                                                onClick={() => {
                                                    option.onSelect(record);
                                                    setActiveMenuId(null);
                                                }}
                                            >
                                                {isOptionDownloading ? (
                                                    <LoaderCircle
                                                        size={16}
                                                        className="receipts-table__spinner"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <option.icon
                                                        size={16}
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                <span>{option.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : null}
                        </div>
                    );
                },
            }),
        ],
        [t, activeMenuId, menuOptions, downloadingReceiptId],
    );

    const table = useReactTable({
        data: rows,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const pagination = query.pagination;

    if (!query.hasSearched) {
        return (
            <section className="receipts-table">
                <div className="receipts-table__empty">
                    <p className="receipts-table__empty-text">
                        {t("ReceiptsScreen.tableEmptyInstructions")}
                    </p>
                </div>
            </section>
        );
    }

    if (query.isLoading) {
        return (
            <section className="receipts-table">
                <div
                    className="receipts-table__skeleton"
                    role="status"
                    aria-label={t("Common.loading")}
                >
                    {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
                        <div
                            key={index}
                            className="receipts-table__skeleton-row"
                        >
                            <Skeleton className="receipts-table__skeleton-cell" />
                            <Skeleton className="receipts-table__skeleton-cell" />
                            <Skeleton className="receipts-table__skeleton-cell" />
                            <Skeleton className="receipts-table__skeleton-cell" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (query.isError) {
        return (
            <section className="receipts-table">
                <div className="receipts-table__error" role="alert">
                    <TriangleAlert
                        size={20}
                        className="receipts-table__error-icon"
                        aria-hidden="true"
                    />
                    <p className="receipts-table__error-text">
                        {t(getReceiptsPerDayErrorKey(query.error))}
                    </p>
                </div>
            </section>
        );
    }

    if (rows.length === 0) {
        return (
            <section className="receipts-table">
                <div className="receipts-table__empty">
                    <p className="receipts-table__empty-text">
                        {t("ReceiptsScreen.tableEmptyNoResults")}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="receipts-table">
                <div className="receipts-table__scroll">
                    <table className="receipts-table__table">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            scope="col"
                                            className={`receipts-table__header-cell${
                                                header.column.id === "options"
                                                    ? " receipts-table__header-cell--options"
                                                    : ""
                                            }`}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="receipts-table__row">
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className={`receipts-table__cell${
                                                cell.column.id === "fileName"
                                                    ? " receipts-table__cell--file"
                                                    : cell.column.id === "options"
                                                      ? " receipts-table__cell--options"
                                                      : ""
                                            }`}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <TablePagination
                    currentPage={pagination?.currentPage ?? 1}
                    totalPages={pagination?.totalPages ?? 1}
                    pageSize={query.limit}
                    canPreviousPage={pagination?.hasPrevPage ?? false}
                    canNextPage={pagination?.hasNextPage ?? false}
                    onPageChange={(page) => query.changePage(page)}
                    onPageSizeChange={(size) => query.changeLimit(size)}
                />
            </section>

            <ReceiptPreviewModal
                isOpen={previewReceipt !== null}
                fileUrl={previewReceipt?.fileUrl ?? ""}
                altText={previewReceipt?.fileName ?? ""}
                onClose={handleClosePreview}
            />

            {downloadError !== null ? (
                <AutomaticAlertModal
                    isOpen
                    onClose={handleDownloadErrorClose}
                    message={downloadError}
                    icon={<TriangleAlert size={24} aria-hidden="true" />}
                    variant="error"
                />
            ) : null}
        </>
    );
};

export default ReceiptsTable;




