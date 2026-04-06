'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContestCreateFormValues } from '../schema';
import { cn } from '@/lib/utils';
import { MessageSquare, ExternalLink, ShieldCheck, HelpCircle } from 'lucide-react';

export function DiscordIntegrationSection() {
  const { t } = useTranslation();
  const { register, watch, formState: { errors } } = useFormContext<ContestCreateFormValues>();

  const serverId = watch('discordServerId');
  const channelId = watch('discordChannelId');

  return (
    <section id="discord_integration" className="scroll-mt-32 flex flex-col gap-8 w-full max-w-4xl mx-auto py-12 border-b border-white/5">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-[#EEEEF0] tracking-tight flex items-center gap-3">
          <span className="w-2 h-8 bg-neon-mint rounded-full" />
          {t('contests.create.sections.discord_integration')}
        </h2>
        <p className="text-sm font-medium text-[#7A7A85]">
          {t('contests.create.discord.integration_desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0C0C0F] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
        {/* Background Accent */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#5865F2]/5 blur-[100px] rounded-full group-hover:bg-[#5865F2]/10 transition-all duration-500" />
        
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex items-center gap-3 text-[#5865F2]">
             <MessageSquare className="h-6 w-6" />
             <span className="text-sm font-black uppercase tracking-widest">{t('contests.create.discord.bot_settings')}</span>
          </div>

          <div className="flex flex-col gap-5">
            {/* Server ID */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-[#BBBBCB]">
                  {t('contests.create.discord.server_id')}
                </label>
                <div className="group/help relative">
                  <HelpCircle className="h-3.5 w-3.5 text-[#4A4A55] cursor-help" />
                  <div className="absolute bottom-full right-0 mb-2 w-48 p-3 rounded-xl bg-[#1C1C21] border border-white/10 text-[10px] font-medium text-[#BBBBCB] opacity-0 invisible group-hover/help:opacity-100 group-hover/help:visible transition-all shadow-xl">
                    {t('contests.create.discord.server_id_help')}
                  </div>
                </div>
              </div>
              <input
                type="text"
                {...register('discordServerId')}
                className={cn(
                  "w-full bg-[#141418] border border-white/5 rounded-xl px-4 py-3.5 text-xs font-medium focus:outline-none focus:border-[#5865F2] transition-all shadow-inner",
                  errors.discordServerId && "border-red-500/50"
                )}
                placeholder="123456789012345678"
              />
            </div>

            {/* Channel ID */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[13px] font-bold text-[#BBBBCB]">
                {t('contests.create.discord.channel_id')}
              </label>
              <input
                type="text"
                {...register('discordChannelId')}
                className={cn(
                  "w-full bg-[#141418] border border-white/5 rounded-xl px-4 py-3.5 text-xs font-medium focus:outline-none focus:border-[#5865F2] transition-all shadow-inner",
                  errors.discordChannelId && "border-red-500/50"
                )}
                placeholder="123456789012345678"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 bg-[#141418] border border-white/5 rounded-2xl p-6 relative z-10 transition-all hover:border-[#5865F2]/30">
          <div className="flex flex-col gap-2">
            <h4 className="text-[13px] font-bold text-[#EEEEF0] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-neon-mint" />
              {t('contests.create.discord.bot_permissions')}
            </h4>
            <ul className="flex flex-col gap-2">
              <li className="text-[11px] font-medium text-[#7A7A85] flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#5865F2]" />
                {t('contests.create.discord.auto_channel')}
              </li>
              <li className="text-[11px] font-medium text-[#7A7A85] flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#5865F2]" />
                {t('contests.create.discord.realtime_notif')}
              </li>
              <li className="text-[11px] font-medium text-[#7A7A85] flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#5865F2]" />
                {t('contests.create.discord.staff_support')}
              </li>
            </ul>
          </div>

          <button
            type="button"
            className="w-full mt-auto bg-[#5865F2] hover:bg-[#4752C4] text-white py-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(88,101,242,0.2)] active:scale-95"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t('contests.create.discord.invite_bot')}
          </button>
        </div>
      </div>
    </section>
  );
}
