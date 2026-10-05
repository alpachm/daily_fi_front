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
