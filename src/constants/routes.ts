// src/constants/routes.ts
export const ROUTES = {
    ROOT: "/",
    LOGIN: "/login",
    SIGNUP: "/signup",
    BALANCE: "/balance",
    DETAILS: "/details",
    RECEIPTS: "/receipts",
    PROFILE: "/profile",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];