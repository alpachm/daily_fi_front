// src/hooks/useDetailsBalance.ts
import { useMemo } from "react";
import type { DailyBalanceItem } from "../interfaces/GetRecentDailyBalanceService.interface";
import { useRecentDailyBalances } from "./useRecentDailyBalances";

const LAST_100_DAYS_COUNT = 100;

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

/**
 * Balance Total: the latest available closing balance. If the most recent
 * record is still open (closingBalance === 0), fall back to the most recent
 * record that already has a closing balance.
 */
const findLatestClosingBalance = (sorted: DailyBalanceItem[]): number => {
    for (let index = sorted.length - 1; index >= 0; index -= 1) {
        const record = sorted[index];
        if (record.closingBalance !== 0) {
            return record.closingBalance;
        }
    }
    return 0;
};

const findBestDay = (sorted: DailyBalanceItem[]): DailyBalanceItem =>
    sorted.reduce((best, current) =>
        current.totalIncome > best.totalIncome ? current : best,
    );

const findWorstExpenseDay = (sorted: DailyBalanceItem[]): DailyBalanceItem =>
    sorted.reduce((worst, current) =>
        current.totalExpenses > worst.totalExpenses ? current : worst,
    );

const findLowestIncomeDay = (sorted: DailyBalanceItem[]): DailyBalanceItem =>
    sorted.reduce((lowest, current) =>
        current.totalIncome < lowest.totalIncome ? current : lowest,
    );

export const useDetailsBalance = () => {
    const { data: recentBalances, isLoading, isError } =
        useRecentDailyBalances(LAST_100_DAYS_COUNT);

    const metrics = useMemo<SummaryMetrics>(() => {
        if (!recentBalances || recentBalances.length === 0) {
            return EMPTY_METRICS;
        }

        const sorted = [...recentBalances].sort(sortByDateAscending);

        const bestDayRecord = findBestDay(sorted);

        // Peor Día: highest operational loss. Prefer the day with the maximum
        // expense; when no day has expenses, fall back to the lowest income day.
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
            totalBalance: findLatestClosingBalance(sorted),
            bestDay: { value: bestDayRecord.totalIncome, date: bestDayRecord.date },
            worstDay,
        };
    }, [recentBalances]);

    return { metrics, isLoading, isError };
};

export default useDetailsBalance;
