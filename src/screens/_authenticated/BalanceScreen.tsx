// src/screens/_authenticated/BalanceScreen.tsx
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/BalanceScreen.css";
import { useDailyBalance } from "../../hooks/useDailyBalance";
import { useGetBalancePerDay } from "../../hooks/useGetBalancePerDay";
import { getYesterdayIsoDate } from "../../utils/date";
import { BalanceChartContainer } from "../../components/BalanceScreen/BalanceChartContainer";
import { DayEntryBlock } from "../../components/BalanceScreen/DayEntryBlock";
import type { HistoricalStatus } from "../../components/BalanceScreen/DayEntryBlock";
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

    const yesterdayDate = useMemo(() => getYesterdayIsoDate(), []);
    const previousDayQuery = useGetBalancePerDay(yesterdayDate);

    // `isLoading` is only true while the query has no cached data and is
    // fetching for the first time (it already implies `isFetching`). Rendering
    // the skeleton during background refetches would introduce a layout shift,
    // so we gate it on the initial load only.
    if (isLoading) {
        return <BalanceScreenSkeleton />;
    }

    const previousData = previousDayQuery.data;

    const previousStatus: HistoricalStatus = previousDayQuery.isLoading
        ? "loading"
        : previousDayQuery.isError
            ? "error"
            : previousData
                ? "success"
                : "empty";

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
                    started={{
                        value: previousData?.openingBalance ?? 0,
                        draft: "",
                        isEditing: false,
                    }}
                    finished={{
                        value: previousData?.closingBalance ?? 0,
                        draft: "",
                        isEditing: false,
                    }}
                    isConfirmed
                    onBeginEdit={balance.beginEdit}
                    onChangeDraft={balance.changeDraft}
                    onCancel={balance.cancel}
                    formatAmount={balance.formatAmount}
                    formatSignedAmount={balance.formatSignedAmount}
                    historicalStatus={previousStatus}
                />

                <DayEntryBlock
                    block="today"
                    title={t("BalanceScreen.todayTitle")}
                    subtitle={t("BalanceScreen.todaySubtitle")}
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
