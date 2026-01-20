'use client';

import { useState } from 'react';
import ProfileHeader from '@/components/mypage/ProfileHeader';
import NavSidebar from '@/components/mypage/NavSidebar';
import ContentArea from '@/components/mypage/ContentArea';
import { mockUserProfile } from '@/data/mock-mypage';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-deep-black text-white selection:bg-neon-cyan/30 selection:text-neon-cyan">
       {/* Background Elements */}
       <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-cyan/5 blur-[100px] rounded-full" />
       </div>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <ProfileHeader user={mockUserProfile} />
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 mt-8 md:mt-16">
           <NavSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
           <ContentArea activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}
