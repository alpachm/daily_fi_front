// src/hooks/useReceiptsMenu.ts
import { useCallback, useMemo, useState } from "react";

export type ReceiptType = "sell" | "buy";

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
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [receiptType, setReceiptType] = useState<ReceiptType>("sell");

    const today = useMemo(() => getTodayIsoDate(), []);

    const formattedDate = useMemo(
        () => (selectedDate ? formatDisplayDate(selectedDate) : null),
        [selectedDate],
    );

    const handleDateChange = useCallback((raw: string): void => {
        if (raw === "") {
            setSelectedDate(null);
            setReceiptType("sell");
            return;
        }
        setSelectedDate(raw);
    }, []);

    const handleReceiptTypeChange = useCallback((type: ReceiptType): void => {
        setReceiptType(type);
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
