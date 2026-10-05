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

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AppContextProvider>
                    <RouterProvider router={router} />
                </AppContextProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>,
);
