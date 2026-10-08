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

/**
 * Formats an ISO date (`YYYY-MM-DD`) as a short human-readable label
 * (e.g. "6 oct" / "Oct 6") for chart axes. Falls back to the raw value when
 * the input is not a parseable ISO date.
 */
export const formatShortDate = (isoDate: string, locale?: string): string => {
    const [year, month, day] = isoDate.split("-");
    const parsedYear = Number(year);
    const parsedMonth = Number(month);
    const parsedDay = Number(day);

    if (
        !Number.isFinite(parsedYear) ||
        !Number.isFinite(parsedMonth) ||
        !Number.isFinite(parsedDay)
    ) {
        return isoDate;
    }

    const date = new Date(parsedYear, parsedMonth - 1, parsedDay);
    return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
    }).format(date);
};

/**
 * Formats an ISO date (`YYYY-MM-DD`) as a localized full date
 * (e.g. "6 oct 2026" / "Oct 6, 2026"). Falls back to the raw value when the
 * input is not a parseable ISO date.
 */
export const formatFullDate = (isoDate: string, locale?: string): string => {
    const [year, month, day] = isoDate.split("-");
    const parsedYear = Number(year);
    const parsedMonth = Number(month);
    const parsedDay = Number(day);

    if (
        !Number.isFinite(parsedYear) ||
        !Number.isFinite(parsedMonth) ||
        !Number.isFinite(parsedDay)
    ) {
        return isoDate;
    }

    const date = new Date(parsedYear, parsedMonth - 1, parsedDay);
    return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
};
