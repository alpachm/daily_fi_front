// src/routes.tsx — Nested route configuration with protected layout route
import { createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import DashboardLayout from "./layouts/DashboardLayout";
import BalanceScreen from "./screens/_authenticated/BalanceScreen";
import DetailsScreen from "./screens/_authenticated/DetailsScreen";
import ProfileScreen from "./screens/_authenticated/ProfileScreen";
import ReceiptsScreen from "./screens/_authenticated/ReceiptsScreen";
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

// ---- Protected layout route (pathless guard) ----
// Wraps every private route and enforces authentication via `beforeLoad`.
export const authenticatedRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: "_authenticated",
    beforeLoad: async () => {
        // Mock authentication flag for development
        const isAuthenticated = true; // Toggle to false to test redirect to signup

        if (!isAuthenticated) {
            throw redirect({
                to: ROUTES.SIGNUP,
            });
        }
    },
});

// ---- Dashboard layout route (private) ----
export const dashboardRoute = createRoute({
    getParentRoute: () => authenticatedRoute,
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

export const receiptsRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: DASHBOARD_ROUTES.RECEIPTS,
    component: ReceiptsScreen,
});

// ---- Route tree ----
const routeTree = rootRoute.addChildren([
    loginRoute,
    signupRoute,
    authenticatedRoute.addChildren([
        dashboardRoute.addChildren([balanceIndexRoute, detailsRoute, receiptsRoute, profileRoute]),
    ]),
]);

// ---- Router ----
export const router = createRouter({ routeTree });

// ---- Type Registration ----
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
