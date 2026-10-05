// src/components/BalanceScreen/DayEntryBlock.tsx
import { useTranslation } from "react-i18next";
import { Check, LoaderCircle, TriangleAlert } from "lucide-react";
import { AmountField } from "./AmountField";
import "./styles/DayEntryBlock.css";
import type {
    AmountFieldState,
    BalanceBlock,
    BalanceField,
    BalanceTone,
} from "../../hooks/useBalanceDiario";

interface DayEntryBlockProps {
    block: BalanceBlock;
    title: string;
    subtitle: string;
    tone: BalanceTone;
    net: number;
    started: AmountFieldState;
    finished: AmountFieldState;
    isConfirmed: boolean;
    canConfirm?: boolean;
    isSubmitting?: boolean;
    errorMessage?: string | null;
    successMessage?: string | null;
    onBeginEdit: (block: BalanceBlock, field: BalanceField) => void;
    onChangeDraft: (block: BalanceBlock, field: BalanceField, raw: string) => void;
    onCancel: (block: BalanceBlock, field: BalanceField) => void;
    onConfirmBlock?: () => Promise<void>;
    formatAmount: (value: number) => string;
    formatSignedAmount: (value: number) => string;
}

interface FieldPresentation {
    isEditing: boolean;
    disabled: boolean;
    showEditIcon: boolean;
    showCancelButton: boolean;
}

export const DayEntryBlock = ({
    block,
    title,
    subtitle,
    tone,
    net,
    started,
    finished,
    isConfirmed,
    canConfirm = false,
    isSubmitting = false,
    errorMessage = null,
    successMessage = null,
    onBeginEdit,
    onChangeDraft,
    onCancel,
    onConfirmBlock,
    formatAmount,
    formatSignedAmount,
}: DayEntryBlockProps) => {
    const { t } = useTranslation("");

    const isPrevious = block === "previous";

    // The net balance is only meaningful once the closing balance ("Terminé")
    // has been submitted for the current day. While only the opening balance
    // ("Empecé") is being entered, we must not render (nor flash) a net value.
    const showNetBalance = isPrevious || (isConfirmed && !finished.isEditing);

    const startedPresentation: FieldPresentation = isPrevious
        ? { isEditing: false, disabled: false, showEditIcon: false, showCancelButton: false }
        : isConfirmed
            ? { isEditing: started.isEditing, disabled: false, showEditIcon: true, showCancelButton: true }
            : { isEditing: true, disabled: false, showEditIcon: false, showCancelButton: false };

    const finishedPresentation: FieldPresentation = isPrevious
        ? { isEditing: false, disabled: false, showEditIcon: false, showCancelButton: false }
        : isConfirmed
            ? { isEditing: finished.isEditing, disabled: false, showEditIcon: true, showCancelButton: true }
            : { isEditing: true, disabled: true, showEditIcon: false, showCancelButton: false };

    const showConfirmButton =
        !isPrevious &&
        onConfirmBlock !== undefined &&
        (!isConfirmed || started.isEditing || finished.isEditing);

    const confirmLabel = isConfirmed ? t("Actions.close") : t("Actions.confirm");

    return (
        <section className="day-entry-block">
            <header className="day-entry-block__header">
                <h2 className="day-entry-block__title">{title}</h2>
                <p className="day-entry-block__subtitle">{subtitle}</p>
            </header>

            <div className="day-entry-block__fields">
                <AmountField
                    label={t("BalanceScreen.startedLabel")}
                    value={started.value}
                    draft={started.draft}
                    isEditing={startedPresentation.isEditing}
                    disabled={startedPresentation.disabled}
                    showEditIcon={startedPresentation.showEditIcon}
                    showCancelButton={startedPresentation.showCancelButton}
                    onBeginEdit={() => onBeginEdit(block, "started")}
                    onChangeDraft={(raw) => onChangeDraft(block, "started", raw)}
                    onCancel={() => onCancel(block, "started")}
                    formatAmount={formatAmount}
                />
                <AmountField
                    label={t("BalanceScreen.finishedLabel")}
                    value={finished.value}
                    draft={finished.draft}
                    isEditing={finishedPresentation.isEditing}
                    disabled={finishedPresentation.disabled}
                    showEditIcon={finishedPresentation.showEditIcon}
                    showCancelButton={finishedPresentation.showCancelButton}
                    onBeginEdit={() => onBeginEdit(block, "finished")}
                    onChangeDraft={(raw) => onChangeDraft(block, "finished", raw)}
                    onCancel={() => onCancel(block, "finished")}
                    formatAmount={formatAmount}
                />
            </div>

            {errorMessage !== null ? (
                <div
                    className="day-entry-block__alert day-entry-block__alert--error"
                    role="alert"
                >
                    <TriangleAlert
                        size={18}
                        className="day-entry-block__alert-icon"
                        aria-hidden="true"
                    />
                    <span>{errorMessage}</span>
                </div>
            ) : null}

            {successMessage !== null ? (
                <div
                    className="day-entry-block__alert day-entry-block__alert--success"
                    role="status"
                >
                    <Check
                        size={18}
                        className="day-entry-block__alert-icon"
                        aria-hidden="true"
                    />
                    <span>{successMessage}</span>
                </div>
            ) : null}

            {showNetBalance ? (
                <footer className="day-entry-block__footer">
                    <span className="day-entry-block__net-label">{t("BalanceScreen.netLabel")}</span>
                    <span className={`day-entry-block__net day-entry-block__net--${tone}`}>
                        {formatSignedAmount(net)}
                    </span>
                </footer>
            ) : null}

            {showConfirmButton ? (
                <button
                    type="button"
                    className="day-entry-block__confirm"
                    disabled={!canConfirm || isSubmitting}
                    aria-busy={isSubmitting}
                    onClick={onConfirmBlock}
                >
                    {isSubmitting ? (
                        <LoaderCircle
                            size={18}
                            className="day-entry-block__spinner"
                            aria-hidden="true"
                        />
                    ) : null}
                    {confirmLabel}
                </button>
            ) : null}
        </section>
    );
};

export default DayEntryBlock;
