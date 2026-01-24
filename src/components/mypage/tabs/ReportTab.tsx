'use client';

import { useRef, useState } from 'react';
import { TeamInvite } from '@/types/mypage';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Check, X } from 'lucide-react';
import Image from 'next/image';

interface ReportTabProps {
  invites: TeamInvite[];
}

export default function ReportTab({ invites }: ReportTabProps) {
  // Local state for optimistic UI updates
  const [items, setItems] = useState(invites);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial staggering entrance
    gsap.from('.invite-card', {
      x: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  const handleRemove = (id: string) => {
    // The actual removal from state happens inside the InviteCard component's onComplete callback
    // to allow the exit animation to finish first.
    // However, to ensure React state remains consistent if we were doing this at parent level,
    // we would wait. Ideally, we pass a callback "onRemove" to the child.
    
    // For this specific GSAP implementation:
    // 1. Child animates out.
    // 2. Child calls onRemove(id).
    // 3. Parent updates state.
    // 4. GSAP Flip or layout animation handles the rest.
    
    // Since we want manual layout shift without heavy Flip plugin:
    // We will let the Card animate its own height to 0 before calling this.
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div ref={containerRef} className="space-y-6">
       <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
         <span className="w-1 h-6 bg-neon-cyan rounded-full" />
         招待管理
      </h2>

      <div className="flex flex-col gap-4">
        {items.map((invite) => (
          <InviteCard key={invite.id} invite={invite} onRemove={handleRemove} />
        ))}
        {items.length === 0 && (
            <div className="text-center py-10 text-white/30 text-sm">
                新しい招待はありません
            </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

interface InviteCardProps {
    invite: TeamInvite;
    onRemove: (id: string) => void;
}

function InviteCard({ invite, onRemove }: InviteCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const feedbackRef = useRef<HTMLDivElement>(null);

    const { contextSafe } = useGSAP({ scope: cardRef });

    const handleAccept = contextSafe(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                // Animate height to 0 to simulate Flip layout shift
                gsap.to(cardRef.current, {
                    height: 0,
                    marginBottom: 0,
                    padding: 0,
                    borderWidth: 0,
                    duration: 0.4,
                    ease: "power2.inOut",
                    onComplete: () => onRemove(invite.id)
                });
            }
        });

        // 1. Glow & Feedback
        tl.to(cardRef.current, {
            borderColor: '#00f3ff', // neon-cyan
            boxShadow: '0 0 20px rgba(0, 243, 255, 0.4)',
            duration: 0.3
        })
        .to(feedbackRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: 'back.out(1.7)'
        }, '<')
        // 2. Slide Out
        .to(cardRef.current, {
            x: 100,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            delay: 0.5 // Wait a bit for user to see "Joined Team!"
        });
    });

    const handleReject = contextSafe(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                // Layout shift simulation
                 gsap.to(cardRef.current, {
                    height: 0,
                    marginBottom: 0,
                    padding: 0,
                    borderWidth: 0,
                    duration: 0.4,
                    ease: "power2.inOut",
                    onComplete: () => onRemove(invite.id)
                });
            }
        });

        // 1. Flash Red & Scale Down
        tl.to(cardRef.current, {
            borderColor: '#ef4444', // red-500
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            scale: 0.95,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        })
        .to(cardRef.current, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: 'back.in(1.7)'
        });
    });

    return (
        <div 
          ref={cardRef} 
          className="invite-card relative bg-[#2f3136] border border-white/5 rounded-xl p-0 overflow-hidden shrink-0 group"
          // height handling usually requires the element to be visible initially.
        >
            {/* Success Feedback Overlay */}
            <div 
                ref={feedbackRef} 
                className="absolute inset-0 bg-deep-black/80 z-20 flex items-center justify-center opacity-0 scale-50 pointer-events-none"
            >
                <div className="text-neon-cyan font-black text-xl tracking-wider uppercase flex items-center gap-2">
                    <Check className="w-8 h-8" /> Joined Team!
                </div>
            </div>

           <div className="flex flex-col md:flex-row items-center p-5 gap-5">
             {/* Left: Inviter Avatar */}
             <div className="shrink-0 relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 ring-2 ring-transparent group-hover:ring-neon-purple/50 transition-all">
                    <Image src={invite.inviterAvatarUrl} alt="Inviter" fill className="object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#2f3136] rounded-full flex items-center justify-center border border-white/10">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
             </div>
             
             {/* Middle: Info */}
             <div className="flex-1 text-center md:text-left min-w-0">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <span className="text-white font-bold text-lg truncate">{invite.inviterName}</span>
                    <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-white/50">Inviter</span>
                </div>
                <p className="text-white/60 text-sm mb-2">
                    invited you to join <span className="text-neon-cyan font-bold hover:underline cursor-pointer">{invite.teamName}</span>
                </p>
                <div className="flex items-center justify-center md:justify-start gap-3 text-xs text-white/30 font-mono">
                   <span>{invite.contestTitle}</span>
                   <span>•</span>
                   <span>{new Date(invite.sentAt).toLocaleDateString()}</span>
                </div>
             </div>

             {/* Right: Actions */}
             <div className="flex gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                <button 
                    onClick={handleAccept}
                    className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-bold rounded-md transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
                >
                    <Check size={18} strokeWidth={3} />
                    <span>Accept</span>
                </button>
                <button 
                    onClick={handleReject}
                    className="flex-1 md:flex-none px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 active:scale-95 text-red-500 hover:text-red-400 font-bold rounded-md border border-red-500/20 transition-all flex items-center justify-center gap-2"
                >
                    <X size={18} strokeWidth={3} />
                    <span>Reject</span>
                </button>
             </div>
           </div>
        </div>
    );
}
