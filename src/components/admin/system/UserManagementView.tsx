"use client";

import { useState } from "react";
import { Search, Ban, Edit, Ghost, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/context/ToastContext";
import { adminUserService } from "@/services/admin-user-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserResponse } from "@/types/api";
import { useTranslation } from "react-i18next";

export function UserManagementView() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ['users', currentPage, search],
    queryFn: () => adminUserService.getUsers({ 
        page: currentPage, 
        page_size: itemsPerPage,
        search 
    }),
  });

  const users = data?.data?.data || [];
  const totalPages = data?.data?.total_pages || 1;
  const totalCount = data?.data?.total_count || 0;

  const deleteMutation = useMutation({
    mutationFn: adminUserService.deleteUser,
    onSuccess: () => {
        addToast(t('admin.userManagement.actions.deleteSuccess'), "success");
        queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
        addToast(t('admin.userManagement.actions.deleteFail'), "error");
    }
  });

  const handleDelete = (id: number, username: string) => {
    if (confirm(t('admin.userManagement.actions.confirmDelete', { username }))) {
        deleteMutation.mutate(id);
    }
  };

  const handleEdit = (username: string) => {
      addToast(t('admin.userManagement.actions.editNotImplemented', { username }), "info");
  };

  return (
    <div className="flex h-full flex-col bg-black p-6">
        <div className="bg-neutral-900 border border-white/10 rounded-xl flex flex-col h-full overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex flex-col md:flex-row items-center justify-between bg-white/[0.02] gap-4">
                <h3 className="font-bold text-neutral-300 uppercase tracking-wide flex items-center gap-2">
                    <Ghost className="w-4 h-4 text-neon-cyan" /> {t('admin.userManagement.title')}
                </h3>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                         <input 
                             type="text" 
                             placeholder={t('admin.userManagement.searchPlaceholder')} 
                             value={search}
                             onChange={(e) => {
                                 setSearch(e.target.value);
                                 setCurrentPage(1);
                             }}
                             className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-neon-cyan/50"
                         />
                    </div>

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
                        <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
                    </div>
                )}
                
                <table className="w-full text-left text-sm">
                    <thead className="text-xs text-neutral-500 uppercase bg-black/20 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 font-medium border-b border-white/5">{t('admin.userManagement.table.user')}</th>
                            <th className="px-6 py-4 font-medium border-b border-white/5">{t('admin.userManagement.table.contact')}</th>
                            <th className="px-6 py-4 font-medium border-b border-white/5">{t('admin.userManagement.table.role')}</th>
                            <th className="px-6 py-4 font-medium border-b border-white/5 text-right">{t('admin.userManagement.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user: UserResponse) => (
                            <tr key={user.user_id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400 overflow-hidden">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                            ) : (
                                                user.username.substring(0,2).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-neon-cyan transition-colors">{user.username}</div>
                                            <div className="text-xs text-neutral-500">{t('admin.userManagement.table.tag')}: {user.tag}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-neutral-300">{user.email}</div>
                                    <div className="text-xs text-neutral-500 font-mono">{t('admin.userManagement.table.id')}: {user.user_id}</div>
                                </td>
                                <td className="px-6 py-4">
                                     <StatusBadge status={user.role || 'USER'} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(user.username)}
                                            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title={t('admin.userManagement.actions.edit') || "Edit"}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(user.user_id, user.username)}
                                            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title={t('admin.userManagement.actions.delete') || "Delete"}
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
                <div className="text-xs text-neutral-500">{t('admin.userManagement.table.showing', { count: users.length, total: totalCount })}</div>
            </div>
        </div>
    </div>
  );
}
