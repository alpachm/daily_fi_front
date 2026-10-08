// src/hooks/useDetailsBalance.ts
import { useMemo } from "react";
import type { DailyBalanceItem } from "../interfaces/GetAllDailyBalancesService.interface";

export interface MetricDay {
    value: number;
    date: string | null;
}

export interface SummaryMetrics {
    totalBalance: number;
    bestDay: MetricDay;
    worstDay: MetricDay;
}

const EMPTY_METRIC_DAY: MetricDay = {
    value: 0,
    date: null,
};

const EMPTY_METRICS: SummaryMetrics = {
    totalBalance: 0,
    bestDay: EMPTY_METRIC_DAY,
    worstDay: EMPTY_METRIC_DAY,
};

const sortByDateAscending = (
    first: DailyBalanceItem,
    second: DailyBalanceItem,
): number => first.date.localeCompare(second.date);

const findBestDay = (records: DailyBalanceItem[]): DailyBalanceItem =>
    records.reduce((best, current) =>
        current.totalIncome > best.totalIncome ? current : best,
    );

const findWorstExpenseDay = (records: DailyBalanceItem[]): DailyBalanceItem =>
    records.reduce((worst, current) =>
        current.totalExpenses > worst.totalExpenses ? current : worst,
    );

const findLowestIncomeDay = (records: DailyBalanceItem[]): DailyBalanceItem =>
    records.reduce((lowest, current) =>
        current.totalIncome < lowest.totalIncome ? current : lowest,
    );

const deriveSummaryMetrics = (
    records: DailyBalanceItem[] | undefined,
): SummaryMetrics => {
    if (!records || records.length === 0) {
        return EMPTY_METRICS;
    }

    const sorted = [...records].sort(sortByDateAscending);

    // Balance Total: closingBalance of the most recent record.
    const mostRecent = sorted[sorted.length - 1];

    const bestDayRecord = findBestDay(sorted);

    // Peor Día: highest operational expense. When no record has expenses,
    // fall back to the day with the lowest income.
    const worstExpenseDay = findWorstExpenseDay(sorted);
    const hasAnyExpense = worstExpenseDay.totalExpenses > 0;

    let worstDay: MetricDay;
    if (hasAnyExpense) {
        worstDay = {
            value: -worstExpenseDay.totalExpenses,
            date: worstExpenseDay.date,
        };
    } else {
        const lowestIncomeDay = findLowestIncomeDay(sorted);
        worstDay = {
            value: -lowestIncomeDay.totalIncome,
            date: lowestIncomeDay.date,
        };
    }

    return {
        totalBalance: mostRecent.closingBalance,
        bestDay: { value: bestDayRecord.totalIncome, date: bestDayRecord.date },
        worstDay,
    };
};

/**
 * Derives the details balance summary metrics from the provided daily
 * balances array. The derivation is memoized against the input reference.
 */
export const useDetailsBalance = (
    records: DailyBalanceItem[] | undefined,
): SummaryMetrics => useMemo(() => deriveSummaryMetrics(records), [records]);

export default useDetailsBalance;
