"use client";

import React from 'react';
import { Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function AdminHeader() {
  return (
    <header className="flex items-center justify-between px-10 py-8 border-b border-white/5 bg-[#0C0C0F]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
          멤버 관리
        </h1>
        <p className="text-[#7A7A85] text-sm font-semibold tracking-tight">
          총 <span className="text-white">2,841</span>명의 등록된 사용자
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7A85] transition-colors duration-300 group-focus-within:text-neon-cyan" />
          <Input 
            type="text" 
            placeholder="닉네임, 이메일 검색..." 
            className="w-[320px] pl-11 bg-white/5 border-white/5 focus-visible:ring-neon-cyan/30 focus-visible:border-neon-cyan hover:bg-white/[0.08] transition-all duration-300 rounded-xl"
          />
        </div>
        
        <Button variant="outline" className="flex items-center gap-2 border-white/10 hover:border-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300 font-bold rounded-xl h-11 px-6">
          <Download className="w-4 h-4" />
          <span>내보내기</span>
        </Button>
      </div>
    </header>
  );
}
