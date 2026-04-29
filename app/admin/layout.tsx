"use client";

import Header from "@/components/layout/DashboardHeader";
import Sidebar from "@/components/layout/DashboardSidebar";
import { useState } from "react";

type View = "dashboard" | "staff" | "practices";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [activeView, setActiveView] = useState<View>("dashboard");

    return (
        <div className="flex">
            <Sidebar activeView={activeView} onSelect={setActiveView} />

            <div className="flex-1">
                <Header onLogout={() => console.log("logout")} />

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}