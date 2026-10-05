// src/components/BalanceScreen/DayEntryBlock.tsx
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, LoaderCircle, TriangleAlert } from "lucide-react";
import { AmountField } from "./AmountField";
import { AutomaticAlertModal } from "../shared/AutomaticAlertModal";
import "./styles/DayEntryBlock.css";
import type {
    AmountFieldState,
    BalanceBlock,
    BalanceField,
    BalanceTone,
} from "../../hooks/useDailyBalance";

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

type DayEntryAlertVariant = "success" | "error";

interface DayEntryAlert {
    variant: DayEntryAlertVariant;
    message: string;
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

    const [alert, setAlert] = useState<DayEntryAlert | null>(null);

    useEffect(() => {
        if (successMessage !== null) {
            setAlert({ variant: "success", message: successMessage });
            return;
        }

        if (errorMessage !== null) {
            setAlert({ variant: "error", message: errorMessage });
        }
    }, [successMessage, errorMessage]);

    const handleAlertClose = useCallback((): void => {
        setAlert(null);
    }, []);

    const isPrevious = block === "previous";

    // The net balance is only meaningful once the closing balance ("Terminé")
    // has been submitted for the current day. While only the opening balance
    // ("Empecé") is being entered, we must not render (nor flash) a net value.
    const showNetBalance = isPrevious || (isConfirmed && !finished.isEditing);

    // A closing balance ("Terminé") is considered "already saved" once its
    // persisted value differs from the initial zero sentinel set by
    // `createInitialField`. This lets us hide the cancel button ("X") during the
    // initial entry phase and only reveal it while editing a previously
    // submitted value.
    const hasSavedClosingBalance = finished.value !== 0;

    const startedPresentation: FieldPresentation = isPrevious
        ? { isEditing: false, disabled: false, showEditIcon: false, showCancelButton: false }
        : isConfirmed
            ? {
                isEditing: started.isEditing,
                disabled: false,
                showEditIcon: !started.isEditing,
                showCancelButton: started.isEditing,
            }
            : { isEditing: true, disabled: false, showEditIcon: false, showCancelButton: false };

    const finishedPresentation: FieldPresentation = isPrevious
        ? { isEditing: false, disabled: false, showEditIcon: false, showCancelButton: false }
        : isConfirmed
            ? {
                isEditing: finished.isEditing,
                disabled: false,
                showEditIcon: !finished.isEditing,
                showCancelButton: finished.isEditing && hasSavedClosingBalance,
            }
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

            {alert !== null ? (
                <AutomaticAlertModal
                    isOpen
                    onClose={handleAlertClose}
                    message={alert.message}
                    icon={
                        alert.variant === "success" ? (
                            <Check size={24} aria-hidden="true" />
                        ) : (
                            <TriangleAlert size={24} aria-hidden="true" />
                        )
                    }
                    variant={alert.variant}
                />
            ) : null}
        </section>
    );
};

export default DayEntryBlock;
