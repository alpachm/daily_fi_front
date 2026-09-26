// src/screens/_authenticated/ReceipsScreen.tsx
import "../../styles/ReceipsScreen.css";
import { ReceipsMenu } from "../../components/ReceipsScreen/ReceipsMenu";
import { ReceiptsTable } from "../../components/ReceipsScreen/ReceiptsTable";
import { useReceipsMenu } from "../../hooks/useReceipsMenu";

export const ReceipsScreen = () => {
    const {
        selectedDate,
        receiptType,
        today,
        formattedDate,
        handleDateChange,
        handleReceiptTypeChange,
    } = useReceipsMenu();

    return (
        <div className="receips-screen">
            <ReceipsMenu
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

export default ReceipsScreen;
