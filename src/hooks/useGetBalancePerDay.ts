// src/hooks/useGetBalancePerDay.ts
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetBalancePerDayService } from "../services/GetBalancePerDayService";
import {
    type DailyBalanceData,
    type GetBalancePerDayApiError,
} from "../interfaces/GetBalancePerDayService.interface";
import { getTodayIsoDate } from "../utils/date";
import type { BalanceTone } from "./useBalanceDiario";

const FIVE_MINUTES_MS = 1000 * 60 * 5;

/**
 * Percentage change of the current day relative to its opening balance.
 *
 * Returns `null` when there is nothing meaningful to render (no record yet, or
 * the closing balance has not been entered — `closingBalance === 0`).
 */
const getPercentageChange = (
    openingBalance: number,
    closingBalance: number,
): number | null => {
    if (closingBalance === 0) {
        return null;
    }
    if (openingBalance === 0) {
        return 0;
    }
    return ((closingBalance - openingBalance) / openingBalance) * 100;
};

/**
 * Resolves the tone (gain/loss/neutral) used to color the percentage change.
 */
const resolveTone = (
    openingBalance: number,
    closingBalance: number,
): BalanceTone => {
    if (closingBalance === 0) {
        return "neutral";
    }
    const net = closingBalance - openingBalance;
    if (net > 0) return "positive";
    if (net < 0) return "negative";
    return "neutral";
};

export const useGetBalancePerDay = () => {
    const date = useMemo(() => getTodayIsoDate(), []);

    const query = useQuery<DailyBalanceData | null, GetBalancePerDayApiError>({
        queryKey: ["daily-balance", date],
        queryFn: () => GetBalancePerDayService.getBalancePerDay(date),
        staleTime: FIVE_MINUTES_MS,
        retry: 1,
    });

    const balanceData = query.data ?? null;

    const percentageChange = useMemo<number | null>(
        () =>
            balanceData === null
                ? null
                : getPercentageChange(
                      balanceData.openingBalance,
                      balanceData.closingBalance,
                  ),
        [balanceData],
    );

    const tone = useMemo<BalanceTone>(
        () =>
            balanceData === null
                ? "neutral"
                : resolveTone(
                      balanceData.openingBalance,
                      balanceData.closingBalance,
                  ),
        [balanceData],
    );

    return {
        ...query,
        percentageChange,
        tone,
    };
};

export default useGetBalancePerDay;
