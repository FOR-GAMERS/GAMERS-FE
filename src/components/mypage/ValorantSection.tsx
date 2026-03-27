'use client';

import { useState } from 'react';
import { useValorantInfo, useValorantMutations } from '@/hooks/use-valorant';
import { useForm, Controller } from 'react-hook-form';
import { RegisterValorantRequest } from '@/types/valorant';
import { Loader2, RefreshCw, Link2, Unlink, AlertCircle, CheckCircle2, Globe } from 'lucide-react';
import { differenceInHours, formatDistanceToNow } from 'date-fns';
import { ko, enUS, ja } from 'date-fns/locale';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import AnimatedSelect from '@/components/ui/AnimatedSelect';

import { useTranslation } from "react-i18next";
import { getValorantTierName } from '@/utils/valorant-tiers';

export default function ValorantSection() {
  const { t, i18n } = useTranslation();
  
  const locales: Record<string, any> = {
    ko: ko,
    en: enUS,
    ja: ja
  };
  const currentLocale = locales[i18n.language] || ko;
  const { data: infoResponse, isLoading } = useValorantInfo();
  const { registerValorant, unlinkValorant, refreshValorant } = useValorantMutations();
  const { addToast } = useToast();
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<RegisterValorantRequest>();
  const [isUnlinking, setIsUnlinking] = useState(false);

  const valorantInfo = infoResponse?.data;

  const lastUpdated = valorantInfo?.updated_at ? new Date(valorantInfo.updated_at) : null;
  const hoursSinceUpdate = lastUpdated ? differenceInHours(new Date(), lastUpdated) : 24;
  const canRefresh = hoursSinceUpdate >= 24;

  const onRegister = async (data: RegisterValorantRequest) => {
    try {
      await registerValorant.mutateAsync(data);
      addToast(t("mypage.valorant.toast.linked"), 'success');
    } catch (error: any) {
      addToast(error.message || t("mypage.valorant.toast.linkFailed"), 'error');
    }
  };

  const onUnlink = async () => {
    if (!confirm(t("mypage.valorant.confirmUnlink"))) return;
    setIsUnlinking(true);
    try {
      await unlinkValorant.mutateAsync();
      addToast(t("mypage.valorant.toast.unlinked"), 'success');
    } catch (error: any) {
      addToast(error.message || t("mypage.valorant.toast.unlinkFailed"), 'error');
    } finally {
      setIsUnlinking(false);
    }
  };

  const onRefresh = async () => {
    if (!canRefresh) return;
    try {
      await refreshValorant.mutateAsync();
      addToast(t("mypage.valorant.toast.refreshed"), 'success');
    } catch (error: any) {
      addToast(error.message || t("mypage.valorant.toast.refreshFailed"), 'error');
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-neon-cyan" /></div>;
  }

  return (
    <div className="w-full glass-card p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="p-3 bg-red-500/10 rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image 
              src={valorantInfo ? "/images/valorant/V_Logomark_Red.png" : "/images/valorant/V_Logomark_Grey.png"} 
              alt="Valorant" 
              width={32} 
              height={32}
              className="relative z-10 w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(255,70,85,0.5)]" 
            />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">{t("mypage.valorant.title")}</h2>
      </div>

      {!valorantInfo ? (
        // Not Linked State
        <form onSubmit={handleSubmit(onRegister)} className="space-y-6 max-w-md">
          <div className="space-y-2">
             <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">{t("mypage.valorant.region")}</label>
             <Controller
                name="region"
                control={control}
                defaultValue="kr"
                render={({ field }) => (
                    <AnimatedSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                            { value: "kr", label: t('mypage.valorant.regions.kr') },
                            { value: "ap", label: t('mypage.valorant.regions.ap') },
                            { value: "na", label: t('mypage.valorant.regions.na') },
                            { value: "eu", label: t('mypage.valorant.regions.eu') },
                        ]}
                        startIcon={<Globe className="w-4 h-4 text-neon-cyan" />}
                        className="w-full"
                    />
                )}
             />
          </div>
          <div className="grid grid-cols-3 gap-4">
             <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">{t("mypage.valorant.riotName")}</label>
                <input 
                  {...register('riot_name', { required: true })} 
                  placeholder="Summoner Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white transition-all placeholder:text-white/20" 
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">{t("mypage.valorant.tag")}</label>
                <input 
                  {...register('riot_tag', { required: true })} 
                  placeholder="#0000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white transition-all placeholder:text-white/20" 
                />
             </div>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/40 rounded-2xl text-neon-cyan font-black uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(0,243,255,0.1)] hover:shadow-[0_0_30px_rgba(0,243,255,0.3)]"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Link2 size={20} />}
            {t("mypage.valorant.linkButton")}
          </button>
        </form>
      ) : (
        // Linked State
        <div className="space-y-8">
           <div className="flex flex-col md:flex-row gap-8 md:items-center justify-between glass-morphism p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl -z-10 group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="flex items-center gap-6">
                 <div className="relative w-24 h-24 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/30 text-red-500 font-black text-4xl shadow-[0_0_20px_rgba(255,70,85,0.2)]">
                    V
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-deep-black shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                 </div>
                 <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black text-white tracking-tight">{valorantInfo.riot_name} <span className="text-white/30 font-medium">#{valorantInfo.riot_tag}</span></h3>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-white/70 font-black uppercase tracking-widest border border-white/10">{valorantInfo.region}</span>
                    </div>
                    <div className="text-sm text-white/50 font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="text-neon-cyan text-glow">{valorantInfo.current_tier_patched || getValorantTierName(valorantInfo.current_tier)}</span> 
                        <span className="opacity-30">•</span> 
                        <span>{valorantInfo.ranking_in_tier} RR</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-3 md:flex md:flex-col gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">{t("mypage.valorant.elo")}</span>
                    <span className="font-mono font-black text-neon-cyan text-lg md:text-base">{valorantInfo.elo}</span>
                 </div>
                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">{t("mypage.valorant.currentRank")}</span>
                    <span className="text-white font-black text-xs uppercase">{valorantInfo.current_tier_patched || getValorantTierName(valorantInfo.current_tier)}</span>
                 </div>
                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">{t("mypage.valorant.peakRank")}</span>
                    <span className="text-white/70 font-black text-xs uppercase">{valorantInfo.peak_tier_patched}</span>
                 </div>
              </div>
           </div>

           <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
              <div className="text-[10px] text-white/40 font-black uppercase tracking-widest flex items-center gap-2" suppressHydrationWarning>
                 {lastUpdated && <>
                    <RefreshCw size={12} className="text-white/20" />
                    {t("mypage.valorant.lastUpdated")}: {formatDistanceToNow(lastUpdated, { addSuffix: true, locale: currentLocale })}
                 </>}
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                 <button 
                   onClick={onUnlink} 
                   disabled={isUnlinking}
                   className="flex-1 md:flex-none px-6 py-3 glass-card hover:bg-red-500/10 border-red-500/20 text-red-500 transition-all hover:scale-105 active:scale-95 group"
                 >
                    <div className="flex items-center justify-center gap-2">
                        {isUnlinking ? <Loader2 className="animate-spin w-4 h-4" /> : <Unlink size={18} className="group-hover:-rotate-12 transition-transform" />}
                        <span className="text-xs font-black uppercase tracking-widest">{t("mypage.valorant.unlinkButton")}</span>
                    </div>
                 </button>
                 
                 <button
                    onClick={onRefresh}
                    disabled={!canRefresh || refreshValorant.isPending}
                    className={cn(
                        "flex-1 md:flex-none px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border shadow-lg",
                        canRefresh 
                           ? "bg-neon-cyan text-black border-neon-cyan hover:bg-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                           : "bg-white/5 text-white/20 border-white/5 cursor-not-allowed"
                    )}
                 >
                    {refreshValorant.isPending ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                    ) : !canRefresh ? (
                        <>
                           <AlertCircle size={18} /> 
                           {t("mypage.valorant.cantRefresh")}
                        </>
                    ) : (
                        <>
                           <RefreshCw size={18} className="animate-pulse" />
                           {t("mypage.valorant.refreshButton")}
                        </>
                    )}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
