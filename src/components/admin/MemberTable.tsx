"use client";

import React, { useState, useMemo } from 'react';
import { 
  Edit3, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  User as UserIcon,
  Search,
  Download,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis } from '@/components/ui/pagination';
import { useTranslation, Trans } from 'react-i18next';

type Role = 'STAFF' | 'USER' | 'MANAGER';
type Status = 'ACTIVE' | 'BANNED' | 'WARNING';

interface Member {
  id: string;
  nickname: string;
  tag: string;
  email: string;
  role: Role;
  status: Status;
  joinDate: string;
  lastActive: string;
  avatarColor: string;
}

const mockMembers: Member[] = [
  {
    id: '1',
    nickname: '강민준',
    tag: '#KR1',
    email: 'minjun#KR1',
    role: 'STAFF',
    status: 'ACTIVE',
    joinDate: '2024.08.14',
    lastActive: 'just_now',
    avatarColor: 'bg-blue-600',
  },
  {
    id: '2',
    nickname: '이서연',
    tag: '#0521',
    email: 'seoyeon#0521',
    role: 'USER',
    status: 'BANNED',
    joinDate: '2024.11.02',
    lastActive: '3_days_ago',
    avatarColor: 'bg-gray-600',
  },
  {
    id: '3',
    nickname: '박도현',
    tag: '#PRO',
    email: 'dohyun#PRO',
    role: 'MANAGER',
    status: 'ACTIVE',
    joinDate: '2024.03.27',
    lastActive: '1_hour_ago',
    avatarColor: 'bg-emerald-600',
  },
  {
    id: '4',
    nickname: '김지우',
    tag: '#KR2',
    email: 'jiwoo#KR2',
    role: 'USER',
    status: 'ACTIVE',
    joinDate: '2025.01.09',
    lastActive: '5_mins_ago',
    avatarColor: 'bg-orange-600',
  },
  {
    id: '5',
    nickname: '최예린',
    tag: '#ACE',
    email: 'yerin#ACE',
    role: 'STAFF',
    status: 'ACTIVE',
    joinDate: '2024.06.18',
    lastActive: '32_mins_ago',
    avatarColor: 'bg-indigo-600',
  },
  {
    id: '6',
    nickname: '윤성호',
    tag: '#0924',
    email: 'sungho#0924',
    role: 'USER',
    status: 'WARNING',
    joinDate: '2025.02.14',
    lastActive: '2_days_ago',
    avatarColor: 'bg-slate-600',
  },
];

export function MemberTable() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const tabs = useMemo(() => [
    { id: 'all', label: t('admin.member.tabs.all') },
    { id: 'active', label: t('admin.member.tabs.active') },
    { id: 'banned', label: t('admin.member.tabs.banned') },
    { id: 'staff', label: t('admin.member.tabs.staff') },
    { id: 'new', label: t('admin.member.tabs.new') },
  ], [t]);

  const toggleSelectAll = () => {
    if (selectedMembers.length === mockMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(mockMembers.map(m => m.id));
    }
  };

  const toggleSelectMember = (id: string) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'STAFF':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
            {t('admin.member.table.role_labels.staff')}
          </span>
        );
      case 'MANAGER':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neon-amber/10 text-neon-amber border border-neon-amber/20">
            {t('admin.member.table.role_labels.manager')}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 text-[#7A7A85] border border-white/10">
            {t('admin.member.table.role_labels.user')}
          </span>
        );
    }
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-mint shadow-[0_0_8px_rgba(0,212,122,0.4)]" />
            <span className="text-sm font-semibold text-neon-mint tracking-tight">{t('admin.member.status.active')}</span>
          </div>
        );
      case 'BANNED':
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-red shadow-[0_0_8px_rgba(224,92,92,0.4)]" />
            <span className="text-sm font-semibold text-neon-red tracking-tight">{t('admin.member.status.banned')}</span>
          </div>
        );
      case 'WARNING':
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-amber shadow-[0_0_8px_rgba(255,183,0,0.4)]" />
            <span className="text-sm font-semibold text-neon-amber tracking-tight">{t('admin.member.status.warning')}</span>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-4 text-sm font-bold transition-all duration-300 relative",
              activeTab === tab.id 
                ? "text-neon-cyan" 
                : "text-[#7A7A85] hover:text-white"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-neon-cyan shadow-[0_0_15px_rgba(0,212,122,0.6)] rounded-t-full mt-auto" />
            )}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-[#0C0C0F] border border-white/5 rounded-2xl overflow-hidden glass-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-5 w-[60px]">
                <input 
                  type="checkbox" 
                  checked={selectedMembers.length === mockMembers.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-neon-cyan focus:ring-neon-cyan/30"
                />
              </th>
              <th className="px-6 py-5 text-xs font-bold text-[#7A7A85] uppercase tracking-widest">{t('admin.member.table.user')}</th>
              <th className="px-6 py-5 text-xs font-bold text-[#7A7A85] uppercase tracking-widest">{t('admin.member.table.role')}</th>
              <th className="px-6 py-5 text-xs font-bold text-[#7A7A85] uppercase tracking-widest">{t('admin.member.table.status')}</th>
              <th className="px-6 py-5 text-xs font-bold text-[#7A7A85] uppercase tracking-widest">{t('admin.member.table.join_date')}</th>
              <th className="px-6 py-5 text-xs font-bold text-[#7A7A85] uppercase tracking-widest">{t('admin.member.table.last_active')}</th>
              <th className="px-6 py-5 text-xs font-bold text-[#7A7A85] uppercase tracking-widest text-right">{t('admin.member.table.action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockMembers.map((member) => (
              <tr 
                key={member.id} 
                className={cn(
                  "group hover:bg-white/[0.02] transition-colors duration-300 items-center",
                  selectedMembers.includes(member.id) && "bg-white/[0.03]"
                )}
              >
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => toggleSelectMember(member.id)}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-neon-cyan focus:ring-neon-cyan/30"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg", member.avatarColor)}>
                      {member.nickname[0]}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-white tracking-tight">
                        {member.nickname}
                      </span>
                      <span className="text-[11px] font-medium text-[#7A7A85] tracking-tight hover:text-neon-cyan transition-colors cursor-pointer">
                        {member.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getRoleBadge(member.role)}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(member.status)}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-[#7A7A85] tracking-tight">{member.joinDate}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-[#7A7A85] tracking-tight">{t(`admin.member.time.${member.lastActive}`, { defaultValue: member.lastActive })}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 rounded-lg bg-white/5 text-[#7A7A85] hover:text-white hover:bg-white/10 transition-all duration-300">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 text-[#7A7A85] hover:text-white hover:bg-white/10 transition-all duration-300">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-[#7A7A85] text-xs font-semibold tracking-tight">
          <Trans 
            i18nKey="admin.member.pagination.range" 
            values={{ start: 6, end: 10, total: '2,841' }}
          />
        </p>
        <Pagination className="justify-end w-auto mx-0">
          <PaginationContent className="gap-2">
            <PaginationItem>
              <PaginationLink href="#" className="w-10 h-10 border-white/5 bg-white/5 text-[#7A7A85] hover:bg-white/10 hover:text-white rounded-xl">
                <ChevronLeft className="w-4 h-4" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive className="w-10 h-10 border-none bg-neon-cyan text-black hover:bg-neon-cyan/90 font-bold rounded-xl active:scale-95 transition-all">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="w-10 h-10 border-white/5 bg-white/5 text-[#7A7A85] hover:bg-white/10 hover:text-white rounded-xl font-bold">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="w-10 h-10 border-white/5 bg-white/5 text-[#7A7A85] hover:bg-white/10 hover:text-white rounded-xl font-bold">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis className="text-[#7A7A85]" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="w-10 h-10 border-white/5 bg-white/5 text-[#7A7A85] hover:bg-white/10 hover:text-white rounded-xl font-bold">
                285
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="w-10 h-10 border-white/5 bg-white/5 text-[#7A7A85] hover:bg-white/10 hover:text-white rounded-xl">
                <ChevronRight className="w-4 h-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
