"use client";

type View = "dashboard" | "staff" | "practices";

interface SidebarProps {
  activeView: View;
  onSelect: (view: View) => void;
}

export default function Sidebar({ activeView, onSelect }: SidebarProps) {
  const menu = [
    { key: "dashboard", label: "Dashboard" },
    { key: "staff", label: "Staff" },
    { key: "practices", label: "Practices" },
  ];

  return (
    <aside className="h-screen w-64 bg-black text-white flex flex-col">
      <div className="p-5 font-bold text-lg border-b border-gray-700">
        Dental Compliance
      </div>

      <nav className="flex-1 p-3 space-y-2">
        {menu.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key as View)}
            className={`w-full text-left px-4 py-2 rounded-md transition ${
              activeView === item.key
                ? "bg-white text-black"
                : "hover:bg-gray-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}