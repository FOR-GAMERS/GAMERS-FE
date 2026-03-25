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
    <div className="w-full bg-deep-black/50 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Image 
          src={lolInfo ? "/images/games/lol-icon.png" : "/images/games/lol-icon-grey.png"} 
          alt="League of Legends" 
          width={40} 
          height={40}
          className="object-contain" 
        />
        <h2 className="text-xl font-bold text-white">{t("mypage.lol.title") || "League of Legends Integration"}</h2>
      </div>

      {!lolInfo ? (
        <form onSubmit={handleSubmit(onRegister)} className="space-y-4 max-w-md">
          <div className="space-y-2">
             <label className="text-sm font-medium text-muted-foreground">{t("mypage.lol.region") || "Region"}</label>
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
                        startIcon={<Globe className="w-4 h-4" />}
                        className="w-full"
                    />
                )}
             />
          </div>
          <div className="grid grid-cols-3 gap-4">
             <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t("mypage.lol.riotName") || "Game Name"}</label>
                <input 
                  {...register('riot_name', { required: true })} 
                  placeholder="Summoner Name"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white" 
                />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t("mypage.lol.tag") || "Tag"}</label>
                <input 
                  {...register('riot_tag', { required: true })} 
                  placeholder="#TAG"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white" 
                />
             </div>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan/50 rounded-xl text-neon-cyan font-bold transition-all"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Link2 size={18} />}
            {t("mypage.lol.linkButton") || "Link Account"}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
           <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50 text-blue-100 font-bold text-xl">
                    L
                 </div>
                 <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{lolInfo.riot_name} <span className="text-white/50">#{lolInfo.riot_tag}</span></h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/70 uppercase">{lolInfo.region}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                        {lolInfo.current_tier_patched} • {lolInfo.ranking_in_tier} LP
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("mypage.lol.elo") || "ELO"}</span>
                    <span className="font-mono font-bold text-neon-cyan">{lolInfo.elo}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("mypage.lol.currentRank") || "Current Rank"}</span>
                    <span className="text-white">{lolInfo.current_tier_patched}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("mypage.lol.peakRank") || "Peak Rank"}</span>
                    <span className="text-white">{lolInfo.peak_tier_patched}</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground" suppressHydrationWarning>
                 {lastUpdated && <>{t("mypage.lol.lastUpdated") || "Last Updated"}: {formatDistanceToNow(lastUpdated, { addSuffix: true, locale: currentLocale })}</>}
              </div>
              <div className="flex gap-3">
                 <button 
                   onClick={onUnlink} 
                   disabled={isUnlinking}
                   className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                 >
                    {isUnlinking ? <Loader2 className="animate-spin w-4 h-4" /> : <Unlink size={16} />}
                    {t("mypage.lol.unlinkButton") || "Unlink"}
                 </button>
                 
                 <button
                    onClick={onRefresh}
                    disabled={!canRefresh || refreshLOL.isPending}
                    className={cn(
                        "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 border",
                        canRefresh 
                           ? "bg-neon-cyan text-black border-neon-cyan hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                           : "bg-white/5 text-white/30 border-white/5 cursor-not-allowed"
                    )}
                 >
                    {refreshLOL.isPending ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                    ) : !canRefresh ? (
                        <>
                           <AlertCircle size={16} /> 
                           {t("mypage.lol.cantRefresh") || "Cooling down"}
                        </>
                    ) : (
                        <>
                           <RefreshCw size={16} />
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
