// src/components/BalanceScreen/AmountField.tsx
import { useTranslation } from "react-i18next";
import { Edit2, X } from "lucide-react";
import "./styles/AmountField.css";

interface AmountFieldProps {
    label: string;
    value: number;
    draft: string;
    isEditing: boolean;
    showCancelButton: boolean;
    disabled?: boolean;
    showEditIcon?: boolean;
    onBeginEdit: () => void;
    onChangeDraft: (raw: string) => void;
    onCancel: () => void;
    formatAmount: (value: number) => string;
}

export const AmountField = ({
    label,
    value,
    draft,
    isEditing,
    showCancelButton,
    disabled = false,
    showEditIcon = true,
    onBeginEdit,
    onChangeDraft,
    onCancel,
    formatAmount,
}: AmountFieldProps) => {
    const { t } = useTranslation("");

    return (
        <div className="amount-field">
            <span className="amount-field__label">{label}</span>

            {isEditing ? (
                <div className="amount-field__editor">
                    <input
                        className="amount-field__input"
                        type="number"
                        inputMode="decimal"
                        step="any"
                        value={draft}
                        disabled={disabled}
                        onChange={(event) => onChangeDraft(event.target.value)}
                        autoFocus
                    />
                    {showCancelButton ? (
                        <button
                            type="button"
                            className="amount-field__action"
                            onClick={onCancel}
                            aria-label={t("Actions.cancel")}
                        >
                            <X size={18} aria-hidden="true" />
                        </button>
                    ) : null}
                </div>
            ) : (
                <div className="amount-field__display">
                    <span className="amount-field__value">{formatAmount(value)}</span>
                    {showEditIcon ? (
                        <button
                            type="button"
                            className="amount-field__action"
                            onClick={onBeginEdit}
                            aria-label={t("BalanceScreen.editLabel")}
                        >
                            <Edit2 size={18} aria-hidden="true" />
                        </button>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default AmountField;
