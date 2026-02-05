'use client';

import { useState } from 'react';
import { useValorantInfo, useValorantMutations } from '@/hooks/use-valorant';
import { useForm, Controller } from 'react-hook-form';
import { RegisterValorantRequest } from '@/types/valorant';
import { Loader2, RefreshCw, Link2, Unlink, AlertCircle, CheckCircle2, Globe } from 'lucide-react';
import { differenceInHours, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import AnimatedSelect from '@/components/ui/AnimatedSelect';

import { useTranslation } from "react-i18next";

export default function ValorantSection() {
  const { t } = useTranslation();
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
    <div className="w-full bg-deep-black/50 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Image 
          src={valorantInfo ? "/images/valorant/V_Logomark_Red.png" : "/images/valorant/V_Logomark_Grey.png"} 
          alt="Valorant" 
          width={0} 
          height={0} 
          sizes="100vw"
          className="w-auto h-16 object-contain" 
        />
        <h2 className="text-xl font-bold text-white">{t("mypage.valorant.title")}</h2>
      </div>

      {!valorantInfo ? (
        // Not Linked State
        <form onSubmit={handleSubmit(onRegister)} className="space-y-4 max-w-md">
          <div className="space-y-2">
             <label className="text-sm font-medium text-muted-foreground">{t("mypage.valorant.region")}</label>
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
                        startIcon={<Globe className="w-4 h-4" />}
                        className="w-full"
                    />
                )}
             />
          </div>
          <div className="grid grid-cols-3 gap-4">
             <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t("mypage.valorant.riotName")}</label>
                <input 
                  {...register('riot_name', { required: true })} 
                  placeholder="Name"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white" 
                />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t("mypage.valorant.tag")}</label>
                <input 
                  {...register('riot_tag', { required: true })} 
                  placeholder="#0000"
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
            {t("mypage.valorant.linkButton")}
          </button>
        </form>
      ) : (
        // Linked State
        <div className="space-y-6">
           <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50 text-red-100 font-bold text-xl">
                    V
                 </div>
                 <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{valorantInfo.riot_name} <span className="text-white/50">#{valorantInfo.riot_tag}</span></h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/70 uppercase">{valorantInfo.region}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                        {valorantInfo.current_tier_patched} • {valorantInfo.ranking_in_tier} RR
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("mypage.valorant.elo")}</span>
                    <span className="font-mono font-bold text-neon-cyan">{valorantInfo.elo}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("mypage.valorant.currentRank")}</span>
                    <span className="text-white">{valorantInfo.current_tier_patched}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("mypage.valorant.peakRank")}</span>
                    <span className="text-white">{valorantInfo.peak_tier_patched}</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                 {lastUpdated && <>{t("mypage.valorant.lastUpdated")}: {formatDistanceToNow(lastUpdated, { addSuffix: true, locale: ko })}</>}
              </div>
              <div className="flex gap-3">
                 <button 
                   onClick={onUnlink} 
                   disabled={isUnlinking}
                   className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                 >
                    {isUnlinking ? <Loader2 className="animate-spin w-4 h-4" /> : <Unlink size={16} />}
                    {t("mypage.valorant.unlinkButton")}
                 </button>
                 
                 <button
                    onClick={onRefresh}
                    disabled={!canRefresh || refreshValorant.isPending}
                    className={cn(
                        "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 border",
                        canRefresh 
                           ? "bg-neon-cyan text-black border-neon-cyan hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                           : "bg-white/5 text-white/30 border-white/5 cursor-not-allowed"
                    )}
                 >
                    {refreshValorant.isPending ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                    ) : !canRefresh ? (
                        <>
                           <AlertCircle size={16} /> 
                           {t("mypage.valorant.cantRefresh")}
                        </>
                    ) : (
                        <>
                           <RefreshCw size={16} />
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
