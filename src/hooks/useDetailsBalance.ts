// src/hooks/useDetailsBalance.ts
import { useMemo } from "react";
import type { DailyBalanceItem } from "../interfaces/GetRecentDailyBalanceService.interface";
import { useRecentDailyBalances } from "./useRecentDailyBalances";

const LAST_100_DAYS_COUNT = 100;

export interface SummaryMetrics {
    totalBalance: number;
    bestDay: number;
    worstDay: number;
}

const EMPTY_METRICS: SummaryMetrics = {
    totalBalance: 0,
    bestDay: 0,
    worstDay: 0,
};

const getDailyNet = (item: DailyBalanceItem): number =>
    item.totalIncome - item.totalExpenses;

const sumNets = (nets: number[]): number =>
    nets.reduce((total, net) => total + net, 0);

export const useDetailsBalance = () => {
    const { data: recentBalances, isLoading, isError } = useRecentDailyBalances();

    const metrics = useMemo<SummaryMetrics>(() => {
        if (!recentBalances || recentBalances.length === 0) {
            return EMPTY_METRICS;
        }

        const last100Days = [...recentBalances]
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(-LAST_100_DAYS_COUNT);

        const nets = last100Days.map(getDailyNet);

        return {
            totalBalance: sumNets(nets),
            bestDay: Math.max(...nets),
            worstDay: Math.min(...nets),
        };
    }, [recentBalances]);

    return { metrics, isLoading, isError };
};

export default useDetailsBalance;
