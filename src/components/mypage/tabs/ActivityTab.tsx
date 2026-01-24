'use client';

import { useRef } from 'react';
import { CommentActivity } from '@/types/mypage';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MessageSquare, Heart, Clock } from 'lucide-react';

interface ActivityTabProps {
  activity: CommentActivity[];
}

export default function ActivityTab({ activity }: ActivityTabProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.activity-item', {
      x: -20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="space-y-6">
       <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
         <span className="w-1 h-6 bg-neon-cyan rounded-full" />
         最近の活動
      </h2>

      <div className="space-y-4">
        {activity.map((item) => (
            <div key={item.id} className="activity-item pl-4 border-l-2 border-white/10 hover:border-neon-cyan transition-colors py-1 relative">
                {/* Dot */}
                <div className="absolute -left-[5px] top-4 w-2 h-2 rounded-full bg-white/20" />
                
                <p className="text-white/80 text-sm md:text-base mb-2">"{item.content}"</p>
                
                <div className="flex items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1 text-neon-cyan/70 font-bold">
                        <MessageSquare size={12} /> {item.targetTitle}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer">
                        <Heart size={12} /> {item.likes}
                    </span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
