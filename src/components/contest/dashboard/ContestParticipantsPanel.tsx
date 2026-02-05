"use client";

import AnimatedSelect from "@/components/ui/AnimatedSelect";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contestService } from "@/services/contest-service";
import { Loader2, Search, Shield, User, Crown } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ContestParticipantsPanelProps {
    contestId: number;
    isLeader: boolean;
}

export default function ContestParticipantsPanel({ contestId, isLeader }: ContestParticipantsPanelProps) {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset page on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading } = useQuery({
        queryKey: ['contest-members', contestId, page, debouncedSearch],
        queryFn: () => contestService.getContestMembers(contestId, { page, page_size: 50, search: debouncedSearch }),
    });

    const members = data?.data?.data || [];
    const totalPages = data?.data?.total_pages || 1;

    const roleMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: number, role: 'NORMAL' | 'STAFF' | 'LEADER' }) => 
            contestService.changeMemberRole(contestId, userId, role),
        onSuccess: () => {
            addToast(t('contestDashboard.participants.toast.roleChangeSuccess'), "success");
            queryClient.invalidateQueries({ queryKey: ['contest-members', contestId] });
        },
        onError: (error: any) => {
            addToast(error.response?.data?.message || t('contestDashboard.participants.toast.roleChangeFail'), "error");
        }
    });

    const filteredMembers = members; // Server-side filtered now

    const getRoleIcon = (role: string) => {
        switch(role) {
            case 'LEADER': return <Crown className="w-4 h-4 text-yellow-500" />;
            case 'STAFF': return <Shield className="w-4 h-4 text-blue-500" />;
            default: return <User className="w-4 h-4 text-neutral-500" />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                 <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-neon-cyan rounded-full"/> 
                        {t('contestDashboard.participants.title')}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1 ml-3">
                        {t('contestDashboard.participants.description')}
                    </p>
                 </div>
                 
                 <div className="relative w-full md:w-64">
                     <input 
                        type="text" 
                        placeholder={t('contestDashboard.participants.searchPlaceholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-neon-cyan transition-colors text-white"
                     />
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                 </div>
             </div>

             <div className="bg-deep-black/50 border border-white/10 rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
                    </div>
                ) : filteredMembers.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        {t('contestDashboard.toast.loadFail')} {/* Fallback or specific empty message */}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('contestDashboard.stats.participants')}</th>
                                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('contestDashboard.participants.role')}</th>
                                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('contestDashboard.participants.points')}</th>
                                    {isLeader && <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">{t('contestDashboard.participants.actions')}</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredMembers.map((member) => (
                                    <tr key={member.user_id} className="group hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                 <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden relative">
                                                    {member.avatar ? (
                                                        <Image src={member.avatar} alt={member.username} fill sizes="32px" className="object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-bold">{member.username.substring(0, 2).toUpperCase()}</span>
                                                    )}
                                                 </div>
                                                 <div>
                                                     <div className="text-white font-medium">{member.username}</div>
                                                     <div className="text-xs text-muted-foreground">#{member.tag}</div>
                                                 </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {getRoleIcon(member.member_type)}
                                                <span className={cn(
                                                    "text-sm font-medium",
                                                    member.member_type === 'LEADER' ? "text-yellow-500" :
                                                    member.member_type === 'STAFF' ? "text-blue-500" : "text-neutral-400"
                                                )}>
                                                    {t(`contestDashboard.participants.roles.${member.member_type}`)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-neon-cyan/80">
                                            {member.point || 0}
                                        </td>
                                        {isLeader && (
                                            <td className="p-4 text-right">
                                                {member.member_type !== 'LEADER' && (
                                                    <div className="w-32 ml-auto">
                                                        <AnimatedSelect
                                                            options={[
                                                                { value: "NORMAL", label: t('contestDashboard.participants.roles.NORMAL') },
                                                                { value: "STAFF", label: t('contestDashboard.participants.roles.STAFF') }
                                                            ]}
                                                            value={member.member_type}
                                                            onChange={(val) => roleMutation.mutate({ userId: member.user_id, role: val as any })}
                                                            disabled={roleMutation.isPending}
                                                            size="sm"
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
             </div>

             {/* Simple Pagination */}
             {totalPages > 1 && (
                 <div className="flex justify-center gap-2">
                     <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded disabled:opacity-50"
                     >
                         Prev
                     </button>
                     <span className="px-3 py-1 text-muted-foreground">{page} / {totalPages}</span>
                     <button 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded disabled:opacity-50"
                     >
                         Next
                     </button>
                 </div>
             )}
        </div>
    );
}
