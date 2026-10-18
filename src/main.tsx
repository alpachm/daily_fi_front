// src/main.tsx
import "./i18n/config"; // Must be imported first to initialize i18next
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppContextProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import { router } from "./routes";
import { ROUTES } from "./constants/routes";
import { SessionExpiredNotifier } from "./components/shared/SessionExpiredNotifier";
import { SESSION_EXPIRED_EVENT } from "./utils/sessionExpiry";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

// Redirect to /login as soon as the centralized HTTP client reports that the
// stored session has expired.
window.addEventListener(SESSION_EXPIRED_EVENT, () => {
    void router.navigate({ to: ROUTES.LOGIN });
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AppContextProvider>
                    <RouterProvider router={router} />
                    <SessionExpiredNotifier />
                </AppContextProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>,
);
