import Link from "next/link";
import { LayoutDashboard, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ContestNavigationLinksProps {
    contestId: number;
    userStatus: any;
}

export default function ContestNavigationLinks({ contestId, userStatus }: ContestNavigationLinksProps) {
    const { t } = useTranslation();

    if (!userStatus?.is_member && userStatus?.application_status !== 'ACCEPTED') return null;

    const { member_type, is_leader } = userStatus;
    const isStaff = member_type === 'STAFF';
    const isLeader = is_leader || member_type === 'LEADER';

    return (
        <div className="flex flex-col gap-3 mt-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Playground Link - Visible to all members */}
            <Link 
                href={`/contest/${contestId}`}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 hover:border-emerald-500/50 transition-all p-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/30 transition-colors">
                        <Trophy size={20} />
                    </div>
                    <span className="font-bold text-white group-hover:text-emerald-200 transition-colors">
                        {t('contestCTA.button.playground')}
                    </span>
                </div>
            </Link>

            {/* Dashboard Link - Visible to Staff/Leader */}
            {(isLeader || isStaff) && (
                <Link 
                    href={`/contests/${contestId}/dashboard`}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 hover:border-indigo-500/50 transition-all p-4 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
                            <LayoutDashboard size={20} />
                        </div>
                        <span className="font-bold text-white group-hover:text-indigo-200 transition-colors">
                           {t('contestCTA.button.dashboard')}
                        </span>
                    </div>
                </Link>
            )}
        </div>
    );
}
