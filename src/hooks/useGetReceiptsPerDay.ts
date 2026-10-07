// src/hooks/useGetReceiptsPerDay.ts
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetReceiptsPerDayService } from "../services/GetReceiptsPerDayService";
import type {
    GetReceiptsPerDayApiError,
    GetReceiptsPerDayResponseData,
    ReceiptItem,
    ReceiptType as ApiReceiptType,
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
 * Criteria committed when the user clicks "Consultar". The `date` and `type`
 * drive the API request; `type` is translated to the backend `ReceiptType`
 * (`PURCHASE` / `SALE`) before the request is issued, so the backend performs
 * the filtering server-side.
 */
export interface ReceiptsSearchParams {
    date: string;
    type: ReceiptType;
}

/**
 * Maps the UI-facing receipt toggle (`"buy"` / `"sell"`) to the backend
 * `ReceiptType` (`PURCHASE` / `SALE`).
 */
const toApiReceiptType = (type: ReceiptType): ApiReceiptType =>
    type === "buy" ? "PURCHASE" : "SALE";

const receiptsPerDayQueryKey = (
    date: string,
    type: ApiReceiptType | null,
    page: number,
    limit: number,
): readonly [string, string, ApiReceiptType | null, number, number] => [
    "receipts-day",
    date,
    type,
    page,
    limit,
];

/**
 * Fetches the receipts of a single day through `GetReceiptsPerDayService`.
 *
 * The query stays disabled until `search()` is called, so no request is fired
 * on screen mount. Changing the selected date or type resets the page and
 * updates the query key, while pagination changes (page / page size) map
 * directly to the backend pagination metadata.
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

    const apiType: ApiReceiptType | null =
        searchParams === null ? null : toApiReceiptType(searchParams.type);

    const query = useQuery<
        GetReceiptsPerDayResponseData,
        GetReceiptsPerDayApiError
    >({
        queryKey: receiptsPerDayQueryKey(
            searchParams?.date ?? "",
            apiType,
            page,
            limit,
        ),
        queryFn: () =>
            GetReceiptsPerDayService.getReceiptsPerDay({
                date: searchParams?.date ?? "",
                type: apiType ?? undefined,
                page,
                limit,
            }),
        enabled: hasSearched,
        staleTime: FIVE_MINUTES_MS,
        retry: 1,
    });

    const receipts = useMemo<ReceiptItem[]>(
        () => query.data?.receipts ?? [],
        [query.data],
    );

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
