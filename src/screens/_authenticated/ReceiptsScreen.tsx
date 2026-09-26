// src/screens/_authenticated/ReceiptsScreen.tsx
import "../../styles/ReceiptsScreen.css";
import { ReceiptsMenu } from "../../components/ReceiptsScreen/ReceiptsMenu";
import { ReceiptsTable } from "../../components/ReceiptsScreen/ReceiptsTable";
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

    return (
        <div className="receipts-screen">
            <ReceiptsMenu
                selectedDate={selectedDate}
                receiptType={receiptType}
                today={today}
                formattedDate={formattedDate}
                onDateChange={handleDateChange}
                onTypeChange={handleReceiptTypeChange}
            />
            <ReceiptsTable selectedDate={selectedDate} receiptType={receiptType} />
        </div>
    );
};

export default ReceiptsScreen;
