// src/components/ReceiptsScreen/ReceiptsTable.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import { Download, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import type { ReceiptType } from "../../hooks/useReceiptsMenu";
import "./styles/ReceiptsTable.css";

export interface ReceiptItem {
    id: string;
    date: string;
    time: string;
    fileName: string;
    type: ReceiptType;
}

const MOCK_SELL_RECEIPTS: ReceiptItem[] = [
    {
        id: "sell-001",
        date: "01-06-26",
        time: "13:24",
        fileName: "screenshot-225343.jpg",
        type: "sell",
    },
    {
        id: "sell-002",
        date: "01-06-26",
        time: "13:41",
        fileName: "screenshot-225349.jpg",
        type: "sell",
    },
    {
        id: "sell-003",
        date: "01-06-26",
        time: "14:05",
        fileName: "venta-usdt-1024.jpg",
        type: "sell",
    },
];

const MOCK_BUY_RECEIPTS: ReceiptItem[] = [
    {
        id: "buy-001",
        date: "01-06-26",
        time: "15:10",
        fileName: "comprobante-compra-01.jpg",
        type: "buy",
    },
    {
        id: "buy-002",
        date: "01-06-26",
        time: "15:32",
        fileName: "comprobante-compra-02.jpg",
        type: "buy",
    },
    {
        id: "buy-003",
        date: "01-06-26",
        time: "16:18",
        fileName: "compra-btc-0912.jpg",
        type: "buy",
    },
];

type ReceiptMenuAction = (record: ReceiptItem) => void;

interface ReceiptMenuOption {
    id: string;
    label: string;
    icon: LucideIcon;
    danger?: boolean;
    onSelect: ReceiptMenuAction;
}

const handleViewReceipt: ReceiptMenuAction = (record) => {
    console.log("ReceiptsTable: view receipt", record.id);
};

const handleDownloadReceipt: ReceiptMenuAction = (record) => {
    console.log("ReceiptsTable: download receipt", record.id);
};

const handleDeleteReceipt: ReceiptMenuAction = (record) => {
    console.log("ReceiptsTable: delete receipt", record.id);
};

interface ReceiptsTableProps {
    selectedDate: string | null;
    receiptType: ReceiptType;
}

export const ReceiptsTable = ({
    selectedDate,
    receiptType,
}: ReceiptsTableProps) => {
    const { t } = useTranslation("");
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const popoverRef = useRef<HTMLDivElement | null>(null);

    const records = receiptType === "sell" ? MOCK_SELL_RECEIPTS : MOCK_BUY_RECEIPTS;

    const menuOptions = useMemo<ReceiptMenuOption[]>(
        () => [
            {
                id: "view-receipt",
                label: t("ReceiptsScreen.optionViewReceipt"),
                icon: Eye,
                onSelect: handleViewReceipt,
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
        [t],
    );

    useEffect(() => {
        if (activeMenuId === null) return;

        const handleOutsidePointerDown = (event: MouseEvent): void => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
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

    return (
        <section className="receipts-table">
            {selectedDate === null ? (
                <div className="receipts-table__empty">
                    <p className="receipts-table__empty-text">
                        {t("ReceiptsScreen.tableEmptySelectDate")}
                    </p>
                </div>
            ) : (
                <div className="receipts-table__scroll">
                    <table className="receipts-table__table">
                        <thead>
                            <tr className="receipts-table__row">
                                <th scope="col" className="receipts-table__header-cell">
                                    {t("ReceiptsScreen.tableHeaderDate")}
                                </th>
                                <th scope="col" className="receipts-table__header-cell">
                                    {t("ReceiptsScreen.tableHeaderTime")}
                                </th>
                                <th scope="col" className="receipts-table__header-cell">
                                    {t("ReceiptsScreen.tableHeaderName")}
                                </th>
                                <th
                                    scope="col"
                                    className="receipts-table__header-cell receipts-table__header-cell--options"
                                >
                                    {t("ReceiptsScreen.tableHeaderOptions")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record) => {
                                const isOpen = activeMenuId === record.id;

                                return (
                                    <tr key={record.id} className="receipts-table__row">
                                        <td className="receipts-table__cell">{record.date}</td>
                                        <td className="receipts-table__cell">{record.time}</td>
                                        <td className="receipts-table__cell receipts-table__cell--file">
                                            {record.fileName}
                                        </td>
                                        <td className="receipts-table__cell receipts-table__cell--options">
                                            <div
                                                className="receipts-table__options-cell"
                                                ref={isOpen ? popoverRef : undefined}
                                            >
                                                <button
                                                    type="button"
                                                    className="receipts-table__options-btn"
                                                    aria-label={t("ReceiptsScreen.tableOptionsMenuLabel")}
                                                    aria-haspopup="menu"
                                                    aria-expanded={isOpen}
                                                    onClick={() =>
                                                        setActiveMenuId((current) =>
                                                            current === record.id ? null : record.id,
                                                        )
                                                    }
                                                >
                                                    <MoreHorizontal size={18} aria-hidden="true" />
                                                </button>

                                                {isOpen ? (
                                                    <div
                                                        className="receipts-table__popover"
                                                        role="menu"
                                                        aria-label={t("ReceiptsScreen.tableOptionsMenuLabel")}
                                                    >
                                                        {menuOptions.map((option) => (
                                                            <button
                                                                key={option.id}
                                                                type="button"
                                                                className={`receipts-table__popover-item${
                                                                    option.danger
                                                                        ? " receipts-table__popover-item--danger"
                                                                        : ""
                                                                }`}
                                                                role="menuitem"
                                                                onClick={() => {
                                                                    option.onSelect(record);
                                                                    setActiveMenuId(null);
                                                                }}
                                                            >
                                                                <option.icon size={16} aria-hidden="true" />
                                                                <span>{option.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default ReceiptsTable;
