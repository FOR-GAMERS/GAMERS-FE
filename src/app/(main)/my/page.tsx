'use client';

import { Suspense, useState } from 'react';
import ProfileHeader from '@/components/mypage/ProfileHeader';
import ValorantSection from '@/components/mypage/ValorantSection';
import ProfileEditSection from '@/components/mypage/ProfileEditSection';
import { useMe } from '@/hooks/use-user';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDiscordAvatarUrl } from '@/lib/discord';

function ContentArea({ activeTab }: { activeTab: string }) {
  if (activeTab === 'profile') {
     return (
       <div className="space-y-12">
           <ProfileEditSection />
       </div>
     );
  }
  
  if (activeTab === 'integration') {
      return (
        <div className="space-y-4">
            <h3 className="text-2xl font-black text-white px-2 border-l-4 border-neon-cyan">Game Integration</h3>
            <ValorantSection />
        </div>
      );
  }

  return (
    <div className="space-y-12">
       <div className="space-y-4">
            <h3 className="text-2xl font-black text-white px-2 border-l-4 border-neon-cyan">Game Integration</h3>
            <ValorantSection />
       </div>
       <div className="space-y-4">
            <h3 className="text-2xl font-black text-white px-2 border-l-4 border-neon-cyan">Settings</h3>
            <ProfileEditSection />
       </div>
    </div>
  );
}

function MyPageContent() {
  const { data: userResponse, isLoading, error } = useMe();
  const user = userResponse?.data;
  const [activeTab, setActiveTab] = useState('overview');

  const profileUser = user ? {
    id: String(user.user_id),
    username: user.username || 'Unknown',
    discriminator: user.tag ? `#${user.tag}` : '#0000',
    avatarUrl: getDiscordAvatarUrl(String(user.user_id), user.avatar) || '/images/avatars/default.png',
    bannerUrl: '/images/banners/default.png', 
    email: user.email,
    bio: user.bio || 'No bio yet.',
    joinDate: user.created_at,
    tier: (user.role === "ADMIN" ? "ADMIN" : "MEMBER") as any, // Cast or update type
  } : null;

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-neon-cyan animate-spin" />
        </div>
    );
  }

  if (error || !profileUser) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white">
            <h1 className="text-2xl font-bold mb-4">Login Required</h1>
            <p className="text-muted-foreground">Please login to view your profile.</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 pb-32">
      <ProfileHeader user={profileUser} />

      <div className="flex items-center gap-6 border-b border-white/10">
          {['Overview', 'Settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={cn(
                    "pb-4 text-sm font-bold uppercase tracking-wider transition-all relative",
                    activeTab === tab.toLowerCase() 
                        ? "text-neon-cyan" 
                        : "text-white/40 hover:text-white"
                )}
              >
                 {tab}
                 {activeTab === tab.toLowerCase() && (
                     <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
                 )}
              </button>
          ))}
      </div>

      <div className="min-h-[400px]">
         {activeTab === 'overview' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-neon-cyan rounded-full"/> 
                        Game Integration
                    </h3>
                    <ValorantSection />
                </section>
             </div>
         )}

         {activeTab === 'settings' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <section className="space-y-6">
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-neon-cyan rounded-full"/> 
                        Account Settings
                     </h3>
                     <ProfileEditSection />
                 </section>
             </div>
         )}
      </div>
    </div>
  );
}

export default function MyPage() {
  return (
    <main className="min-h-screen bg-deep-black text-white">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-neon-cyan"/></div>}>
         <MyPageContent />
      </Suspense>
    </main>
  );
}
