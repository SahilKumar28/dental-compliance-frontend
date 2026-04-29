"use client";

import Header from "@/components/layout/DashboardHeader";
import Sidebar from "@/components/layout/DashboardSidebar";
import { useState } from "react";

type View = "dashboard" | "staff" | "practices";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [activeView, setActiveView] = useState<View>("dashboard");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        // your logout logic here
        console.log("logout");
        setIsLoggingOut(false);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar 
                activeView={activeView} 
                onSelect={setActiveView}
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
                    setIsMobileOpen={setIsMobileOpen} // you'll need this for hamburger menu
                />

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}