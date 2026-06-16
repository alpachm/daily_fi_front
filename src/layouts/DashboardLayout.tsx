// src/layouts/DashboardLayout.tsx
import "./styles/DashboardLayout.css";
import { Outlet } from "@tanstack/react-router";
import { Header } from "../components/Header";
import Navbar from "../components/Navbar";

export const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">
            <Header />
            <div className="dashboard-layout__body">
                <aside className="dashboard-layout__sidebar">
                    <Navbar />
                </aside>
                <main className="dashboard-layout__main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
