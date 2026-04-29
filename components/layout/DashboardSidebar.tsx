"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation"; // add this
import { ChevronLeft, LogOut, LayoutDashboard, Users, Building2 } from "lucide-react";

interface MenuItem {
  key: string; // change: ab path hoga, View nahi
  label: string;
  icon: React.ElementType;
}

interface SidebarProps {
  // activeView, onSelect hata do
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
  onLogout: () => void | Promise<void>;
  isLoggingOut: boolean;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  onLogout,
  isLoggingOut,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname(); // current URL check karne ke liye

  const menuItems: MenuItem[] = [
    { key: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "/admin/staff", label: "Staff", icon: Users },
    { key: "/admin/practices", label: "Practices", icon: Building2 },
  ];

  const showText =!isCollapsed || isMobileOpen;

  const handleSelect = (path: string) => {
    router.push(path); // page navigate karo
    setIsMobileOpen(false); // mobile menu close
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-gray-800/40 bg-[var(--bg-color)] transition-all duration-300
          ${isMobileOpen? "translate-x-0" : "-translate-x-full"}
          lg:sticky lg:top-0 lg:translate-x-0
          ${isCollapsed? "lg:w-20" : "lg:w-64"}
        `}
      >
        <div className="flex items-center gap-3 p-6">
          <Image
            src="/logo.jpg"
            alt="DCS logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded- object-cover"
          />
          {showText && (
            <span className="text-base font-bold tracking-wide text-[var(--text-color)]">
              Dental Compliance
            </span>
          )}
        </div>

        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.key; // URL se active check karo

            return (
              <button
                key={item.key}
                onClick={() => handleSelect(item.key)}
                className={`
                  group flex w-full items-center gap-3 rounded- px-4 py-3 transition-all
                  ${
                    isActive
                    ? "border border-[var(--text-color)] bg-[var(--text-color)] text-[var(--text-white-color)]"
                      : "text-[var(--text-color)] hover:bg-[var(--text-color)] hover:text-[var(--text-white-color)]"
                  }
                `}
              >
                <Icon size={20} className="shrink-0" />
                {showText && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-gray-800/40 p-4">
          <button
            onClick={onLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded- px-4 py-2 text-red-400 transition-all hover:bg-red-400/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LogOut size={18} className="shrink-0" />
            {showText && (
              <span className="text-sm">
                {isLoggingOut? "Logging out..." : "Logout"}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden w-full items-center gap-3 rounded- px-4 py-2 text-[var(--text-color)] transition-all hover:bg-[var(--text-color)]/10 lg:flex"
          >
            <ChevronLeft
              size={18}
              className={`shrink-0 ${isCollapsed? "rotate-180" : ""} transition-transform`}
            />
            {!isCollapsed && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}