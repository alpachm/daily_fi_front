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

// A closed day's net outcome: income days report a positive result, expense
// days report a negative result, and break-even days report zero.
const resolveDayNetResult = (record: DailyBalanceItem): number => {
    if (record.totalIncome > 0) return record.totalIncome;
    if (record.totalExpenses > 0) return -record.totalExpenses;
    return 0;
};

const findWorstDay = (records: DailyBalanceItem[]): DailyBalanceItem =>
    records.reduce((worst, current) =>
        resolveDayNetResult(current) < resolveDayNetResult(worst)
            ? current
            : worst,
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

    // Peor Día: the day with the lowest net outcome across the period. It can
    // be a net loss, a small net profit, or a break-even day.
    const worstDayRecord = findWorstDay(sorted);

    return {
        totalBalance: mostRecent.closingBalance,
        bestDay: { value: bestDayRecord.totalIncome, date: bestDayRecord.date },
        worstDay: {
            value: resolveDayNetResult(worstDayRecord),
            date: worstDayRecord.date,
        },
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
