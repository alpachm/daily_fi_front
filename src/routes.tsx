// src/routes.tsx — Nested route configuration with DashboardLayout
import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import DashboardLayout from "./layouts/DashboardLayout";
import BalanceScreen from "./screens/BalanceScreen";
import DetailsScreen from "./screens/DetailsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { DASHBOARD_ROUTES, ROUTES } from "./constants/routes";

// ---- Root ----
const rootRoute = createRootRoute();

// ---- Public routes (no layout) ----
export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: ROUTES.LOGIN,
    component: LoginScreen,
});

export const signupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: ROUTES.SIGNUP,
    component: SignupScreen,
});

// ---- Authenticated layout route ----
export const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: DASHBOARD_ROUTES.DASHBOARD,
    component: DashboardLayout,
});

// ---- Dashboard child routes ----
export const balanceIndexRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: DASHBOARD_ROUTES.BALANCE,
    component: BalanceScreen,
});

export const detailsRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: DASHBOARD_ROUTES.DETAILS,
    component: DetailsScreen,
});

export const profileRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: DASHBOARD_ROUTES.PROFILE,
    component: ProfileScreen,
});

// ---- Route tree ----
const routeTree = rootRoute.addChildren([
    loginRoute,
    signupRoute,
    dashboardRoute.addChildren([balanceIndexRoute, detailsRoute, profileRoute]),
]);

// ---- Router ----
export const router = createRouter({ routeTree });

// ---- Type Registration ----
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
