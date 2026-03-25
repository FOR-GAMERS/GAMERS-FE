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
    <div className="w-full space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-2 px-2">
          <Bell className="text-neon-cyan animate-pulse" size={18} />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            {t("mypage.invitations.title") || "Pending Invitations"}
          </h3>
          <span className="bg-neon-cyan px-2 py-0.5 rounded-full text-[10px] text-black font-black">
              {invitations.length}
          </span>
      </div>

      <div className="space-y-3">
          {invitations.map((invitation) => (
              <div 
                key={invitation.id}
                className="bg-neon-cyan/5 border border-neon-cyan/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                  <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center text-neon-cyan shrink-0">
                          <UserPlus size={24} />
                      </div>
                      <div className="space-y-1">
                          <p className="text-white font-bold">{invitation.title}</p>
                          <p className="text-sm text-white/60">{invitation.message}</p>
                          <p className="text-[10px] text-white/30 truncate">
                              {formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true, locale: currentLocale })}
                          </p>
                      </div>
                  </div>

                  <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(invitation)}
                        disabled={processingId === invitation.id}
                        className="px-4 py-2 hover:bg-white/5 text-white/40 hover:text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                      >
                          {t("common.reject") || "Reject"}
                      </button>
                      <button
                        onClick={() => handleAccept(invitation)}
                        disabled={processingId === invitation.id}
                        className="px-6 py-2 bg-neon-cyan text-black hover:bg-cyan-300 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] flex items-center gap-2 disabled:opacity-50"
                      >
                          {processingId === invitation.id ? <Loader2 className="animate-spin w-4 h-4" /> : <Check size={16} />}
                          {t("common.accept") || "Accept"}
                      </button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}
