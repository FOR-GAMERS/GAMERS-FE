"use client";

import { useState } from "react";
import { Search, Ban, Edit, Ghost, ChevronLeft, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/context/ToastContext";

const MOCK_USERS = Array.from({ length: 45 }, (_, i) => ({
    id: `U-${1000 + i}`,
    username: `User${i}`,
    email: `user${i}@example.com`,
    discordId: `User${i}#${1000+i}`,
    status: i % 5 === 0 ? "Banned" : i % 5 === 4 ? "Warning" : "Online",
    joinedAt: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
}));

export function UserManagementView() {
  const { addToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(MOCK_USERS.length / itemsPerPage);

  const paginatedData = MOCK_USERS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: string, username: string) => {
    if (confirm(`Are you sure you want to ban/delete user ${username}?`)) {
        addToast(`User ${username} has been deleted/banned.`, "success");
    }
  };

  const handleEdit = (username: string) => {
      addToast(`Editing user ${username} is not implemented yet.`, "info");
  };

  return (
    <div className="flex h-full flex-col bg-black p-6">
        <div className="bg-neutral-900 border border-white/10 rounded-xl flex flex-col h-full overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="font-bold text-neutral-300 uppercase tracking-wide flex items-center gap-2">
                    <Ghost className="w-4 h-4 text-neon-cyan" /> User Management
                </h3>
                
                {/* Search Bar - Optional, but keeping it as it was in original UserManagementView */}
                <div className="hidden md:flex relative w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                     <input 
                         type="text" 
                         placeholder="Search users..." 
                         className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-neon-cyan/50"
                     />
                </div>

                <div className="flex gap-2">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                    <span className="text-sm font-mono text-neutral-500 py-1.5">
                        {currentPage} / {totalPages}
                    </span>
                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-xs text-neutral-500 uppercase bg-black/20 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 font-medium border-b border-white/5">User</th>
                            <th className="px-6 py-4 font-medium border-b border-white/5">Contact</th>
                            <th className="px-6 py-4 font-medium border-b border-white/5">Status</th>
                            <th className="px-6 py-4 font-medium border-b border-white/5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {paginatedData.map((user: any) => (
                            <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400">
                                            {user.username.substring(0,2)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-neon-cyan transition-colors">{user.username}</div>
                                            <div className="text-xs text-neutral-500">{user.joinedAt}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-neutral-300">{user.email}</div>
                                    <div className="text-xs text-neutral-500 font-mono">{user.discordId}</div>
                                </td>
                                <td className="px-6 py-4">
                                     <StatusBadge status={user.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(user.username)}
                                            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(user.id, user.username)}
                                            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Ban/Delete"
                                        >
                                            <Ban className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-neutral-900/50 flex justify-end">
                <div className="text-xs text-neutral-500">Showing {paginatedData.length} of {MOCK_USERS.length} users</div>
            </div>
        </div>
    </div>
  );
}
