"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const { user, activePortal, setActivePortal } = useAuthStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-primary h-14 flex items-center justify-between px-6 text-white border-b border-gray-700">

      {/* LEFT */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="font-semibold bg-gray-800 px-3 py-1 rounded-md"
        >
          Role ⌄
        </button>

        {open && (
          <div className="absolute mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
            {user?.roles.map((role) => (
              <div
                key={role.role_id}
                onClick={() => {
                  // setActivePortal(role.role_name);
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