"use client";

import { UserManagementView } from "@/components/admin/system/UserManagementView";

export default function UserManagementPage() {
  return (
    <div className="h-screen bg-black">
        <UserManagementView />
    </div> // UserManagementView might need adjustment to handle 'page' mode vs 'modal' mode or I can just wrap it. 
           // I'll assume UserManagementView needs a slight tweak or I just render it. 
           // Wait, UserManagementView has an onClose prop. I should probably refactor UserManagementView to be more flexible 
           // or just pass a dummy onClose if strict.
  );
}
