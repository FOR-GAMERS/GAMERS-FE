'use client';

import { motion } from 'framer-motion';
import { User, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export type Role = 'TOP' | 'JG' | 'MID' | 'ADC' | 'SUP';
export type Tier = 'IRON' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'EMERALD' | 'DIAMOND' | 'MASTER' | 'GRANDMASTER' | 'CHALLENGER';

export interface Participant {
  id: string;
  name: string;
  role: Role | null;
  tier: Tier | null;
}

interface ParticipantGridProps {
  participants: Participant[];
  onUpdate: (index: number, data: Partial<Participant>) => void;
  className?: string;
}

const ROLES: Role[] = ['TOP', 'JG', 'MID', 'ADC', 'SUP'];
const TIERS: Tier[] = [
  'IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 
  'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'
];

export function ParticipantGrid({ participants, onUpdate, className }: ParticipantGridProps) {
  const { t } = useTranslation();

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
      {Array.from({ length: 10 }).map((_, i) => {
        const p = participants[i] || { id: `${i}`, name: '', role: null, tier: null };
        const isFilled = !!p.name;
        const isReady = isFilled && !!p.role && !!p.tier;

        return (
          <motion.div
            key={p.id || i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "group relative flex flex-col gap-4 p-5 rounded-2xl border transition-all h-[140px]",
              isFilled 
                ? "bg-[#0C0C0D] border-white/10 hover:border-neon-mint/30 hover:bg-white/5" 
                : "bg-white/[0.02] border-dashed border-white/5 opacity-50"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-black transition-all",
                  isFilled ? "bg-neon-mint/20 text-neon-mint" : "bg-white/5 text-[#5A5A65]"
                )}>
                  {isFilled ? p.name[0]?.toUpperCase() : <User className="h-4 w-4" />}
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-[14px] font-black transition-all",
                    isFilled ? "text-[#EEEEF0]" : "text-[#5A5A65]"
                  )}>
                    {isFilled ? p.name : `${t('playground.team_distribution.participants.empty_slot')} ${i + 1}`}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {isFilled ? (
                      isReady ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-neon-mint/80 uppercase">
                          <CheckCircle2 className="h-3 w-3" />
                          READY
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-ruby/80 uppercase">
                          <AlertCircle className="h-3 w-3" />
                          INCOMPLETE
                        </span>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                disabled={!isFilled}
                value={p.role || ''}
                onChange={(e) => onUpdate(i, { role: e.target.value as Role })}
                className="flex-1 h-10 bg-white/5 border border-white/5 rounded-xl px-3 text-[12px] font-bold text-[#EEEEF0] focus:outline-none focus:border-neon-mint/20 hover:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>{t('playground.team_distribution.participants.select_role')}</option>
                {ROLES.map(r => (
                  <option key={r} value={r}>{t(`playground.team_distribution.roles.${r}`)}</option>
                ))}
              </select>

              <select
                disabled={!isFilled}
                value={p.tier || ''}
                onChange={(e) => onUpdate(i, { tier: e.target.value as Tier })}
                className="flex-1 h-10 bg-white/5 border border-white/5 rounded-xl px-3 text-[12px] font-bold text-[#EEEEF0] focus:outline-none focus:border-neon-mint/20 hover:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>{t('playground.team_distribution.participants.select_tier')}</option>
                {TIERS.map(tKey => (
                  <option key={tKey} value={tKey}>{t(`playground.team_distribution.tiers.${tKey}`)}</option>
                ))}
              </select>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
