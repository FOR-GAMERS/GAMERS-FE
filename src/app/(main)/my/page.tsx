'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProfileHeader from '@/components/mypage/ProfileHeader';
import ValorantSection from '@/components/mypage/ValorantSection';
import ProfileEditSection from '@/components/mypage/ProfileEditSection';
import ReceivedApplicationsSection from '@/components/mypage/ReceivedApplicationsSection';
import ManagedContestsSection from '@/components/mypage/ManagedContestsSection';
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

    if (activeTab === 'manage') {
      return (
        <div className="space-y-4">
            <h3 className="text-2xl font-black text-white px-2 border-l-4 border-neon-cyan">Manage</h3>
            <ReceivedApplicationsSection />
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
            <h3 className="text-2xl font-black text-white px-2 border-l-4 border-neon-cyan">Manage</h3>
            <ReceivedApplicationsSection />
       </div>
       <div className="space-y-4">
            <h3 className="text-2xl font-black text-white px-2 border-l-4 border-neon-cyan">Settings</h3>
            <ProfileEditSection />
       </div>
    </div>
  );
}

import { useTranslation } from 'react-i18next';

// ... (imports)

function MyPageContent() {
  const { t } = useTranslation();
  const { data: userResponse, isLoading, error } = useMe();
  const user = userResponse?.data;
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'overview');

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

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

  const tabs = [
    { id: 'overview', label: t('mypage.tabs.overview') },
    { id: 'manage', label: t('mypage.tabs.manage') },
    { id: 'settings', label: t('mypage.tabs.settings') },
  ];

  return (
     <div className="container mx-auto px-4 py-8 max-w-5xl pb-32">
      <ProfileHeader user={profileUser} />

      <div className="flex items-center gap-6 border-b border-white/10 mt-32">
          {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                    "pb-4 text-sm font-bold uppercase tracking-wider transition-all relative",
                    activeTab === tab.id 
                        ? "text-neon-cyan" 
                        : "text-white/40 hover:text-white"
                )}
              >
                 {tab.label}
                 {activeTab === tab.id && (
                     <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
                 )}
              </button>
          ))}
      </div>

      <div className="min-h-[400px] mt-8">
          {activeTab === 'overview' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <section className="space-y-6">
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                         <span className="w-1 h-6 bg-neon-cyan rounded-full"/> 
                         {t('mypage.sections.gameIntegration')}
                     </h3>
                     <ValorantSection />
                 </section>
              </div>
          )}
         
         {activeTab === 'manage' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <ManagedContestsSection />
                 <div className="space-y-4">
                    <ReceivedApplicationsSection />
                 </div>
             </div>
         )}

         {activeTab === 'settings' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <section className="space-y-6">
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-neon-cyan rounded-full"/> 
                        {t('mypage.sections.accountSettings')}
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
