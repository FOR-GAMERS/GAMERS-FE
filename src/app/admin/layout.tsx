"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
        <AdminSidebar mode="system" />
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
            {children}
        </main>
    </div>
  );
}
