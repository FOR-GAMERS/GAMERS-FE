'use client';

import { useRef, useMemo } from 'react';
import Image from 'next/image';
import { UserProfile } from '@/types/mypage';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Edit2, Shield } from 'lucide-react';

import Link from 'next/link';

interface ProfileHeaderProps {
  user: UserProfile;
}

import { useTranslation } from 'react-i18next';

// ... (imports)

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { t } = useTranslation();
  const headerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const avatarUrl = useMemo(() => {
    if (!user.avatarUrl) return "/placeholder-avatar.jpg";
    try {
    if (user.avatarUrl.startsWith('http') || user.avatarUrl.startsWith('/')) {
        if (user.email && user.avatarUrl.includes('/avatars/')) {
            const discordId = user.email.split('@')[0];
            return user.avatarUrl.replace(/\/avatars\/[^\/]+\//, `/avatars/${discordId}/`);
        }
        return user.avatarUrl;
    }
    // Check if it's a raw hash
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatarUrl}.png`;
    } catch (e) {
        console.error("Failed to parse avatar URL", e);
    }
    return user.avatarUrl;
  }, [user.avatarUrl, user.email]);

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
    <div ref={headerRef} className="relative w-full mb-8 group overflow-visible">
      {/* Banner Image */}
      <div className="relative w-full h-56 md:h-80 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,243,255,0.15)] bg-zinc-900">
        <Image
          src={user.bannerUrl}
          alt="Banner"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/20 to-transparent" />
        
        {/* Decorative Overlay */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
      </div>

      {/* Profile Content Overlay */}
      <div className="absolute -bottom-6 left-0 w-full px-6 md:px-12 pb-8 translate-y-24 md:translate-y-1/2 flex flex-col md:flex-row items-center md:items-end gap-8 z-20">
        
        {/* Avatar */}
        <div ref={avatarRef} className="relative w-28 h-28 md:w-40 md:h-40 shrink-0">
          <div className="w-full h-full rounded-3xl overflow-hidden border-4 border-deep-black shadow-[0_0_30px_rgba(0,243,255,0.5)] relative bg-zinc-900 neon-glow-cyan">
             <Image
              src={avatarUrl}
              alt="Avatar"
              fill
              sizes="(max-width: 768px) 112px, 160px"
              className="object-cover"
            />
          </div>
          {/* Status Indicator */}
          <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-deep-black z-10 shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
        </div>

        {/* Info Text */}
        <div ref={infoRef} className="flex-1 pb-4 md:pb-0 flex flex-col items-center md:items-start gap-2 z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-2 drop-shadow-lg">
              {user.username}
              <span className="text-2xl md:text-3xl text-white/30 font-medium">{user.discriminator}</span>
            </h1>
            <div className="inline-flex px-3 py-1 rounded-full border border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,243,255,0.3)] backdrop-blur-md">
              {user.tier}
            </div>
          </div>
          <p className="text-white/70 text-base md:text-lg max-w-2xl font-medium leading-relaxed">
            {user.bio}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pb-2 md:pb-0 z-10 flex-wrap justify-center md:justify-start">
             <Link 
                href="/report" 
                className="px-6 py-3 glass-card hover:bg-white/10 text-white flex items-center justify-center gap-2 transition-all hover:border-neon-cyan/60 hover:text-neon-cyan hover:scale-105 active:scale-95 group"
             >
                <Shield size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-black uppercase tracking-wider">{t('mypage.profile.report')}</span>
             </Link>
        </div>
      </div>
       
       {/* Background Glow Spacer */}
       <div className='hidden md:block h-32 w-full absolute -bottom-32 bg-gradient-to-b from-deep-black/50 to-transparent z-0 pointer-events-none' />

    </div>
  );
}
