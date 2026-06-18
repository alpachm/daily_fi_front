// src/layouts/DashboardLayout.tsx
import "./styles/DashboardLayout.css";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "@tanstack/react-router";
import { Header } from "../components/layout/Header";
import Navbar from "../components/layout/Navbar";

export const DashboardLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => setIsMenuOpen(true);
    const handleMenuClose = () => setIsMenuOpen(false);

    // Auto-close the drawer on every route change
    const location = useLocation();
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className="dashboard-layout">
            <Header onMenuToggle={handleMenuToggle} />
            <div className="dashboard-layout__body">
                <Navbar isOpen={isMenuOpen} onClose={handleMenuClose} />
                <main className="dashboard-layout__main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
