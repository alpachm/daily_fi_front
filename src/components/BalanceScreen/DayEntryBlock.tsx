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
    onBeginEdit: (block: BalanceBlock, field: BalanceField) => void;
    onChangeDraft: (block: BalanceBlock, field: BalanceField, raw: string) => void;
    onCommit: (block: BalanceBlock, field: BalanceField) => void;
    onCancel: (block: BalanceBlock, field: BalanceField) => void;
    onConfirmBlock?: () => void;
    formatAmount: (value: number) => string;
    formatSignedAmount: (value: number) => string;
}

interface FieldDescriptor {
    key: BalanceField;
    label: string;
    state: AmountFieldState;
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
    onBeginEdit,
    onChangeDraft,
    onCommit,
    onCancel,
    onConfirmBlock,
    formatAmount,
    formatSignedAmount,
}: DayEntryBlockProps) => {
    const { t } = useTranslation("");

    const fields: FieldDescriptor[] = [
        { key: "started", label: t("BalanceScreen.startedLabel"), state: started },
        { key: "finished", label: t("BalanceScreen.finishedLabel"), state: finished },
    ];

    return (
        <section className="day-entry-block">
            <header className="day-entry-block__header">
                <h2 className="day-entry-block__title">{title}</h2>
                <p className="day-entry-block__subtitle">{subtitle}</p>
            </header>

            <div className="day-entry-block__fields">
                {fields.map(({ key, label, state }) => (
                    <AmountField
                        key={key}
                        label={label}
                        value={state.value}
                        draft={state.draft}
                        isEditing={isConfirmed ? state.isEditing : true}
                        showInlineActions={isConfirmed}
                        onBeginEdit={() => onBeginEdit(block, key)}
                        onChangeDraft={(raw) => onChangeDraft(block, key, raw)}
                        onCommit={() => onCommit(block, key)}
                        onCancel={() => onCancel(block, key)}
                        formatAmount={formatAmount}
                    />
                ))}
            </div>

            <footer className="day-entry-block__footer">
                <span className="day-entry-block__net-label">{t("BalanceScreen.netLabel")}</span>
                <span className={`day-entry-block__net day-entry-block__net--${tone}`}>
                    {formatSignedAmount(net)}
                </span>
            </footer>

            {!isConfirmed && onConfirmBlock ? (
                <button type="button" className="day-entry-block__confirm" onClick={onConfirmBlock}>
                    {t("Actions.confirm")}
                </button>
            ) : null}
        </section>
    );
};

export default DayEntryBlock;
