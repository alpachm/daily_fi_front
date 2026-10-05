// src/screens/_authenticated/BalanceScreen.tsx
import { useTranslation } from "react-i18next";
import "../../styles/BalanceScreen.css";
import { useBalanceDiario } from "../../hooks/useBalanceDiario";
import { BalanceChartContainer } from "../../components/BalanceScreen/BalanceChartContainer";
import { DayEntryBlock } from "../../components/BalanceScreen/DayEntryBlock";

export const BalanceScreen = () => {
    const { t } = useTranslation("");
    const balance = useBalanceDiario();

    return (
        <div className="balance-screen">
            <BalanceChartContainer
                net={balance.todayNet}
                tone={balance.todayTone}
                percentageChange={balance.percentageChange}
                formatSignedAmount={balance.formatSignedAmount}
                formatPercentage={balance.formatPercentage}
            />

            <div className="balance-screen__columns">
                <DayEntryBlock
                    block="previous"
                    title={t("BalanceScreen.previousDayTitle")}
                    subtitle={t("BalanceScreen.previousDaySubtitle")}
                    tone={balance.previousTone}
                    net={balance.previousNet}
                    started={balance.previous.started}
                    finished={balance.previous.finished}
                    isConfirmed
                    onBeginEdit={balance.beginEdit}
                    onChangeDraft={balance.changeDraft}
                    onCancel={balance.cancel}
                    formatAmount={balance.formatAmount}
                    formatSignedAmount={balance.formatSignedAmount}
                />

                <DayEntryBlock
                    block="today"
                    title={t("BalanceScreen.todayTitle")}
                    subtitle={t("BalanceScreen.todaySubtitle")}
                    tone={balance.todayTone}
                    net={balance.todayNet}
                    started={balance.today.started}
                    finished={balance.today.finished}
                    isConfirmed={balance.isTodayConfirmed}
                    onBeginEdit={balance.beginEdit}
                    onChangeDraft={balance.changeDraft}
                    onCancel={balance.cancel}
                    onConfirmBlock={balance.confirmToday}
                    canConfirm={balance.canConfirmToday}
                    formatAmount={balance.formatAmount}
                    formatSignedAmount={balance.formatSignedAmount}
                />
            </div>
        </div>
    );
};

export default BalanceScreen;
