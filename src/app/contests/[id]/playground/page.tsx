'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { PlaygroundOverview } from '@/components/playground/PlaygroundOverview';
import { PlaygroundTeamManagement } from '@/components/playground/PlaygroundTeamManagement';
import { PlaygroundNotice } from '@/components/playground/PlaygroundNotice';
import { TemporalTeamDistribution } from '@/components/playground/team/distribution/TemporalTeamDistribution';

export default function PlaygroundPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';

  return (
    <>
      {tab === 'overview' && <PlaygroundOverview />}
      {tab === 'team' && <PlaygroundTeamManagement />}
      {tab === 'team_distribution' && <TemporalTeamDistribution />}
      {tab === 'notice' && <PlaygroundNotice />}
      {/* Other tabs can be added here */}
      {!['overview', 'team', 'team_distribution', 'notice'].includes(tab) && (
        <div className="flex h-[60vh] items-center justify-center text-[#5A5A65]">
          {t('playground.header.under_construction')}
        </div>
      )}
    </>
  );
}
