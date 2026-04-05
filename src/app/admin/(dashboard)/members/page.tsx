import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MemberTable } from '@/components/admin/MemberTable';

export default function AdminMembersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="p-10">
        <MemberTable />
      </div>
    </div>
  );
}
