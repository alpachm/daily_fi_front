// src/hooks/useLocalStorage.ts
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

export type UseLocalStorageResult<T> = readonly [T, Dispatch<SetStateAction<T>>];

const readStoredValue = <T>(key: string, fallback: T): T => {
    try {
        const raw = window.localStorage.getItem(key);
        if (raw === null) {
            return fallback;
        }

        const parsed: unknown = JSON.parse(raw);
        return parsed as T;
    } catch (error) {
        console.warn(`useLocalStorage: failed to read "${key}"`, error);
        return fallback;
    }
};

export const useLocalStorage = <T>(
    key: string,
    initialValue: T,
): UseLocalStorageResult<T> => {
    const [storedValue, setStoredValue] = useState<T>(() =>
        readStoredValue(key, initialValue),
    );

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.warn(`useLocalStorage: failed to write "${key}"`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as const;
};

export default useLocalStorage;
