// src/interfaces/DailyBalance.interface.ts

/**
 * Daily balance entity returned by the backend for both creation and
 * retrieval endpoints.
 *
 * It is extracted to a dedicated shared model file because it is reused by
 * more than one service (create and get daily balance) and must remain a
 * single source of truth.
 */
export interface DailyBalanceData {
    id: number;
    userId: number;
    date: string;
    openingBalance: number;
    closingBalance: number;
    totalIncome: number;
    totalExpenses: number;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}
