// src/main.tsx
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AppContextProvider } from "./context/AppContext";
import { router } from "./routes";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppContextProvider>
            <RouterProvider router={router} />
        </AppContextProvider>
    </StrictMode>,
);
