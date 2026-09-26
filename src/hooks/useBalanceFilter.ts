// src/hooks/useBalanceFilter.ts
import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { FilterPeriod } from "../components/DetailsScreen/Balance";

export interface FilterOption {
    value: FilterPeriod;
    label: string;
}

interface UseBalanceFilterResult {
    period: FilterPeriod;
    isOpen: boolean;
    containerRef: RefObject<HTMLDivElement | null>;
    toggle: () => void;
    select: (period: FilterPeriod) => void;
}

export const useBalanceFilter = (
    initialPeriod: FilterPeriod = "month",
): UseBalanceFilterResult => {
    const [period, setPeriod] = useState<FilterPeriod>(initialPeriod);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const toggle = useCallback((): void => {
        setIsOpen((open) => !open);
    }, []);

    const select = useCallback((next: FilterPeriod): void => {
        setPeriod(next);
        setIsOpen(false);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: MouseEvent): void => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return { period, isOpen, containerRef, toggle, select };
};

export default useBalanceFilter;
