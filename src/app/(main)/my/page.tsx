'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProfileHeader from '@/components/mypage/ProfileHeader';
import ValorantSection from '@/components/mypage/ValorantSection';
import ProfileEditSection from '@/components/mypage/ProfileEditSection';
import ReceivedApplicationsSection from '@/components/mypage/ReceivedApplicationsSection';
import ManagedContestsSection from '@/components/mypage/ManagedContestsSection';
import LOLSection from '@/components/mypage/LOLSection';
import MatchHistoryChart from '@/components/mypage/MatchHistoryChart';
import ParticipationContestsSection from '@/components/mypage/ParticipationContestsSection';
import InvitationsSection from '@/components/mypage/InvitationsSection';
import { useMe } from '@/hooks/use-user';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDiscordAvatarUrl } from '@/lib/discord';

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
    tier: (user.role === "ADMIN" ? "ADMIN" : "MEMBER") as any,
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

      <div className="flex items-center gap-8 border-b border-white/5 mt-32">
          {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                    "pb-5 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative",
                    activeTab === tab.id 
                        ? "text-neon-cyan" 
                        : "text-white/30 hover:text-white"
                )}
              >
                 {tab.label}
                 {activeTab === tab.id && (
                     <div className="absolute bottom-0 left-0 w-full h-[3px] bg-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.6)] rounded-full" />
                 )}
              </button>
          ))}
      </div>

      <div className="min-h-[400px] mt-12">
          {activeTab === 'overview' && (
              <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                 <InvitationsSection />
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <section className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                                <span className="w-1.5 h-8 bg-neon-cyan rounded-full shadow-[0_0_15px_rgba(0,243,255,0.6)]"/> 
                                {t('mypage.sections.gameIntegration')}
                            </h3>
                        </div>
                        <div className="space-y-8">
                            <ValorantSection />
                            <LOLSection />
                        </div>
                    </section>

                    <section className="space-y-8">
                        <MatchHistoryChart />
                    </section>
                 </div>

                 <ParticipationContestsSection />
              </div>
          )}
         
          {activeTab === 'manage' && (
              <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <ManagedContestsSection />
                  <div className="space-y-6">
                     <ReceivedApplicationsSection />
                  </div>
              </div>
          )}

          {activeTab === 'settings' && (
              <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <section className="space-y-8">
                      <div className="px-2">
                        <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                            <span className="w-1.5 h-8 bg-neon-cyan rounded-full shadow-[0_0_15px_rgba(0,243,255,0.6)]"/> 
                            {t('mypage.sections.accountSettings')}
                        </h3>
                      </div>
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
