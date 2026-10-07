// src/hooks/useDailyHistory.ts
import type { HistoryRecord } from "../components/DetailsScreen/HistoryTable";

const MOCK_NET_AMOUNTS: number[] = [
    35.7, -12.4, 119.2, 0, -35.7, 58.15, 72.3,
];

const MOCK_HISTORY_RECORDS: HistoryRecord[] = MOCK_NET_AMOUNTS.map(
    (amount, index): HistoryRecord => {
        const day = String(20 + index).padStart(2, "0");
        return {
            id: `hist-${day}-06-26`,
            isoDate: `2026-06-${day}`,
            date: `${day}-06-26`,
            openingBalance: 0,
            closingBalance: amount,
            totalIncome: amount > 0 ? amount : 0,
            totalExpenses: amount < 0 ? Math.abs(amount) : 0,
        };
    },
);

/**
 * Provides the daily balance history records.
 *
 * TODO: replace the mock data with a Supabase query once the backend
 * endpoint for daily balances is available.
 */
export const useDailyHistory = (): { records: HistoryRecord[] } => {
    return { records: MOCK_HISTORY_RECORDS };
};

export default useDailyHistory;
