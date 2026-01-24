'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Home, FileText, Award, MessageSquare } from 'lucide-react';

interface NavSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = [
  { id: 'home', label: 'ホーム', icon: Home },
  { id: 'report', label: '招待管理', icon: FileText },
  { id: 'awards', label: '受賞歴', icon: Award },
  { id: 'activity', label: '活動履歴', icon: MessageSquare },
];

export default function NavSidebar({ activeTab, setActiveTab }: NavSidebarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Desktop Animation
    mm.add("(min-width: 768px)", () => {
      // Entrance
      gsap.from(navRef.current, {
        x: -20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.5
      });
      
      // Indicator
      const activeIndex = TABS.findIndex(t => t.id === activeTab);
      if (indicatorRef.current && activeIndex !== -1) {
        gsap.to(indicatorRef.current, {
          y: activeIndex * 48,
          opacity: 1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.7)',
        });
      }
    });

    // Mobile Animation
    mm.add("(max-width: 767px)", () => {
       // Entrance
       gsap.from(navRef.current, {
         y: -20, // Slide down on mobile
         opacity: 0,
         duration: 0.8,
         ease: 'power3.out',
         delay: 0.5
       });
       
       // For mobile, we might use simple CSS border or different indicator logic if needed.
       // Here we keep it simple with CSS classes for the horizontal indicator.
    });

  }, [activeTab]);

  return (
    <div 
      ref={navRef} 
      className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-2 relative overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide"
    >
      <h3 className="hidden md:block text-white/40 text-xs font-bold uppercase tracking-widest px-4 mb-2">Menu</h3>
      
      {/* Desktop Indicator */}
      <div 
        ref={indicatorRef}
        className="absolute top-[32px] left-0 w-full h-10 bg-gradient-to-r from-neon-cyan/20 to-transparent border-l-4 border-neon-cyan rounded-r-lg pointer-events-none opacity-0 hidden md:block" 
      />

      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
                relative h-10 px-4 flex items-center gap-2 md:gap-3 rounded-lg md:rounded-r-lg md:rounded-l-none transition-all duration-300 whitespace-nowrap flex-shrink-0
                ${isActive ? 'text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}
            `}
          >
            <Icon size={18} className={isActive ? 'text-neon-cyan drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]' : ''} />
            <span className={`text-sm font-bold ${isActive ? 'tracking-wide' : ''}`}>{tab.label}</span>
            
            {/* Desktop Dot Indicator */}
            {isActive && (
                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_10px_#00f3ff] hidden md:block" />
            )}

            {/* Mobile Bottom Border Indicator */}
            {isActive && (
                 <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-cyan shadow-[0_0_10px_#00f3ff] md:hidden" />
            )}
          </button>
        );
      })}
    </div>
  );
}
