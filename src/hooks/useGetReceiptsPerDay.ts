// src/hooks/useGetReceiptsPerDay.ts
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetReceiptsPerDayService } from "../services/GetReceiptsPerDayService";
import type {
    GetReceiptsPerDayApiError,
    GetReceiptsPerDayResponseData,
    ReceiptItem,
} from "../interfaces/GetReceiptsPerDayService.interface";
import { useLocalStorage } from "./useLocalStorage";
import type { ReceiptType } from "./useReceiptsMenu";

/**
 * Cache TTL for the receipts per day query. Receipts are only refreshed
 * on-demand, so a longer stale time keeps previously consulted days instant
 * while still allowing a manual refetch through the search trigger.
 */
const FIVE_MINUTES_MS = 1000 * 60 * 5;

const RECEIPTS_PAGE_SIZE_KEY = "daily_fi_receipts_page_size";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Criteria committed when the user clicks "Consultar". The date drives the
 * API request, while `type` is applied as a client-side filter because the
 * endpoint is scoped to a day and returns both PURCHASE and SALE receipts.
 */
export interface ReceiptsSearchParams {
    date: string;
    type: ReceiptType;
}

const receiptsPerDayQueryKey = (
    date: string,
    page: number,
    limit: number,
): readonly [string, string, number, number] => [
    "receipts-day",
    date,
    page,
    limit,
];

/**
 * Fetches the receipts of a single day through `GetReceiptsPerDayService`.
 *
 * The query stays disabled until `search()` is called, so no request is fired
 * on screen mount. Pagination changes (page / page size) update the query key
 * and trigger a new fetch, mapping directly to the backend pagination metadata.
 */
export const useGetReceiptsPerDay = () => {
    const [searchParams, setSearchParams] =
        useState<ReceiptsSearchParams | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useLocalStorage<number>(
        RECEIPTS_PAGE_SIZE_KEY,
        DEFAULT_PAGE_SIZE,
    );

    const hasSearched = searchParams !== null;

    const query = useQuery<
        GetReceiptsPerDayResponseData,
        GetReceiptsPerDayApiError
    >({
        queryKey: receiptsPerDayQueryKey(searchParams?.date ?? "", page, limit),
        queryFn: () =>
            GetReceiptsPerDayService.getReceiptsPerDay({
                date: searchParams?.date ?? "",
                page,
                limit,
            }),
        enabled: hasSearched,
        staleTime: FIVE_MINUTES_MS,
        retry: 1,
    });

    const receipts = useMemo<ReceiptItem[]>(() => {
        const allReceipts = query.data?.receipts ?? [];
        if (searchParams === null) {
            return allReceipts;
        }
        const targetType = searchParams.type === "buy" ? "PURCHASE" : "SALE";
        return allReceipts.filter((receipt) => receipt.type === targetType);
    }, [query.data, searchParams]);

    const search = useCallback((params: ReceiptsSearchParams): void => {
        setSearchParams(params);
        setPage(1);
    }, []);

    const changePage = useCallback((nextPage: number): void => {
        setPage(nextPage);
    }, []);

    const changeLimit = useCallback(
        (nextLimit: number): void => {
            setLimit(nextLimit);
            setPage(1);
        },
        [setLimit],
    );

    return {
        ...query,
        receipts,
        pagination: query.data?.pagination ?? null,
        hasSearched,
        limit,
        search,
        changePage,
        changeLimit,
    };
};

export type UseGetReceiptsPerDayResult = ReturnType<
    typeof useGetReceiptsPerDay
>;

export default useGetReceiptsPerDay;
