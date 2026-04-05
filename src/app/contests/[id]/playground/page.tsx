'use client';

import { useSearchParams } from 'next/navigation';
import { PlaygroundOverview } from '@/components/playground/PlaygroundOverview';
import { PlaygroundTeamManagement } from '@/components/playground/PlaygroundTeamManagement';
import { PlaygroundNotice } from '@/components/playground/PlaygroundNotice';
import { TemporalTeamDistribution } from '@/components/playground/team/distribution/TemporalTeamDistribution';

export default function PlaygroundPage() {
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
          준비 중인 페이지입니다.
        </div>
      )}
    </>
  );
}
