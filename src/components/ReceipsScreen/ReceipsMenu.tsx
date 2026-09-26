// src/components/ReceipsScreen/ReceipsMenu.tsx
import { useTranslation } from "react-i18next";
import { Upload } from "lucide-react";
import { useReceipsMenu } from "../../hooks/useReceipsMenu";
import "./styles/ReceipsMenu.css";

export const ReceipsMenu = () => {
    const { t } = useTranslation("");
    const {
        selectedDate,
        receiptType,
        today,
        formattedDate,
        handleDateChange,
        handleReceiptTypeChange,
    } = useReceipsMenu();

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
                            onChange={(event) => handleDateChange(event.target.value)}
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
                                onClick={() => handleReceiptTypeChange("sell")}
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
                                onClick={() => handleReceiptTypeChange("buy")}
                            >
                                {t("ReceipsScreen.purchaseLabel")}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="receips-menu__actions">
                    <button type="button" className="receips-menu__upload-btn">
                        <Upload size={18} aria-hidden="true" />
                        <span>{t("ReceipsScreen.uploadLabel")}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceipsMenu;
