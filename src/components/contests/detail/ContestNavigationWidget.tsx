"use client";

import Link from "next/link";
import { LayoutDashboard, Users, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ContestNavigationWidgetProps {
    contestId: number;
    userStatus: any; // Using any for flexibility based on API response structure
}

export default function ContestNavigationWidget({ contestId, userStatus }: ContestNavigationWidgetProps) {
    const { t } = useTranslation();

    if (!userStatus) return null;

    const { is_leader, member_type, is_member } = userStatus;
    const isStaff = member_type === 'STAFF';
    const isLeader = is_leader || member_type === 'LEADER';
    
    // Logic for displaying the widget
    // 1. Leader/Staff -> Go to Dashboard
    if (isLeader || isStaff) {
        return (
            <div className="container mx-auto px-4 pt-6">
                <Link 
                    href={`/contests/${contestId}/dashboard`}
                    className="group block relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 hover:border-indigo-500/50 transition-all p-4"
                >
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/30 transition-colors">
                                <LayoutDashboard size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                                    {t('contestDetail.navigation.dashboardTitle', 'Contest Dashboard')}
                                </h3>
                                <p className="text-sm text-indigo-300/80">
                                    {t('contestDetail.navigation.dashboardDesc', 'Manage participants, matches, and settings')}
                                </p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:translate-x-1 transition-transform">
                            <ChevronRight size={18} />
                        </div>
                    </div>
                </Link>
            </div>
        );
    }

    // 2. Participating Member -> Show Status (Routing to same page as per request, acting as status badge)
    if (is_member) {
        return (
             <div className="container mx-auto px-4 pt-6">
                <div 
                    className="block relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 p-4"
                >
                    <div className="flex items-center gap-4 relative z-10">
                         <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    {t('contestDetail.navigation.participatingTitle', 'You are participating')}
                                </h3>
                                <p className="text-sm text-emerald-300/80">
                                    {t('contestDetail.navigation.participatingDesc', 'Good luck in the contest!')}
                                </p>
                            </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
