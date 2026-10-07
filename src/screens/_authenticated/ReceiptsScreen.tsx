// src/screens/_authenticated/ReceiptsScreen.tsx
import "../../styles/ReceiptsScreen.css";
import { useCallback } from "react";
import { ReceiptsMenu } from "../../components/ReceiptsScreen/ReceiptsMenu";
import { ReceiptsTable } from "../../components/ReceiptsScreen/ReceiptsTable";
import { useGetReceiptsPerDay } from "../../hooks/useGetReceiptsPerDay";
import { useReceiptsMenu } from "../../hooks/useReceiptsMenu";

export const ReceiptsScreen = () => {
    const {
        selectedDate,
        receiptType,
        today,
        formattedDate,
        handleDateChange,
        handleReceiptTypeChange,
    } = useReceiptsMenu();

    const receiptsQuery = useGetReceiptsPerDay();
    const { search } = receiptsQuery;

    const handleConsult = useCallback((): void => {
        if (selectedDate === null) {
            return;
        }
        search({ date: selectedDate, type: receiptType });
    }, [search, selectedDate, receiptType]);

    return (
        <div className="receipts-screen">
            <ReceiptsMenu
                selectedDate={selectedDate}
                receiptType={receiptType}
                today={today}
                formattedDate={formattedDate}
                onDateChange={handleDateChange}
                onTypeChange={handleReceiptTypeChange}
                onConsult={handleConsult}
            />
            <ReceiptsTable query={receiptsQuery} />
        </div>
    );
};

export default ReceiptsScreen;
