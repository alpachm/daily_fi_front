// src/main.tsx
import "./i18n/config"; // Must be imported first to initialize i18next
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AppContextProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import { router } from "./routes";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <AppContextProvider>
                <RouterProvider router={router} />
            </AppContextProvider>
        </ThemeProvider>
    </StrictMode>,
);
