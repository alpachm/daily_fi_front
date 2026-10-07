// src/hooks/useReceiptsMenu.ts
import { useCallback, useMemo, useState } from "react";

export type ReceiptType = "sell" | "buy";

const RECEIPT_TYPE_STORAGE_KEY = "last_selected_receipt_type";

const DEFAULT_RECEIPT_TYPE: ReceiptType = "buy";

const toStoredReceiptType = (type: ReceiptType): "PURCHASE" | "SALE" =>
    type === "buy" ? "PURCHASE" : "SALE";

const readStoredReceiptType = (): ReceiptType => {
    try {
        const stored = window.localStorage.getItem(RECEIPT_TYPE_STORAGE_KEY);
        if (stored === "PURCHASE" || stored === "buy") return "buy";
        if (stored === "SALE" || stored === "sell") return "sell";
    } catch (error) {
        console.warn(
            `useReceiptsMenu: failed to read "${RECEIPT_TYPE_STORAGE_KEY}"`,
            error,
        );
    }
    return DEFAULT_RECEIPT_TYPE;
};

const persistReceiptType = (type: ReceiptType): void => {
    try {
        window.localStorage.setItem(
            RECEIPT_TYPE_STORAGE_KEY,
            toStoredReceiptType(type),
        );
    } catch (error) {
        console.warn(
            `useReceiptsMenu: failed to write "${RECEIPT_TYPE_STORAGE_KEY}"`,
            error,
        );
    }
};

const getTodayIsoDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const formatDisplayDate = (isoDate: string): string => {
    const [year = "", month = "", day = ""] = isoDate.split("-");
    if (!year || !month || !day) return isoDate;
    return `${day}-${month}-${year.slice(-2)}`;
};

interface UseReceiptsMenuResult {
    selectedDate: string | null;
    receiptType: ReceiptType;
    today: string;
    formattedDate: string | null;
    handleDateChange: (raw: string) => void;
    handleReceiptTypeChange: (type: ReceiptType) => void;
}

export const useReceiptsMenu = (): UseReceiptsMenuResult => {
    const today = useMemo(() => getTodayIsoDate(), []);
    const [selectedDate, setSelectedDate] = useState<string | null>(today);
    const [receiptType, setReceiptType] =
        useState<ReceiptType>(readStoredReceiptType);

    const formattedDate = useMemo(
        () => (selectedDate ? formatDisplayDate(selectedDate) : null),
        [selectedDate],
    );

    const handleDateChange = useCallback((raw: string): void => {
        if (raw === "") {
            setSelectedDate(null);
            setReceiptType(DEFAULT_RECEIPT_TYPE);
            persistReceiptType(DEFAULT_RECEIPT_TYPE);
            return;
        }
        setSelectedDate(raw);
    }, []);

    const handleReceiptTypeChange = useCallback((type: ReceiptType): void => {
        setReceiptType(type);
        persistReceiptType(type);
    }, []);

    return {
        selectedDate,
        receiptType,
        today,
        formattedDate,
        handleDateChange,
        handleReceiptTypeChange,
    };
};

export default useReceiptsMenu;
