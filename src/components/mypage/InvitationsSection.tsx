'use client';

import { useNotifications } from '@/hooks/use-notifications';
import { contestService } from '@/services/contest-service';
import { Loader2, Mail, Check, X, Bell, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/context/ToastContext';
import { useState } from 'react';
import { NotificationType } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS, ja } from 'date-fns/locale';

export default function InvitationsSection() {
  const { t, i18n } = useTranslation();
  const { notifications, refetch, markAsRead } = useNotifications(true);
  const { addToast } = useToast();
  const [processingId, setProcessingId] = useState<number | null>(null);

  const locales: Record<string, any> = { ko, en: enUS, ja };
  const currentLocale = locales[i18n.language] || ko;

  const invitations = notifications.filter(n => n.type === NotificationType.TEAM_INVITE_RECEIVED);

  const handleAccept = async (notification: any) => {
    const contestId = notification.data?.contest_id;
    if (!contestId) return;

    setProcessingId(notification.id);
    try {
      await contestService.acceptInvite(contestId, ''); // Token logic might be needed if backend requires it
      addToast(t("mypage.invitations.toast.accepted") || "Invitation accepted", 'success');
      await markAsRead(notification.id);
      refetch();
    } catch (error: any) {
      addToast(error.message || t("mypage.invitations.toast.failed") || "Failed to accept invitation", 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (notification: any) => {
    setProcessingId(notification.id);
    try {
      // In this system, reject might just be marking the notification as read or a specific API
      await markAsRead(notification.id);
      addToast(t("mypage.invitations.toast.rejected") || "Invitation rejected", 'info');
      refetch();
    } catch (error: any) {
      addToast(error.message || "Failed to reject", 'error');
    } finally {
      setProcessingId(null);
    }
  };

  if (invitations.length === 0) return null;

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-neon-cyan/10 rounded-lg">
            <Bell className="text-neon-cyan animate-pulse" size={18} />
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] ml-1">
            {t("mypage.invitations.title") || "Pending Invitations"}
          </h3>
          <span className="bg-neon-cyan px-2.5 py-1 rounded-full text-[10px] text-black font-black shadow-[0_0_10px_rgba(0,243,255,0.4)]">
              {invitations.length}
          </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
          {invitations.map((invitation) => (
              <div 
                key={invitation.id}
                className="group relative glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:translate-x-2 transition-all duration-300 border-l-4 border-l-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.05)] hover:shadow-[0_0_30px_rgba(0,243,255,0.1)]"
              >
                  <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan shrink-0 border border-neon-cyan/20 group-hover:scale-110 transition-transform">
                          <UserPlus size={28} />
                      </div>
                      <div className="space-y-1">
                          <p className="text-white font-black text-lg tracking-tight">{invitation.title}</p>
                          <p className="text-sm text-white/50 font-medium leading-relaxed">{invitation.message}</p>
                          <p className="text-[10px] text-white/20 font-black uppercase tracking-widest pt-1 flex items-center gap-1">
                              <Loader2 size={10} className="animate-spin opacity-20" />
                              {formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true, locale: currentLocale })}
                          </p>
                      </div>
                  </div>

                  <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReject(invitation)}
                        disabled={processingId === invitation.id}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest border border-white/5 transition-all disabled:opacity-50 active:scale-95"
                      >
                          {t("common.reject") || "Reject"}
                      </button>
                      <button
                        onClick={() => handleAccept(invitation)}
                        disabled={processingId === invitation.id}
                        className="flex-1 md:flex-none px-8 py-2.5 bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan hover:text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 border border-neon-cyan/30"
                      >
                          {processingId === invitation.id ? <Loader2 className="animate-spin w-4 h-4" /> : <Check size={18} />}
                          {t("common.accept") || "Accept"}
                      </button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}
