// src/screens/_authenticated/BalanceScreen.tsx
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/BalanceScreen.css";
import { useDailyBalance } from "../../hooks/useDailyBalance";
import { useGetBalancePerDay } from "../../hooks/useGetBalancePerDay";
import { BalanceChartContainer } from "../../components/BalanceScreen/BalanceChartContainer";
import { DayEntryBlock } from "../../components/BalanceScreen/DayEntryBlock";
import { BalanceScreenSkeleton } from "../../components/BalanceScreen/BalanceScreenSkeleton";

export const BalanceScreen = () => {
    const { t } = useTranslation("");
    const balance = useDailyBalance();
    const {
        data: balanceData,
        isLoading,
        percentageChange,
        tone,
    } = useGetBalancePerDay();

    const { hydrateToday } = balance;

    useEffect(() => {
        if (balanceData != null) {
            hydrateToday(balanceData);
        }
    }, [balanceData, hydrateToday]);

    // `isLoading` is only true while the query has no cached data and is
    // fetching for the first time (it already implies `isFetching`). Rendering
    // the skeleton during background refetches would introduce a layout shift,
    // so we gate it on the initial load only.
    if (isLoading) {
        return <BalanceScreenSkeleton />;
    }

    const openingBalance = balanceData?.openingBalance ?? null;

    const totalNetDisplay =
        openingBalance === null
            ? t("BalanceScreen.noData")
            : balance.formatAmount(openingBalance);

    const percentageChangeDisplay =
        percentageChange === null
            ? t("BalanceScreen.noData")
            : balance.formatPercentage(percentageChange);

    return (
        <div className="balance-screen">
            <BalanceChartContainer
                totalNetDisplay={totalNetDisplay}
                percentageChangeDisplay={percentageChangeDisplay}
                percentageChangeTone={tone}
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
                    isSubmitting={balance.isSubmittingToday}
                    errorMessage={balance.todayError}
                    successMessage={balance.todaySuccess}
                    formatAmount={balance.formatAmount}
                    formatSignedAmount={balance.formatSignedAmount}
                />
            </div>
        </div>
    );
};

export default BalanceScreen;
