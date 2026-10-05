// src/components/BalanceScreen/DayEntryBlock.tsx
import { useTranslation } from "react-i18next";
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
    onBeginEdit: (block: BalanceBlock, field: BalanceField) => void;
    onChangeDraft: (block: BalanceBlock, field: BalanceField, raw: string) => void;
    onCommit: (block: BalanceBlock, field: BalanceField) => void;
    onCancel: (block: BalanceBlock, field: BalanceField) => void;
    onConfirmBlock?: () => void;
    formatAmount: (value: number) => string;
    formatSignedAmount: (value: number) => string;
}

interface FieldPresentation {
    isEditing: boolean;
    disabled: boolean;
    showEditIcon: boolean;
    showInlineActions: boolean;
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
    onBeginEdit,
    onChangeDraft,
    onCommit,
    onCancel,
    onConfirmBlock,
    formatAmount,
    formatSignedAmount,
}: DayEntryBlockProps) => {
    const { t } = useTranslation("");

    const isPrevious = block === "previous";

    const startedPresentation: FieldPresentation = isPrevious
        ? { isEditing: false, disabled: false, showEditIcon: false, showInlineActions: false }
        : isConfirmed
            ? { isEditing: started.isEditing, disabled: false, showEditIcon: true, showInlineActions: true }
            : { isEditing: true, disabled: false, showEditIcon: false, showInlineActions: false };

    const finishedPresentation: FieldPresentation = isPrevious
        ? { isEditing: false, disabled: false, showEditIcon: false, showInlineActions: false }
        : isConfirmed
            ? { isEditing: finished.isEditing, disabled: false, showEditIcon: false, showInlineActions: false }
            : { isEditing: true, disabled: true, showEditIcon: false, showInlineActions: false };

    const showConfirmButton =
        !isPrevious && onConfirmBlock !== undefined && (!isConfirmed || finished.isEditing);

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
                    showInlineActions={startedPresentation.showInlineActions}
                    onBeginEdit={() => onBeginEdit(block, "started")}
                    onChangeDraft={(raw) => onChangeDraft(block, "started", raw)}
                    onCommit={() => onCommit(block, "started")}
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
                    showInlineActions={finishedPresentation.showInlineActions}
                    onBeginEdit={() => onBeginEdit(block, "finished")}
                    onChangeDraft={(raw) => onChangeDraft(block, "finished", raw)}
                    onCommit={() => onCommit(block, "finished")}
                    onCancel={() => onCancel(block, "finished")}
                    formatAmount={formatAmount}
                />
            </div>

            <footer className="day-entry-block__footer">
                <span className="day-entry-block__net-label">{t("BalanceScreen.netLabel")}</span>
                <span className={`day-entry-block__net day-entry-block__net--${tone}`}>
                    {formatSignedAmount(net)}
                </span>
            </footer>

            {showConfirmButton ? (
                <button
                    type="button"
                    className="day-entry-block__confirm"
                    disabled={!canConfirm}
                    onClick={onConfirmBlock}
                >
                    {confirmLabel}
                </button>
            ) : null}
        </section>
    );
};

export default DayEntryBlock;
