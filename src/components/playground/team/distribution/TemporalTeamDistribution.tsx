'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Users, LayoutGrid, ArrowRight, Sword } from 'lucide-react';
import { cn } from '@/lib/utils';

import { NicknameParsingPanel } from './NicknameParsingPanel';
import { ParticipantGrid, type Participant, type Role, type Tier } from './ParticipantGrid';
import { DistributionResultView } from './DistributionResultView';

type Phase = 'participating' | 'result';

const TIER_VALUES: Record<Tier, number> = {
  IRON: 1, BRONZE: 2, SILVER: 3, GOLD: 4, PLATINUM: 5,
  EMERALD: 6, DIAMOND: 7, MASTER: 8, GRANDMASTER: 9, CHALLENGER: 10
};

export function TemporalTeamDistribution() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>('participating');
  const [participants, setParticipants] = useState<Participant[]>(
    Array.from({ length: 10 }, (_, i) => ({ id: `${i}`, name: '', role: null, tier: null }))
  );
  const [result, setResult] = useState<{ blueTeam: Participant[]; redTeam: Participant[] } | null>(null);

  const handleParseNicknames = useCallback((nicknames: string[]) => {
    setParticipants(prev => {
      const newParticipants = [...prev];
      nicknames.forEach((name, i) => {
        if (i < 10) {
          newParticipants[i] = { ...newParticipants[i], name };
        }
      });
      // Clear remaining slots if nicknames are fewer than 10
      for (let i = nicknames.length; i < 10; i++) {
        newParticipants[i] = { id: `${i}`, name: '', role: null, tier: null };
      }
      return newParticipants;
    });
  }, []);

  const handleUpdateParticipant = useCallback((index: number, data: Partial<Participant>) => {
    setParticipants(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...data };
      return next;
    });
  }, []);

  const isReady = useMemo(() => {
    return participants.every(p => p.name && p.role && p.tier);
  }, [participants]);

  const distributeTeams = useCallback(() => {
    if (!isReady) return;

    // Simple Balancing Logic
    // 1. Group by role
    const roleGroups: Record<Role, Participant[]> = {
      TOP: [], JG: [], MID: [], ADC: [], SUP: []
    };
    participants.forEach(p => {
      if (p.role) roleGroups[p.role].push(p);
    });

    const blueTeam: Participant[] = [];
    const redTeam: Participant[] = [];

    // 2. Pair each role and swap to balance
    Object.entries(roleGroups).forEach(([role, members]) => {
      if (members.length < 2) return; // Should be 2 per role theoretically
      
      const [p1, p2] = members;
      const v1 = TIER_VALUES[p1.tier!];
      const v2 = TIER_VALUES[p2.tier!];

      // Greedily assign to balance current team sums
      const blueSum = blueTeam.reduce((acc, p) => acc + TIER_VALUES[p.tier!], 0);
      const redSum = redTeam.reduce((acc, p) => acc + TIER_VALUES[p.tier!], 0);

      if (blueSum <= redSum) {
        if (v1 >= v2) {
          blueTeam.push(p1);
          redTeam.push(p2);
        } else {
          blueTeam.push(p2);
          redTeam.push(p1);
        }
      } else {
        if (v1 >= v2) {
          redTeam.push(p1);
          blueTeam.push(p2);
        } else {
          redTeam.push(p2);
          blueTeam.push(p1);
        }
      }
    });

    setResult({ blueTeam, redTeam });
    setPhase('result');
  }, [participants, isReady]);

  const resetSession = () => {
    setPhase('participating');
    setResult(null);
  };

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-6">
      <div className="flex flex-col gap-2 mb-12">
        <h2 className="text-[28px] font-black text-[#EEEEF0] tracking-tight">{t('playground.team_distribution.title')}</h2>
        <p className="text-[14px] font-bold text-[#5A5A65] tracking-tight">{t('playground.team_distribution.subtitle')}</p>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'participating' ? (
          <motion.div
            key="participating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-12"
          >
            <NicknameParsingPanel onParse={handleParseNicknames} />

            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#5A5A65]" />
                    <h3 className="text-[16px] font-black text-[#EEEEF0] uppercase tracking-wider">{t('playground.team_distribution.participants.title')}</h3>
                 </div>
                 <button 
                  onClick={distributeTeams}
                  disabled={!isReady}
                  className={cn(
                    "flex items-center gap-2 h-12 px-8 rounded-2xl text-[14px] font-black transition-all active:scale-95",
                    isReady ? "bg-neon-mint text-black" : "bg-white/5 text-[#5A5A65] cursor-not-allowed"
                  )}
                 >
                   <span>{t('playground.team_distribution.start_button')}</span>
                   <ArrowRight className="h-4 w-4" />
                 </button>
              </div>

              <ParticipantGrid 
                participants={participants} 
                onUpdate={handleUpdateParticipant} 
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            {result && (
              <DistributionResultView 
                blueTeam={result.blueTeam} 
                redTeam={result.redTeam} 
                onReroll={distributeTeams}
                onNewSession={resetSession}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
