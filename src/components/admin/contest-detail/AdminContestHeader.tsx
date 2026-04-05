"use client";

import React from 'react';
import { ChevronRight, XCircle, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminContestHeaderProps {
  contestTitle: string;
}

export function AdminContestHeader({ contestTitle }: AdminContestHeaderProps) {
  return (
    <header className="flex items-center justify-between px-10 py-6 border-b border-white/5 bg-[#0C0C0F]/80 backdrop-blur-md sticky top-0 z-40">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-[#7A7A85] hover:text-white cursor-pointer transition-colors">대회 관리</span>
        <ChevronRight className="w-4 h-4 text-[#7A7A85]" />
        <span className="text-white font-bold tracking-tight">{contestTitle}</span>
      </div>

      {/* Top Actions */}
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          className="h-10 px-4 border-[#E05C5C]/20 hover:border-[#E05C5C] hover:bg-[#E05C5C]/5 text-[#E05C5C] transition-all duration-300 gap-2 font-bold rounded-xl"
        >
          <XCircle className="w-4 h-4" />
          <span>대회 강제 종료</span>
        </Button>
        
        <Button 
          className="h-10 px-4 bg-neon-purple/10 text-neon-purple border border-neon-purple/20 hover:bg-neon-purple hover:text-black transition-all duration-300 gap-2 font-bold rounded-xl"
        >
          <Edit3 className="w-4 h-4" />
          <span>대회 수정</span>
        </Button>
      </div>
    </header>
  );
}
