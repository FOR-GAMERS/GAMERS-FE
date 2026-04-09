'use client';

import React from 'react';
import Link from 'next/link';
import { AuthSidePanel } from '@/components/auth/AuthSidePanel';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen bg-[#0C0C0F] items-stretch overflow-hidden">
      {/* Visual Side Panel */}
      <AuthSidePanel />
      
      {/* Form Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center bg-[#141418] relative px-6 py-12">
        {/* Back to Home Link */}
        <div className="absolute top-8 left-8 z-20">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[#7A7A85] hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[#1A1A20] flex items-center justify-center group-hover:bg-[#24242B] transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="font-inter text-sm font-bold uppercase tracking-wider">{t('auth.layout.back_to_home')}</span>
          </Link>
        </div>
        {/* Decorative Grid Background */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
            backgroundSize: '48px 48px' 
          }} 
        />
        
        {/* Glow behind the form */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03] pointer-events-none blur-[120px]" 
          style={{ 
            background: 'radial-gradient(circle at center, #6EE7B7 0%, transparent 70%)' 
          }} 
        />

        <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
          {children}
        </div>
      </main>
    </div>
  );
}
