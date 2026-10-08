// src/context/ThemeContext.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ThemeContext } from "../hooks/useTheme";
import type { ResolvedTheme, ThemeContextValue, ThemeMode } from "../hooks/useTheme";

interface ThemeProviderProps {
    children: ReactNode;
}

const THEME_STORAGE_KEY = "app_theme";
const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

const readStoredTheme = (): ThemeMode => {
    try {
        const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "light" || stored === "dark" || stored === "system") {
            return stored;
        }
    } catch (error) {
        console.warn(`ThemeContext: failed to read "${THEME_STORAGE_KEY}"`, error);
    }
    return "system";
};

const readSystemTheme = (): ResolvedTheme =>
    window.matchMedia(DARK_MODE_QUERY).matches ? "dark" : "light";

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setThemeState] = useState<ThemeMode>(readStoredTheme);
    const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(readSystemTheme);

    const resolvedTheme: ResolvedTheme =
        theme === "system" ? systemTheme : theme;

    useEffect(() => {
        const mediaQuery = window.matchMedia(DARK_MODE_QUERY);

        const handleSystemChange = (event: MediaQueryListEvent): void => {
            setSystemTheme(event.matches ? "dark" : "light");
        };

        mediaQuery.addEventListener("change", handleSystemChange);
        return () => mediaQuery.removeEventListener("change", handleSystemChange);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    }, [resolvedTheme]);

    const setTheme = useCallback((nextTheme: ThemeMode): void => {
        setThemeState(nextTheme);
        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        } catch (error) {
            console.warn(`ThemeContext: failed to write "${THEME_STORAGE_KEY}"`, error);
        }
    }, []);

    const value = useMemo<ThemeContextValue>(
        () => ({ theme, resolvedTheme, setTheme }),
        [theme, resolvedTheme, setTheme],
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};
