// src/routes.tsx — Configuración de rutas por código (code-based routing)
import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";

import LoginScreen from "./screens/LoginScreen";
import BalanceScreen from "./screens/BalanceScreen";
import DetailsScreen from "./screens/DetailsScreen";
import ProfileScreen from "./screens/ProfileScreen";

export const ROUTES = {
    LOGIN: "/",
    BALANCE: "/balance",
    DETAILS: "/about",
    PROFILE: "/profile",
};

const rootRoute = createRootRoute();

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: ROUTES.LOGIN,
    component: LoginScreen,
});

export const balanceRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: ROUTES.BALANCE,
    component: BalanceScreen,
});

export const detailsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: ROUTES.DETAILS,
    component: DetailsScreen,
});

export const profileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: ROUTES.PROFILE,
    component: ProfileScreen,
});

// ---- Árbol de rutas ----
const routeTree = rootRoute.addChildren([loginRoute, balanceRoute, detailsRoute, profileRoute]);

// ---- Router ----
export const router = createRouter({ routeTree });

// ---- Type Registration ----
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
