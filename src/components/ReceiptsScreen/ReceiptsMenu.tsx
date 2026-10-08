// src/components/ReceiptsScreen/ReceiptsMenu.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Upload } from "lucide-react";
import type { ReceiptType } from "../../hooks/useReceiptsMenu";
import { DatePickerInput } from "../shared/DatePickerInput";
import { UploadReceiptsModal } from "./UploadReceiptsModal";
import "./styles/ReceiptsMenu.css";

interface ReceiptsMenuProps {
    selectedDate: string | null;
    receiptType: ReceiptType;
    today: string;
    formattedDate: string | null;
    onDateChange: (raw: string) => void;
    onTypeChange: (type: ReceiptType) => void;
    onConsult: () => void;
}

export const ReceiptsMenu = ({
    selectedDate,
    receiptType,
    today,
    formattedDate,
    onDateChange,
    onTypeChange,
    onConsult,
}: ReceiptsMenuProps) => {
    const { t } = useTranslation("");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const hasSelectedDate = selectedDate !== null;

    const title =
        hasSelectedDate && formattedDate
            ? t("ReceiptsScreen.menuTitleWithDate", { date: formattedDate })
            : t("ReceiptsScreen.menuDefaultTitle");

    return (
        <div className="receipts-menu">
            <div className="receipts-menu__header">
                <h2 className="receipts-menu__title">{title}</h2>

                <div className="receipts-menu__bar">
                    <div className="receipts-menu__filters">
                        <div
                            className="receipts-menu__type-group"
                            role="group"
                            aria-label={t("ReceiptsScreen.menuTypeGroupLabel")}
                        >
                            <button
                                type="button"
                                className={`receipts-menu__type-btn${
                                    receiptType === "sell"
                                        ? " receipts-menu__type-btn--active"
                                        : ""
                                }`}
                                disabled={!hasSelectedDate}
                                aria-pressed={receiptType === "sell"}
                                onClick={() => onTypeChange("sell")}
                            >
                                {t("ReceiptsScreen.saleLabel")}
                            </button>

                            <button
                                type="button"
                                className={`receipts-menu__type-btn${
                                    receiptType === "buy"
                                        ? " receipts-menu__type-btn--active"
                                        : ""
                                }`}
                                disabled={!hasSelectedDate}
                                aria-pressed={receiptType === "buy"}
                                onClick={() => onTypeChange("buy")}
                            >
                                {t("ReceiptsScreen.purchaseLabel")}
                            </button>
                        </div>

                        <DatePickerInput
                            value={selectedDate}
                            max={today}
                            ariaLabel={t("ReceiptsScreen.menuDateLabel")}
                            onChange={onDateChange}
                        />
                    </div>

                    <button
                        type="button"
                        className="receipts-menu__consult-btn"
                        disabled={!hasSelectedDate}
                        onClick={onConsult}
                    >
                        <Search size={16} aria-hidden="true" />
                        <span>{t("ReceiptsScreen.consultLabel")}</span>
                    </button>

                    <button
                        type="button"
                        className="receipts-menu__upload-btn"
                        onClick={() => setIsUploadModalOpen(true)}
                    >
                        <Upload size={18} aria-hidden="true" />
                        <span>{t("ReceiptsScreen.uploadLabel")}</span>
                    </button>
                </div>
            </div>

            <UploadReceiptsModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </div>
    );
};

export default ReceiptsMenu;
