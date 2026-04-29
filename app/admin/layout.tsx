"use client";
import Header from "@/components/layout/DashboardHeader";
import Sidebar from "@/components/layout/DashboardSidebar";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        // logout logic
        setIsLoggingOut(false);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
                onLogout={handleLogout}
                isLoggingOut={isLoggingOut}
            />
            <div className="flex-1">
                <Header
                    onLogout={handleLogout}
                    setIsMobileOpen={setIsMobileOpen}
                />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}