// src/components/BalanceScreen/AmountField.tsx
import { useTranslation } from "react-i18next";
import { Check, Edit2, X } from "lucide-react";
import "./styles/AmountField.css";

interface AmountFieldProps {
    label: string;
    value: number;
    draft: string;
    isEditing: boolean;
    showInlineActions: boolean;
    disabled?: boolean;
    showEditIcon?: boolean;
    onBeginEdit: () => void;
    onChangeDraft: (raw: string) => void;
    onCommit: () => void;
    onCancel: () => void;
    formatAmount: (value: number) => string;
}

export const AmountField = ({
    label,
    value,
    draft,
    isEditing,
    showInlineActions,
    disabled = false,
    showEditIcon = true,
    onBeginEdit,
    onChangeDraft,
    onCommit,
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
                    {showInlineActions ? (
                        <div className="amount-field__actions">
                            <button
                                type="button"
                                className="amount-field__action"
                                onClick={onCommit}
                                aria-label={t("Actions.confirm")}
                            >
                                <Check size={18} aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className="amount-field__action"
                                onClick={onCancel}
                                aria-label={t("Actions.cancel")}
                            >
                                <X size={18} aria-hidden="true" />
                            </button>
                        </div>
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
