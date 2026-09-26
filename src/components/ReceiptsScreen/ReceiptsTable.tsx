// src/components/ReceiptsScreen/ReceiptsTable.tsx
import { useTranslation } from "react-i18next";
import { MoreHorizontal } from "lucide-react";
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

interface ReceiptsTableProps {
    selectedDate: string | null;
    receiptType: ReceiptType;
}

export const ReceiptsTable = ({
    selectedDate,
    receiptType,
}: ReceiptsTableProps) => {
    const { t } = useTranslation("");

    const records = receiptType === "sell" ? MOCK_SELL_RECEIPTS : MOCK_BUY_RECEIPTS;

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
                            {records.map((record) => (
                                <tr key={record.id} className="receipts-table__row">
                                    <td className="receipts-table__cell">{record.date}</td>
                                    <td className="receipts-table__cell">{record.time}</td>
                                    <td className="receipts-table__cell receipts-table__cell--file">
                                        {record.fileName}
                                    </td>
                                    <td className="receipts-table__cell receipts-table__cell--options">
                                        <button
                                            type="button"
                                            className="receipts-table__options-btn"
                                            aria-label={t("ReceiptsScreen.tableOptionsMenuLabel")}
                                        >
                                            <MoreHorizontal size={18} aria-hidden="true" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default ReceiptsTable;
