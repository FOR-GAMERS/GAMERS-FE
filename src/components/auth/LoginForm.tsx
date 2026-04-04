'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col justify-center w-full max-w-[320px] mx-auto"
    >
      <div className="space-y-2">
        <h2 className="text-4xl uppercase text-[#EEEEF0] font-barlow font-black leading-[1.1] tracking-tight">
          다시 만나서<br />반가워요
        </h2>
        <p className="text-[#7A7A85] font-inter text-sm font-medium">
          GAMERS에 로그인하세요
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {/* Discord Login */}
        <Button variant="discord" className="w-full gap-3 group">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
             <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.1.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.645-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" fill="#FFFFFF" />
          </svg>
          Discord로 계속하기
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="grow h-px bg-[#242428]" />
          <span className="text-[#7A7A85] font-inter text-[11px] uppercase font-bold tracking-widest">또는</span>
          <div className="grow h-px bg-[#242428]" />
        </div>

        {/* Riot Login */}
        <Button variant="riot" className="w-full gap-3 group">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
            <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" fill="#D13639" />
            <path d="M10 10h12v2h-5v10h-2V12h-5V10z" fill="#FFFFFF" />
          </svg>
          Riot 계정으로 계속하기
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[#7A7A85] text-[13px]">계정이 없으신가요?</span>
          <Link href="/signup" className="text-[#6EE7B7] hover:text-white font-bold text-[13px] transition-all hover:tracking-wide">
            회원가입
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
