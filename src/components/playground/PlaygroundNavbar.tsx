'use client';

import Link from 'next/link';

export function PlaygroundNavbar() {
  return (
    <nav className="h-14 border-b border-white/5 bg-[#0C0C0D] px-6">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between">
        {/* Left: Logo & Context */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black italic tracking-tighter text-[#EEEEF0]">GAMERS</span>
          </Link>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-[13px] font-black text-[#5A5A65] uppercase tracking-wider">Playground</span>
        </div>

        {/* Right: User */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-full bg-white/5 border border-white/5 pl-2 pr-4 py-1.5 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="h-6 w-6 rounded-full bg-neon-mint flex items-center justify-center text-[10px] font-black text-[#0C0C0D]">
              A
            </div>
            <span className="text-[13px] font-black text-[#EEEEF0] group-hover:text-neon-mint transition-colors tracking-tight">Antigravity</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
