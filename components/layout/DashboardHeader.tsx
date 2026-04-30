"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Menu } from "lucide-react";

interface HeaderProps {
  onLogout: () => void;
  setIsMobileOpen: (value: boolean) => void; // add this
}

export default function Header({ onLogout, setIsMobileOpen }: HeaderProps) {
  const { user, activePortalDetails, setActivePortalDetails } = useAuthStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-primary h-14 flex items-center justify-between px-6 text-white border-b border-gray-700">
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="p-2 text-gray-400 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="font-semibold bg-gray-800 px-3 py-1 rounded-md"
        >
          {activePortalDetails?.active_role_name} ⌄
        </button>

        {open && (
          <div className="absolute mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
            {user?.roles.map((role) => (
              <div
                key={role.role_id}
                onClick={() => {
                  setActivePortalDetails({ actice_role_id: role.role_id, active_role_name: role.role_name, portal: role.portal, active_practice_id: role.practice_id, active_color_theme: role.color_theme });
                  setOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                {role.role_name} {role.role_name === 'admin' ? '' : `(${role.practice_name})`}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <button
        onClick={onLogout}
        className="px-3 py-1 bg-red-500 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
}

//{active_role_id: role.role_id, active_role}