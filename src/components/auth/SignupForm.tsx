'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SignupForm() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col justify-center w-full max-w-[320px] mx-auto"
    >
      <div className="space-y-2">
        <h2 className="text-4xl uppercase text-[#EEEEF0] font-barlow font-black leading-[1.1] tracking-tight">
          GAMERS에<br />합류하세요
        </h2>
        <p className="text-[#7A7A85] font-inter text-sm font-medium">
          게이머로서의 첫 기억을 시작하세요
        </p>
      </div>

      <div className="mt-10 space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] uppercase font-bold text-[#7A7A85] tracking-widest ml-1">
            닉네임
          </label>
          <Input placeholder="닉네임을 입력하세요" />
        </div>

        <Button variant="discord" className="w-full gap-3 group">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
             <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.1.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.645-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" fill="#FFFFFF" />
          </svg>
          Discord로 시작하기
        </Button>

        <p className="text-[11px] text-center text-[#7A7A85] leading-relaxed font-medium">
          가입 시 이용약관 및 개인정보처리방침에<br />동의합니다
        </p>
      </div>

      {/* Footer */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[#7A7A85] text-[13px]">이미 계정이 있으신가요?</span>
          <Link href="/login" className="text-[#6EE7B7] hover:text-white font-bold text-[13px] transition-all hover:tracking-wide">
            로그인
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
