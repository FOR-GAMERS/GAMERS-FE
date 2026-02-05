"use client";

import { useState } from "react";
import { Search, Trophy, Edit, Trash2, Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { adminContestService } from "@/services/admin-contest-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContestResponse } from "@/types/api";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge"; // Reusing or need to create specific badge?
import Image from "next/image";

export default function ContestManagementPage() {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [search, setSearch] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ['admin-contests', currentPage, search],
        queryFn: () => adminContestService.getContests({
            page: currentPage,
            page_size: itemsPerPage,
            title: search,
            sort_by: 'created_at',
            order: 'desc'
        }),
    });

    const contests = data?.data?.data || [];
    const totalPages = data?.data?.total_pages || 1;
    const totalCount = data?.data?.total_count || 0;

    const deleteMutation = useMutation({
        mutationFn: adminContestService.deleteContest,
        onSuccess: () => {
            addToast("Contest deleted successfully", "success");
            queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
        },
        onError: () => {
            addToast("Failed to delete contest", "error");
        }
    });

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Are you sure you want to delete contest "${title}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="flex h-full flex-col bg-black p-6">
            <div className="bg-neutral-900 border border-white/10 rounded-xl flex flex-col h-full overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex flex-col md:flex-row items-center justify-between bg-white/[0.02] gap-4">
                    <h3 className="font-bold text-neutral-300 uppercase tracking-wide flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-emerald-500" /> Contest Management
                    </h3>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                            <input
                                type="text"
                                placeholder="Search contests..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>

                         <Link
                            href="/admin/contests/create" // Assuming create page exists or will be created
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Create Contest
                        </Link>

                        <div className="flex gap-2 text-white">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-mono text-neutral-500 py-1.5">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto relative">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        </div>
                    )}

                    <table className="w-full text-left text-sm">
                        <thead className="text-xs text-neutral-500 uppercase bg-black/20 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 font-medium border-b border-white/5">Contest</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5">Type</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5">Status</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5">Participants</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {contests.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                                        No contests found.
                                    </td>
                                </tr>
                            )}
                            {contests.map((contest: ContestResponse) => (
                                <tr key={contest.contest_id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {contest.thumbnail && (
                                                <div className="w-8 h-8 rounded overflow-hidden relative bg-neutral-800">
                                                    <Image src={contest.thumbnail} alt={contest.title} fill className="object-cover" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-white group-hover:text-emerald-500 transition-colors">{contest.title}</div>
                                                <div className="text-xs text-neutral-500">ID: {contest.contest_id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-neutral-300 capitalize">{contest.contest_type.toLowerCase()}</div>
                                        <div className="text-xs text-neutral-500">{contest.game_type}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                         <StatusBadge status={contest.contest_status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-neutral-300">{contest.current_team_count || 0} / {contest.max_team_count} Teams</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/contests/${contest.contest_id}/edit`} // Placeholder edit link
                                                className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(contest.contest_id, contest.title)}
                                                className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
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
                    <div className="text-xs text-neutral-500">Showing {contests.length} of {totalCount} contests</div>
                </div>
            </div>
        </div>
    );
}
