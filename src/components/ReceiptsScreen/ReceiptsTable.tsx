// src/components/ReceiptsScreen/ReceiptsTable.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import type { OnChangeFn, PaginationState } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import { Download, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import type { ReceiptType } from "../../hooks/useReceiptsMenu";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { TablePagination } from "../shared/TablePagination";
import "./styles/ReceiptsTable.css";

const RECEIPTS_PAGE_SIZE_KEY = "daily_fi_receipts_page_size" as const;

export interface ReceiptItem {
    id: string;
    date: string;
    time: string;
    fileName: string;
    type: ReceiptType;
}

const columnHelper = createColumnHelper<ReceiptItem>();

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

export const ReceiptsTable = ({ selectedDate, receiptType }: ReceiptsTableProps) => {
    const { t } = useTranslation("");
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useLocalStorage<number>(RECEIPTS_PAGE_SIZE_KEY, 10);
    const popoverRef = useRef<HTMLDivElement | null>(null);

    const records = useMemo<ReceiptItem[]>(
        () => (receiptType === "sell" ? MOCK_SELL_RECEIPTS : MOCK_BUY_RECEIPTS),
        [receiptType],
    );

    // Clamp the page index so a shrinking dataset never renders an empty page
    // (e.g. switching from "Venta" to "Compra" while on a later page).
    const pageCount = Math.max(1, Math.ceil(records.length / pageSize));
    const safePageIndex = Math.min(pageIndex, pageCount - 1);

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

    const columns = useMemo(
        () => [
            columnHelper.accessor("date", {
                header: t("ReceiptsScreen.tableHeaderDate"),
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("time", {
                header: t("ReceiptsScreen.tableHeaderTime"),
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

                    return (
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
                                    setActiveMenuId((current) => (current === rowId ? null : rowId))
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
                    );
                },
            }),
        ],
        [t, activeMenuId, menuOptions],
    );

    const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
        const current = { pageIndex: safePageIndex, pageSize };
        const next = typeof updater === "function" ? updater(current) : updater;

        setPageIndex(next.pageIndex);
        setPageSize(next.pageSize);
    };

    const table = useReactTable({
        data: records,
        columns,
        state: {
            pagination: { pageIndex: safePageIndex, pageSize },
        },
        onPaginationChange: handlePaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // Changing the receipt type or selected date must only reset the page
    // index; the chosen page size is a user preference that must be preserved.
    useEffect(() => {
        setPageIndex(0);
    }, [receiptType, selectedDate]);

    const rows = table.getRowModel().rows;

    return (
        <section className="receipts-table">
            {selectedDate === null ? (
                <div className="receipts-table__empty">
                    <p className="receipts-table__empty-text">
                        {t("ReceiptsScreen.tableEmptySelectDate")}
                    </p>
                </div>
            ) : (
                <>
                    <div className="receipts-table__scroll">
                        <table className="receipts-table__table">
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className="receipts-table__row">
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
                                                          header.column.columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {rows.map((row) => (
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
                        currentPage={table.getState().pagination.pageIndex + 1}
                        totalPages={table.getPageCount()}
                        pageSize={table.getState().pagination.pageSize}
                        canPreviousPage={table.getCanPreviousPage()}
                        canNextPage={table.getCanNextPage()}
                        onPageChange={(page) => setPageIndex(page - 1)}
                        onPageSizeChange={(size) => {
                            setPageSize(size);
                            setPageIndex(0);
                        }}
                    />
                </>
            )}
        </section>
    );
};

export default ReceiptsTable;
