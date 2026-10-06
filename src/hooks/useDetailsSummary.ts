// src/hooks/useDetailsSummary.ts
import { useQuery } from "@tanstack/react-query";
import type { SummaryMetricsByPeriod } from "../components/DetailsScreen/Balance";

const FIVE_MINUTES_MS = 1000 * 60 * 5;

/** Simulated latency (ms) so the loading skeleton is observable while the
 *  Details screen still relies on mock data. */
const MOCK_LOADING_DELAY_MS = 600;

/**
 * Canonical query key for the Details screen summary metrics.
 *
 * It is exported so future mutations can invalidate or update the exact same
 * cache entry this read query subscribes to.
 */
export const detailsSummaryQueryKey = (): readonly [string, string] => [
    "details",
    "summary",
];

const MOCK_SUMMARY_METRICS: SummaryMetricsByPeriod = {
    day: { totalBalance: 345.2, bestDay: 119.2, worstDay: -35.7 },
    month: { totalBalance: 4210.45, bestDay: 320.8, worstDay: -112.4 },
    year: { totalBalance: 48250.15, bestDay: 980, worstDay: -450.25 },
};

const fetchSummary = async (): Promise<SummaryMetricsByPeriod> => {
    await new Promise<void>((resolve) => {
        window.setTimeout(resolve, MOCK_LOADING_DELAY_MS);
    });

    // TODO: replace this mock with a Supabase-backed service call once the
    // backend endpoint for the details summary is available.
    return MOCK_SUMMARY_METRICS;
};

export const useDetailsSummary = () => {
    return useQuery<SummaryMetricsByPeriod>({
        queryKey: detailsSummaryQueryKey(),
        queryFn: fetchSummary,
        staleTime: FIVE_MINUTES_MS,
        retry: 1,
    });
};

export default useDetailsSummary;
