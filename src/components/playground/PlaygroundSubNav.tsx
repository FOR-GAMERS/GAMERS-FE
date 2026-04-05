import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface Tab {
  id: string;
  name: string;
}

export function PlaygroundSubNav() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = searchParams.get('tab') || 'overview';

  const TABS: Tab[] = [
    { id: 'overview', name: t('playground.tabs.overview') },
    { id: 'bracket', name: t('playground.tabs.bracket') },
    { id: 'team', name: t('playground.tabs.team') },
    { id: 'team_distribution', name: t('playground.team_distribution.title') },
    { id: 'members', name: t('playground.tabs.members') },
    { id: 'notice', name: t('playground.tabs.notice') },
    { id: 'withdrawal', name: t('playground.tabs.withdrawal') },
  ];

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <nav className="h-11 border-b border-white/5 bg-[#0C0C0D] px-6">
      <div className="mx-auto flex h-full max-w-[1440px] items-center gap-10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "relative flex h-full items-center text-[13px] font-black transition-all",
              activeTab === tab.id ? "text-[#EEEEF0]" : "text-[#5A5A65] hover:text-[#7A7A85]"
            )}
          >
            {tab.name}
            {activeTab === tab.id && (
              <motion.div
                layoutId="playgroundTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-neon-mint"
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
