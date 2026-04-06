'use client';

import { useTranslation } from 'react-i18next';
import { PlaygroundNavbar } from '@/components/playground/PlaygroundNavbar';
import { PlaygroundHeader } from '@/components/playground/PlaygroundHeader';
import { PlaygroundSubNav } from '@/components/playground/PlaygroundSubNav';

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  
  return (
    <div className="flex min-h-screen flex-col bg-[#0C0C0F] text-[#EEEEF0] selection:bg-neon-mint/30">
      <PlaygroundNavbar />
      <PlaygroundHeader 
        title={t('contests.single.mock.title')}
        game="Valorant"
        host="GMS_Creator"
        timeLeft="01:23:45"
      />
      <PlaygroundSubNav />
      {children}
    </div>
  );
}
