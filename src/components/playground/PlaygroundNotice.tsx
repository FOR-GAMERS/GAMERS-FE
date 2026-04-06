'use client';

import { motion } from 'framer-motion';
import { Megaphone, GraduationCap, Calendar, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// --- Interfaces ---

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  host: string;
}

interface ScheduleItemData {
  id: number;
  title: string;
  time: string;
  desc?: string;
  status: 'completed' | 'active' | 'pending';
  badge?: string;
}

interface FAQ {
  q: string;
  a: string;
}

// --- Sub-components ---

function SectionHeader({ title, icon: Icon, extra }: { title: string; icon: React.ComponentType<{ className?: string }>; extra?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-neon-mint rounded-full" />
        <Icon className="w-4 h-4 text-neon-mint" />
        <h2 className="text-[15px] font-black tracking-tight text-[#EEEEF0]">{title}</h2>
      </div>
      {extra}
    </div>
  );
}

function NoticeCard({ notice }: { notice: Notice }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2 p-5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.1] transition-all group">
      <h3 className="text-[14px] font-bold text-[#EEEEF0] group-hover:text-neon-mint transition-colors tracking-tight">
        {notice.title}
      </h3>
      <p className="text-[13px] leading-relaxed text-[#5A5A65] line-clamp-2">
        {notice.content}
      </p>
      <div className="flex items-center gap-2 mt-1 text-[11px] font-medium text-[#3A3A45]">
        <span>{notice.date}</span>
        <span className="w-0.5 h-0.5 rounded-full bg-[#3A3A45]" />
        <span>{t('playground.notice.host_label')}{notice.host}</span>
      </div>
    </div>
  );
}

function RuleItem({ rule, index }: { rule: string; index: number }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors group">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-mint flex items-center justify-center text-deep-black text-[11px] font-black group-hover:scale-110 transition-transform">
        {index + 1}
      </div>
      <p className="text-[13px] leading-relaxed text-[#5A5A65] group-hover:text-[#8A8A95] transition-colors">
        {rule}
      </p>
    </div>
  );
}

function ScheduleItem({ item, isLast }: { item: ScheduleItemData; isLast: boolean }) {
  return (
    <div className="flex gap-4 relative pb-8 group last:pb-0">
      {!isLast && (
        <div className="absolute left-[7px] top-[14px] bottom-0 w-px bg-white/[0.05]" />
      )}
      <div className={cn(
        "relative z-10 flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 mt-1 transition-all",
        item.status === 'completed' && "bg-neon-mint border-neon-mint",
        item.status === 'active' && "bg-[#FFB800] border-[#FFB800] shadow-[0_0_10px_rgba(255,184,0,0.4)]",
        item.status === 'pending' && "bg-transparent border-[#3A3A45]"
      )} />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-[14px] font-black tracking-tight",
            item.status === 'pending' ? "text-[#5A5A65]" : "text-[#EEEEF0]"
          )}>
            {item.title}
          </span>
          {item.badge && (
            <span className="px-1.5 py-0.5 rounded-sm bg-[#FFB800] text-deep-black text-[9px] font-black">
              {item.badge}
            </span>
          )}
        </div>
        <p className="text-[12px] font-medium text-[#5A5A65]">
          {item.time} {item.desc && `· ${item.desc}`}
        </p>
      </div>
    </div>
  );
}

// --- Main Component ---

export function PlaygroundNotice() {
  const { t } = useTranslation();

  const notices = t('playground.notice.mock.notices', { returnObjects: true }) as Notice[];
  const rules = t('playground.notice.mock.rules', { returnObjects: true }) as string[];
  const schedule = t('playground.notice.mock.schedule', { returnObjects: true }) as ScheduleItemData[];
  const faqs = t('playground.notice.mock.faqs', { returnObjects: true }) as FAQ[];

  return (
    <main className="flex-1 bg-[#09090B] p-8 overflow-y-auto">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10">
        
        {/* Top Section: Notices, Rules, Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Notices (4 Columns) */}
          <motion.section 
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader 
              title={t('playground.notice.title')} 
              icon={Megaphone} 
              extra={
                <div className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.1] text-[#FFB800] text-[11px] font-bold">
                  {t('playground.notice.notice_count', { count: Array.isArray(notices) ? notices.length : 0 })}
                </div>
              }
            />
            <div className="flex flex-col gap-4">
              {Array.isArray(notices) && notices.map((n) => (
                <NoticeCard key={n.id} notice={n} />
              ))}
            </div>
          </motion.section>

          {/* Middle: Rules (4 Columns) */}
          <motion.section 
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SectionHeader title={t('playground.notice.rules_title')} icon={GraduationCap} />
            <div className="flex flex-col rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
              {Array.isArray(rules) && rules.map((rule, idx) => (
                <RuleItem key={idx} rule={rule} index={idx} />
              ))}
            </div>
          </motion.section>

          {/* Right: Schedule (4 Columns) */}
          <motion.section 
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SectionHeader title={t('playground.notice.schedule_title')} icon={Calendar} />
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              {Array.isArray(schedule) && schedule.map((item, idx) => (
                <ScheduleItem key={item.id} item={item} isLast={idx === schedule.length - 1} />
              ))}
            </div>
          </motion.section>

        </div>

        {/* Bottom Section: FAQ */}
        <motion.section
          className="p-10 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SectionHeader title={t('playground.notice.faq_title')} icon={HelpCircle} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {Array.isArray(faqs) && faqs.map((faq, idx) => (
              <div key={idx} className="flex flex-col gap-4 group">
                <div className="flex items-start gap-2">
                  <span className="text-neon-mint font-black text-[14px]">Q.</span>
                  <h4 className="text-[14px] font-bold text-[#EEEEF0] group-hover:text-neon-mint transition-colors tracking-tight">
                    {faq.q}
                  </h4>
                </div>
                <div className="flex items-start gap-2">
                  <span className="opacity-0 font-black text-[14px]">Q.</span>
                  <p className="text-[13px] leading-relaxed text-[#5A5A65]">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </main>
  );
}
