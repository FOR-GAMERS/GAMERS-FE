"use client";

import { useState } from "react";
import { Search, Ban, ShieldAlert, X, Edit, Ghost } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

interface UserManagementViewProps {
    onClose: () => void;
}

const MOCK_USERS = Array.from({ length: 15 }, (_, i) => ({
    id: `U-${1000 + i}`,
    username: `User${i}`,
    email: `user${i}@example.com`,
    discordId: `User${i}#${1000+i}`,
    status: i % 5 === 0 ? "Banned" : i % 5 === 4 ? "Warning" : "Online",
    joinedAt: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
}));

export function UserManagementView({ onClose }: UserManagementViewProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-white/10 rounded-xl w-full max-w-4xl h-[600px] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Ghost className="w-5 h-5 text-neon-cyan" /> User Management
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Toolbar */}
            <div className="p-4 flex gap-4 border-b border-white/5 bg-white/[0.02]">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                        type="text" 
                        placeholder="Search users by name, email, discord ID..." 
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-xs text-neutral-500 uppercase bg-black/20 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 font-medium border-b border-white/5">User</th>
                            <th className="px-6 py-3 font-medium border-b border-white/5">Contact</th>
                            <th className="px-6 py-3 font-medium border-b border-white/5">Status</th>
                            <th className="px-6 py-3 font-medium border-b border-white/5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {MOCK_USERS.map((user: any) => (
                            <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400">
                                            {user.username.substring(0,2)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{user.username}</div>
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
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button className="text-neutral-400 hover:text-white transition-colors" title="Edit">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="text-neutral-400 hover:text-red-500 transition-colors" title="Ban">
                                        <Ban className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-neutral-900/50 flex justify-end">
                <div className="text-xs text-neutral-500">Showing 15 users</div>
            </div>
        </div>
    </div>
  );
}
