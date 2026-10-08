// src/routes.tsx — Route configuration with clean, semantic paths and auth guards
import { createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";

import LoginScreen from "./screens/LoginScreen";
import { SignupScreen } from "./screens/SignupScreen";
import DashboardLayout from "./layouts/DashboardLayout";
import BalanceScreen from "./screens/_authenticated/BalanceScreen";
import DetailsScreen from "./screens/_authenticated/DetailsScreen";
import ProfileScreen from "./screens/_authenticated/ProfileScreen";
import ReceiptsScreen from "./screens/_authenticated/ReceiptsScreen";
import { ROUTES } from "./constants/routes";
import { isAuthenticated } from "./utils/auth";

// ---- Root ----
const rootRoute = createRootRoute();

// ---- Public routes (no layout) ----
export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: ROUTES.LOGIN,
    component: LoginScreen,
    beforeLoad: async () => {
        if (isAuthenticated()) {
            throw redirect({ to: ROUTES.BALANCE });
        }
    },
});

export const signupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: ROUTES.SIGNUP,
    component: SignupScreen,
    beforeLoad: async () => {
        if (isAuthenticated()) {
            throw redirect({ to: ROUTES.BALANCE });
        }
    },
});

// ---- Protected layout route (pathless guard) ----
// Wraps every private route and enforces authentication via `beforeLoad`.
export const authenticatedRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: "_authenticated",
    beforeLoad: async () => {
        if (!isAuthenticated()) {
            throw redirect({ to: ROUTES.LOGIN });
        }
    },
});

// ---- Private layout route (pathless, renders the dashboard shell) ----
export const dashboardRoute = createRoute({
    getParentRoute: () => authenticatedRoute,
    id: "dashboardLayout",
    component: DashboardLayout,
});

// ---- Private child routes (clean, un-prefixed paths) ----
export const balanceIndexRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: ROUTES.ROOT,
    component: BalanceScreen,
});

export const balanceRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: ROUTES.BALANCE,
    component: BalanceScreen,
});

export const detailsRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: ROUTES.DETAILS,
    component: DetailsScreen,
});

export const receiptsRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: ROUTES.RECEIPTS,
    component: ReceiptsScreen,
});

export const profileRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: ROUTES.PROFILE,
    component: ProfileScreen,
});

// ---- Route tree ----
const routeTree = rootRoute.addChildren([
    loginRoute,
    signupRoute,
    authenticatedRoute.addChildren([
        dashboardRoute.addChildren([
            balanceIndexRoute,
            balanceRoute,
            detailsRoute,
            receiptsRoute,
            profileRoute,
        ]),
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
