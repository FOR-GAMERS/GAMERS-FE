
import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Info, Trophy, UserPlus, Users, ClipboardList } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { NotificationResponse, NotificationType } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS, ja } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';

interface NotificationDropdownProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isLoggedIn: boolean;
}

export default function NotificationDropdown({ isOpen, setIsOpen, isLoggedIn }: NotificationDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(isLoggedIn);
  const { t, i18n } = useTranslation();

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Animation
  useEffect(() => {
    if (isOpen && containerRef.current) {
        gsap.fromTo(containerRef.current,
            { y: 10, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.2, ease: "power2.out", display: "block" }
        );
    } else if (containerRef.current) {
        gsap.to(containerRef.current,
            { y: 10, opacity: 0, scale: 0.95, duration: 0.2, ease: "power2.in", display: "none" }
        );
    }
  }, [isOpen]);

  const getIcon = (type: NotificationType) => {
    switch (type) {
        case NotificationType.TEAM_INVITE_RECEIVED:
            return <UserPlus size={16} className="text-neon-cyan" />;
        case NotificationType.TEAM_INVITE_ACCEPTED:
            return <Users size={16} className="text-green-400" />;
        case NotificationType.TEAM_INVITE_REJECTED:
            return <X size={16} className="text-red-400" />;
        case NotificationType.APPLICATION_ACCEPTED:
            return <Trophy size={16} className="text-yellow-400" />;
        case NotificationType.APPLICATION_REJECTED:
            return <ClipboardList size={16} className="text-red-400" />;
        default:
            return <Info size={16} className="text-blue-400" />;
    }
  };

  const getLocalizedMessage = (notif: NotificationResponse) => {
      // Use i18n key based on type if available in translation file
      const key = `navbar.notifications.types.${notif.type}`;
      
      // We pass the entire data object as values for interpolation.
      // E.g. { sender: "Alice", team: "Alpha", contest: "Cyber League" }
      // This assumes backend sends these keys in `notif.data`.
      // If `notif.data` is missing or keys don't match, we fallback to `notif.message`.
      const translated = t(key, notif.data || {});
      
      // If the key doesn't exist (returns the key itself), fallback to the message from backend
      if (translated === key) return notif.message;
      return translated;
  };

  const getDateLocale = () => {
      switch (i18n.language) {
          case 'ko': return ko;
          case 'ja': return ja;
          default: return enUS;
      }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white/5 rounded-full transition-colors relative group"
      >
        <Bell className={cn("w-5 h-5 transition-colors", isOpen ? "text-neon-cyan" : "text-muted-foreground group-hover:text-white")} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
        )}
      </button>

      <div 
        ref={containerRef}
        className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl overflow-hidden hidden origin-top-right z-50"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20">
            <h3 className="font-bold text-white text-sm">{t('navbar.notifications.title')}</h3>
            {unreadCount > 0 && (
                <button 
                    onClick={markAllAsRead}
                    className="text-xs text-neon-cyan hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                    <Check size={12} />
                    {t('navbar.notifications.markAllRead')}
                </button>
            )}
        </div>

        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                    {t('navbar.notifications.empty')}
                </div>
            ) : (
                <div className="divide-y divide-white/5">
                    {notifications.map((notif) => (
                        <div 
                            key={notif.id}
                            onClick={() => !notif.is_read && markAsRead(notif.id)}
                            className={cn(
                                "p-4 hover:bg-white/5 transition-colors cursor-pointer group relative",
                                !notif.is_read ? "bg-white/[0.02]" : "opacity-70"
                            )}
                        >
                            {!notif.is_read && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-cyan" />
                            )}
                            <div className="flex gap-3">
                                <div className="mt-1 p-2 rounded-full bg-white/5 h-fit">
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h4 className={cn("text-sm font-semibold leading-none", !notif.is_read ? "text-white" : "text-neutral-400")}>
                                        {notif.title}
                                    </h4>
                                    <p className="text-xs text-neutral-400 line-clamp-2">
                                        {getLocalizedMessage(notif) as string}
                                    </p>
                                    <p className="text-[10px] text-neutral-500 font-mono pt-1">
                                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: getDateLocale() })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
