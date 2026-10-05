// src/utils/date.ts

/**
 * Returns the current local date formatted as `YYYY-MM-DD`.
 *
 * It intentionally relies on `new Date()` so the value reflects the user's
 * local timezone, which is what the backend expects when opening the current
 * day's shift.
 */
export const getTodayIsoDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

/**
 * Returns the previous local date formatted as `YYYY-MM-DD`.
 *
 * The `Date` constructor normalizes day-of-month overflow and underflow, so
 * this handles month and year boundary transitions correctly (e.g. Jan 1 →
 * Dec 31, or Mar 1 → Feb 28/29) without manual calendar arithmetic.
 */
export const getYesterdayIsoDate = (): string => {
    const now = new Date();
    const yesterday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1,
    );
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, "0");
    const day = String(yesterday.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
