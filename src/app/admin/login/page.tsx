import React from 'react';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Branding Section (Left) */}
      <section className="hidden lg:flex flex-[1.5] relative flex-col justify-center items-center px-16 border-r border-white/5 bg-gradient-to-br from-[#0A0A0A] via-[#0D0D0E] to-[#121214]">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-neon-purple/5 rounded-full blur-[100px] animate-pulse delay-700" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-8 group">
            <div className="w-20 h-20 bg-neon-cyan rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(0,243,255,0.3)] group-hover:scale-110 transition-transform duration-500">
              <span className="text-4xl font-black text-black font-outfit">G</span>
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-4xl font-black text-white font-outfit tracking-tighter uppercase">
                GAMERS
              </span>
              <span className="text-xl font-bold text-neon-cyan font-outfit uppercase tracking-widest mt-1">
                Admin Panel
              </span>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-white/90 max-w-md leading-relaxed mb-4">
            Total control over your gaming community.
          </h2>
          <p className="text-[#7A7A85] text-lg max-w-sm">
            Access administrative tools, moderate content, and manage member activities in one centralized dashboard.
          </p>
        </div>

        {/* Bottom Decorative Element */}
        <div className="absolute bottom-12 left-12 flex items-center gap-2 text-[#7A7A85] text-sm font-medium">
          <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-ping" />
          System Status: Optimal
        </div>
      </section>

      {/* Form Section (Right) */}
      <section className="flex-1 flex flex-col justify-center items-center px-8 sm:px-16 lg:px-24 bg-[#0F0F10]">
        <div className="w-full max-w-md">
          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
