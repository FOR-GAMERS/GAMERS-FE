'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { UserProfile } from '@/types/mypage';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Edit2, Shield } from 'lucide-react';

interface ProfileHeaderProps {
  user: UserProfile;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Banner fade in
    tl.from(headerRef.current, {
      opacity: 0,
      duration: 1,
      y: -20,
    });

    // Avatar pop in
    tl.from(avatarRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      rotate: -45,
    }, '-=0.5');

    // Info slide up
    tl.from(infoRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
    }, '-=0.4');

  }, { scope: headerRef });

  return (
    <div ref={headerRef} className="relative w-full mb-8 group">
      {/* Banner Image */}
      <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,243,255,0.1)]">
        <Image
          src={user.bannerUrl}
          alt="Banner"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-90" />
      </div>

      {/* Profile Content Overlay */}
      <div className="absolute -bottom-4 left-0 w-full px-6 md:px-10 pb-6 translate-y-12 md:translate-y-1/2 flex flex-col md:flex-row items-center md:items-end gap-6 z-20">
        
        {/* Avatar */}
        <div ref={avatarRef} className="relative w-24 h-24 md:w-32 md:h-32 shrink-0">
          <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-deep-black shadow-[0_0_20px_rgba(0,243,255,0.4)] relative bg-zinc-900">
             <Image
              src={user.avatarUrl}
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          {/* Status Indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-deep-black z-10" />
        </div>

        {/* Info Text */}
        <div ref={infoRef} className="flex-1 pb-2 md:pb-0 flex flex-col items-center md:items-start gap-1 z-10 text-center md:text-left">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-2">
              {user.username}
              <span className="text-xl md:text-2xl text-white/40 font-normal">{user.discriminator}</span>
            </h1>
            <div className="px-2 py-0.5 rounded border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(0,243,255,0.2)]">
              {user.tier}
            </div>
          </div>
          <p className="text-white/60 text-sm md:text-base max-w-xl font-medium">
            {user.bio}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pb-2 md:pb-0 z-10 flex-wrap justify-center md:justify-start">
             <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg backdrop-blur-md transition-all text-sm font-bold text-white group-hover:border-neon-cyan/30">
                <Edit2 size={16} />
                <span>プロフィール編集</span>
             </button>
             <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white">
                <Shield size={18} />
             </button>
        </div>
      </div>
       
       {/* Spacer for overlay to not overlap content below due to translate-y */}
       <div className='hidden md:block h-16 w-full absolute -bottom-16 bg-gradient-to-b from-deep-black to-transparent z-0 pointer-events-none' />

    </div>
  );
}
