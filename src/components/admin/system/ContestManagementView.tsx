"use client";

import { useState } from "react";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

const MOCK_CONTESTS = Array.from({ length: 25 }, (_, i) => ({
    id: `C-${1000 + i}`,
    title: `Valorant Championship Season ${i + 1}`,
    organizer: `Organizer ${i % 5}`,
    status: i % 3 === 0 ? "Online" : i % 3 === 1 ? "Playing" : "Offline",
    participants: Math.floor(Math.random() * 100),
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
}));

export function ContestManagementView() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(MOCK_CONTESTS.length / itemsPerPage);

  const paginatedData = MOCK_CONTESTS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex h-full flex-col bg-black p-6">
        <div className="bg-neutral-900 border border-white/10 rounded-xl flex flex-col h-full overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="font-bold text-neutral-300 uppercase tracking-wide flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-neon-cyan" /> Contest Management
                </h3>
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
                            <th className="px-6 py-4 font-medium border-b border-white/5">Contest</th>
                            <th className="px-6 py-4 font-medium border-b border-white/5">Organizer</th>
                            <th className="px-6 py-4 font-medium border-b border-white/5">Status</th>
                            <th className="px-6 py-4 font-medium border-b border-white/5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {paginatedData.map((contest: any) => (
                            <tr key={contest.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white group-hover:text-neon-cyan transition-colors">
                                        {contest.title}
                                    </div>
                                    <div className="text-xs text-neutral-500 font-mono">{contest.createdAt}</div>
                                </td>
                                <td className="px-6 py-4 text-neutral-400">
                                    {contest.organizer}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={contest.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}
