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

    // Commits the selected filters and forces a fresh network request. The
    // `search` action always refetches, so re-consulting the same day/type
    // after uploading receipts reflects the new records on the next click
    // without an automatic update after the upload itself.
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
