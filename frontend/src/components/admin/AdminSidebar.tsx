"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Gamepad2,
  FolderTree,
  Tags,
  Download,
  Server,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useAdminAuthStore } from "@/store/admin-auth";
import { useState } from "react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/games", label: "Game Management", icon: Gamepad2 },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/downloads", label: "Downloads", icon: Download },
  { href: "/admin/providers", label: "Providers", icon: Server },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAdminAuthStore((s) => s.logout);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${collapsed ? "w-16" : "w-60"} flex flex-col bg-gray-950 text-gray-300 transition-all duration-200 min-h-screen`}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-800">
        {!collapsed && (
          <Link href="/admin" className="text-white font-bold text-sm tracking-wide">
            XIAOBAI ADMIN
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm transition-colors ${isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-800 p-3">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
