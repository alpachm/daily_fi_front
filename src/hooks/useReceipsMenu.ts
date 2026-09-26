// src/hooks/useReceipsMenu.ts
import { useCallback, useMemo, useState } from "react";

export type ReceiptType = "buy" | "sell" | null;

export type SelectableReceiptType = Exclude<ReceiptType, null>;

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

interface UseReceipsMenuResult {
    selectedDate: string | null;
    receiptType: ReceiptType;
    today: string;
    formattedDate: string | null;
    handleDateChange: (raw: string) => void;
    handleReceiptTypeChange: (type: SelectableReceiptType) => void;
}

export const useReceipsMenu = (): UseReceipsMenuResult => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [receiptType, setReceiptType] = useState<ReceiptType>(null);

    const today = useMemo(() => getTodayIsoDate(), []);

    const formattedDate = useMemo(
        () => (selectedDate ? formatDisplayDate(selectedDate) : null),
        [selectedDate],
    );

    const handleDateChange = useCallback((raw: string): void => {
        if (raw === "") {
            setSelectedDate(null);
            setReceiptType(null);
            return;
        }
        setSelectedDate(raw);
    }, []);

    const handleReceiptTypeChange = useCallback((type: SelectableReceiptType): void => {
        setReceiptType((current) => (current === type ? null : type));
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

export default useReceipsMenu;
