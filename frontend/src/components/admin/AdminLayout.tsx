"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Toaster } from "@/components/admin/Toaster";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-sm font-medium text-gray-600">Admin Panel</h1>
          <span className="text-xs text-gray-400">v0.8.0</span>
        </header>
        {/* Page content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
