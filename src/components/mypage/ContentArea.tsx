'use client';

import { mockHistory, mockInvites, mockAwards, mockActivity } from '@/data/mock-mypage';
import HomeTab from './tabs/HomeTab';
import ReportTab from './tabs/ReportTab';
import AwardsTab from './tabs/AwardsTab';
import ActivityTab from './tabs/ActivityTab';

interface ContentAreaProps {
  activeTab: string;
}

export default function ContentArea({ activeTab }: ContentAreaProps) {
  // In a real app, we might fetch data based on activeTab here using React Query or similar
  
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab history={mockHistory} />;
      case 'report':
        return <ReportTab invites={mockInvites} />;
      case 'awards':
        return <AwardsTab awards={mockAwards} />;
      case 'activity':
        return <ActivityTab activity={mockActivity} />;
      default:
        return <HomeTab history={mockHistory} />;
    }
  };

  return (
    <div className="flex-1 w-full min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {renderContent()}
    </div>
  );
}
