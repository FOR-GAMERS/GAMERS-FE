'use client';

import { Suspense } from 'react';
import ProfileHeader from '@/components/mypage/ProfileHeader';
import ValorantSection from '@/components/mypage/ValorantSection';
import { useMe } from '@/hooks/use-user';
import { Loader2 } from 'lucide-react';

function ReportPageContent() {
  const { data: userResponse, isLoading, error } = useMe();
  const user = userResponse?.data;

  // Transform API user to ProfileHeader user format
  // Handling missing fields gracefully
  const profileUser = user ? {
    id: String(user.user_id),
    username: user.username || 'Unknown',
    discriminator: user.tag ? `#${user.tag}` : '#0000',
    avatarUrl: user.avatar || '/images/avatars/default.png', // Fallback image
    bannerUrl: '/images/banners/default.png', // Fallback banner
    bio: user.bio || 'No bio yet.',
    joinDate: user.created_at,
    tier: 'Bronze' as const, // Placeholder or derive from Valorant info if available globally
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
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-12 pb-32">
      {/* Profile Header */}
      <ProfileHeader user={profileUser} />

      {/* Valorant Integration Section */}
      <section className="space-y-4">
        <h3 className="text-2xl font-black text-white px-2 border-l-4 border-neon-cyan">Game Integration</h3>
        <ValorantSection />
      </section>
      
      {/* Other sections (Activity, etc.) can be added here later */}
    </div>
  );
}

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-deep-black text-white bg-[url('/images/bg-grid.png')] bg-fixed">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-neon-cyan"/></div>}>
         <ReportPageContent />
      </Suspense>
    </main>
  );
}
