// src/components/ReceipsScreen/ReceipsMenu.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload } from "lucide-react";
import type { ReceiptType } from "../../hooks/useReceipsMenu";
import { UploadReceiptsModal } from "./UploadReceiptsModal";
import "./styles/ReceipsMenu.css";

interface ReceipsMenuProps {
    selectedDate: string | null;
    receiptType: ReceiptType;
    today: string;
    formattedDate: string | null;
    onDateChange: (raw: string) => void;
    onTypeChange: (type: ReceiptType) => void;
}

export const ReceipsMenu = ({
    selectedDate,
    receiptType,
    today,
    formattedDate,
    onDateChange,
    onTypeChange,
}: ReceipsMenuProps) => {
    const { t } = useTranslation("");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const hasSelectedDate = selectedDate !== null;

    const title =
        hasSelectedDate && formattedDate
            ? t("ReceipsScreen.menuTitleWithDate", { date: formattedDate })
            : t("ReceipsScreen.menuDefaultTitle");

    return (
        <div className="receips-menu">
            <div className="receips-menu__header">
                <div className="receips-menu__controls">
                    <h2 className="receips-menu__title">{title}</h2>

                    <div className="receips-menu__filters">
                        <input
                            type="date"
                            className="receips-menu__date-input"
                            value={selectedDate ?? ""}
                            max={today}
                            onChange={(event) => onDateChange(event.target.value)}
                            aria-label={t("ReceipsScreen.menuDateLabel")}
                        />

                        <div
                            className="receips-menu__type-group"
                            role="group"
                            aria-label={t("ReceipsScreen.menuTypeGroupLabel")}
                        >
                            <button
                                type="button"
                                className={`receips-menu__type-btn${
                                    receiptType === "sell"
                                        ? " receips-menu__type-btn--active"
                                        : ""
                                }`}
                                disabled={!hasSelectedDate}
                                aria-pressed={receiptType === "sell"}
                                onClick={() => onTypeChange("sell")}
                            >
                                {t("ReceipsScreen.saleLabel")}
                            </button>

                            <button
                                type="button"
                                className={`receips-menu__type-btn${
                                    receiptType === "buy"
                                        ? " receips-menu__type-btn--active"
                                        : ""
                                }`}
                                disabled={!hasSelectedDate}
                                aria-pressed={receiptType === "buy"}
                                onClick={() => onTypeChange("buy")}
                            >
                                {t("ReceipsScreen.purchaseLabel")}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="receips-menu__actions">
                    <button
                        type="button"
                        className="receips-menu__upload-btn"
                        onClick={() => setIsUploadModalOpen(true)}
                    >
                        <Upload size={18} aria-hidden="true" />
                        <span>{t("ReceipsScreen.uploadLabel")}</span>
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

export default ReceipsMenu;
