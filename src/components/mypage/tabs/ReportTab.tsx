'use client';

import { useRef } from 'react';
import { TeamInvite } from '@/types/mypage';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Mail, Check, X } from 'lucide-react';
import Image from 'next/image';

interface ReportTabProps {
  invites: TeamInvite[];
}

export default function ReportTab({ invites }: ReportTabProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.invite-card', {
      x: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="space-y-6">
       <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
         <span className="w-1 h-6 bg-neon-cyan rounded-full" />
         招待管理
      </h2>

      <div className="grid gap-4">
        {invites.map((invite) => (
          <div 
            key={invite.id} 
            className="invite-card bg-white/5 border border-white/5 rounded-xl p-5 flex flex-col md:flex-row items-center gap-4"
          >
             <div className="p-3 bg-neon-cyan/10 rounded-full text-neon-cyan shrink-0">
                <Mail size={24} />
             </div>
             
             <div className="flex-1 text-center md:text-left">
                <p className="text-white/60 text-sm mb-1">
                    <span className="text-white font-bold">{invite.inviterName}</span> さんから
                    <span className="text-neon-cyan font-bold mx-1">{invite.teamName}</span>
                    への招待が届いています
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-white/40">
                   <div className="w-5 h-5 relative rounded-full overflow-hidden border border-white/10">
                      <Image src={invite.inviterAvatarUrl} alt="Inviter" fill className="object-cover" />
                   </div>
                   <span>{invite.contestTitle}</span>
                   <span>•</span>
                   <span>{new Date(invite.sentAt).toLocaleDateString()}</span>
                </div>
             </div>

             <div className="flex gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                <button className="flex-1 md:flex-none px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Check size={16} /> 承認
                </button>
                <button className="flex-1 md:flex-none px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <X size={16} /> 拒否
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
