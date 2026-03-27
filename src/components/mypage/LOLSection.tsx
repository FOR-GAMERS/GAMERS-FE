'use client';

import { useState } from 'react';
import { useLOLInfo, useLOLMutations } from '@/hooks/use-lol';
import { useForm, Controller } from 'react-hook-form';
import { RegisterLOLRequest } from '@/types/lol';
import { Loader2, RefreshCw, Link2, Unlink, AlertCircle, Globe } from 'lucide-react';
import { differenceInHours, formatDistanceToNow } from 'date-fns';
import { ko, enUS, ja } from 'date-fns/locale';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import AnimatedSelect from '@/components/ui/AnimatedSelect';
import { useTranslation } from "react-i18next";

export default function LOLSection() {
  const { t, i18n } = useTranslation();
  
  const locales: Record<string, any> = {
    ko: ko,
    en: enUS,
    ja: ja
  };
  const currentLocale = locales[i18n.language] || ko;
  const { data: infoResponse, isLoading } = useLOLInfo();
  const { registerLOL, unlinkLOL, refreshLOL } = useLOLMutations();
  const { addToast } = useToast();
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<RegisterLOLRequest>();
  const [isUnlinking, setIsUnlinking] = useState(false);

  const lolInfo = infoResponse?.data;

  const lastUpdated = lolInfo?.updated_at ? new Date(lolInfo.updated_at) : null;
  const hoursSinceUpdate = lastUpdated ? differenceInHours(new Date(), lastUpdated) : 24;
  const canRefresh = hoursSinceUpdate >= 24;

  const onRegister = async (data: RegisterLOLRequest) => {
    try {
      await registerLOL.mutateAsync(data);
      addToast(t("mypage.lol.toast.linked") || "LOL account linked", 'success');
    } catch (error: any) {
      addToast(error.message || t("mypage.lol.toast.linkFailed") || "Link failed", 'error');
    }
  };

  const onUnlink = async () => {
    if (!confirm(t("mypage.lol.confirmUnlink") || "Do you want to unlink your LOL account?")) return;
    setIsUnlinking(true);
    try {
      await unlinkLOL.mutateAsync();
      addToast(t("mypage.lol.toast.unlinked") || "LOL account unlinked", 'success');
    } catch (error: any) {
      addToast(error.message || t("mypage.lol.toast.unlinkFailed") || "Unlink failed", 'error');
    } finally {
      setIsUnlinking(false);
    }
  };

  const onRefresh = async () => {
    if (!canRefresh) return;
    try {
      await refreshLOL.mutateAsync();
      addToast(t("mypage.lol.toast.refreshed") || "LOL account refreshed", 'success');
    } catch (error: any) {
      addToast(error.message || t("mypage.lol.toast.refreshFailed") || "Refresh failed", 'error');
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-neon-cyan" /></div>;
  }

  return (
    <div className="w-full glass-card p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="p-3 bg-blue-500/10 rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image 
              src={lolInfo ? "/images/games/lol-icon.png" : "/images/games/lol-icon-grey.png"} 
              alt="League of Legends" 
              width={32} 
              height={32}
              className="relative z-10 w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
            />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">{t("mypage.lol.title") || "League of Legends Integration"}</h2>
      </div>

      {!lolInfo ? (
        <form onSubmit={handleSubmit(onRegister)} className="space-y-6 max-w-md">
          <div className="space-y-2">
             <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">{t("mypage.lol.region") || "Region"}</label>
             <Controller
                name="region"
                control={control}
                defaultValue="kr"
                render={({ field }) => (
                    <AnimatedSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                            { value: "kr", label: "KR" },
                            { value: "jp", label: "JP" },
                            { value: "na", label: "NA" },
                            { value: "euw", label: "EUW" },
                        ]}
                        startIcon={<Globe className="w-4 h-4 text-neon-cyan" />}
                        className="w-full"
                    />
                )}
             />
          </div>
          <div className="grid grid-cols-3 gap-4">
             <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">{t("mypage.lol.riotName") || "Game Name"}</label>
                <input 
                  {...register('riot_name', { required: true })} 
                  placeholder="Summoner Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white transition-all placeholder:text-white/20" 
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">{t("mypage.lol.tag") || "Tag"}</label>
                <input 
                  {...register('riot_tag', { required: true })} 
                  placeholder="#TAG"
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
            {t("mypage.lol.linkButton") || "Link Account"}
          </button>
        </form>
      ) : (
        <div className="space-y-8">
           <div className="flex flex-col md:flex-row gap-8 md:items-center justify-between glass-morphism p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
               {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -z-10 group-hover:scale-150 transition-transform duration-1000" />

              <div className="flex items-center gap-6">
                 <div className="relative w-24 h-24 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30 text-blue-500 font-black text-4xl shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    L
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-deep-black shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                 </div>
                 <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black text-white tracking-tight">{lolInfo.riot_name} <span className="text-white/30 font-medium">#{lolInfo.riot_tag}</span></h3>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-white/70 font-black uppercase tracking-widest border border-white/10">{lolInfo.region}</span>
                    </div>
                    <div className="text-sm text-white/50 font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="text-neon-cyan text-glow">{lolInfo.current_tier_patched}</span> 
                        <span className="opacity-30">•</span> 
                        <span>{lolInfo.ranking_in_tier} LP</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-3 md:flex md:flex-col gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">{t("mypage.lol.elo") || "ELO"}</span>
                    <span className="font-mono font-black text-neon-cyan text-lg md:text-base">{lolInfo.elo}</span>
                 </div>
                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">{t("mypage.lol.currentRank") || "Current Rank"}</span>
                    <span className="text-white font-black text-xs uppercase">{lolInfo.current_tier_patched}</span>
                 </div>
                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">{t("mypage.lol.peakRank") || "Peak Rank"}</span>
                    <span className="text-white/70 font-black text-xs uppercase">{lolInfo.peak_tier_patched}</span>
                 </div>
              </div>
           </div>

           <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
              <div className="text-[10px] text-white/40 font-black uppercase tracking-widest flex items-center gap-2" suppressHydrationWarning>
                 {lastUpdated && <>
                    <RefreshCw size={12} className="text-white/20" />
                    {t("mypage.lol.lastUpdated") || "Last Updated"}: {formatDistanceToNow(lastUpdated, { addSuffix: true, locale: currentLocale })}
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
                        <span className="text-xs font-black uppercase tracking-widest">{t("mypage.lol.unlinkButton") || "Unlink"}</span>
                    </div>
                 </button>
                 
                 <button
                    onClick={onRefresh}
                    disabled={!canRefresh || refreshLOL.isPending}
                    className={cn(
                        "flex-1 md:flex-none px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border shadow-lg",
                        canRefresh 
                           ? "bg-neon-cyan text-black border-neon-cyan hover:bg-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                           : "bg-white/5 text-white/20 border-white/5 cursor-not-allowed"
                    )}
                 >
                    {refreshLOL.isPending ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                    ) : !canRefresh ? (
                        <>
                           <AlertCircle size={18} /> 
                           {t("mypage.lol.cantRefresh") || "Cooling down"}
                        </>
                    ) : (
                        <>
                           <RefreshCw size={18} className="animate-pulse" />
                           {t("mypage.lol.refreshButton") || "Refresh"}
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
