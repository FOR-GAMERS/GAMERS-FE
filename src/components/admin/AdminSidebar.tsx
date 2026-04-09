"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  AlertTriangle, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    {
      id: 'dashboard',
      label: t('admin.sidebar.dashboard'),
      icon: LayoutDashboard,
      href: '/admin/dashboard',
    },
    {
      id: 'members',
      label: t('admin.sidebar.members'),
      icon: Users,
      href: '/admin/members',
      badge: '2,841'
    },
    {
      id: 'contests',
      label: t('admin.sidebar.contests'),
      icon: Trophy,
      href: '/admin/contests',
    },
    {
      id: 'reports',
      label: t('admin.sidebar.reports'),
      icon: AlertTriangle,
      href: '/admin/reports',
      badge: '12'
    },
    {
      id: 'settings',
      label: t('admin.sidebar.settings'),
      icon: Settings,
      href: '/admin/settings',
    }
  ];

  return (
    <aside className="w-[280px] h-screen bg-[#0C0C0F] border-r border-white/5 flex flex-col glass-card shrink-0">
      {/* Logo Section */}
      <div className="p-8 pb-10">
        <Link href="/admin/members" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-neon-cyan rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,212,122,0.2)] group-hover:scale-110 transition-transform duration-300">
            <span className="text-xl font-black text-black font-outfit">G</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-white font-outfit tracking-tighter uppercase leading-tight">
              GAMERS
            </span>
            <span className="text-[10px] font-bold text-neon-cyan font-outfit uppercase tracking-widest leading-none">
              {t('admin.sidebar.console')}
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-white/5 text-neon-cyan shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" 
                  : "text-[#7A7A85] hover:text-white hover:bg-white/[0.02]"
              )}
            >
              <div className="flex items-center gap-3.5">
                <Icon className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  isActive ? "text-neon-cyan" : "group-hover:text-white"
                )} />
                <span className="text-sm font-semibold tracking-tight">
                  {item.label}
                </span>
              </div>
              
              {item.badge ? (
                <div className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tighter",
                  isActive 
                    ? "bg-neon-cyan text-black" 
                    : "bg-white/5 text-[#7A7A85] group-hover:text-white"
                )}>
                  {item.badge}
                </div>
              ) : (
                isActive && <ChevronRight className="w-4 h-4 text-neon-cyan" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section (Bottom) */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white font-bold shadow-lg shadow-neon-purple/20">
              A
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-neon-cyan rounded-full border-2 border-[#0C0C0F]" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-white truncate">super_admin</span>
            <span className="text-[10px] font-medium text-[#7A7A85] uppercase tracking-widest leading-none mt-0.5">
              {t('admin.member.table.role_labels.staff')}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
