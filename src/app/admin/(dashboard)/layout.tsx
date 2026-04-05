import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0C0C0F] text-[#EEEEF0] overflow-hidden font-pretendard">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0C0C0F] overflow-y-auto custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
