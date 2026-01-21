'use client';

import { useState } from 'react';
import { useValorantInfo, useValorantMutations } from '@/hooks/use-valorant';
import { useForm } from 'react-hook-form';
import { RegisterValorantRequest } from '@/types/valorant';
import { Loader2, RefreshCw, Link2, Unlink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { differenceInHours, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function ValorantSection() {
  const { data: infoResponse, isLoading } = useValorantInfo();
  const { registerValorant, unlinkValorant, refreshValorant } = useValorantMutations();
  const { addToast } = useToast();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValorantRequest>();
  const [isUnlinking, setIsUnlinking] = useState(false);

  const valorantInfo = infoResponse?.data;

  // Refresh Logic
  const lastUpdated = valorantInfo?.updated_at ? new Date(valorantInfo.updated_at) : null;
  const hoursSinceUpdate = lastUpdated ? differenceInHours(new Date(), lastUpdated) : 24;
  const canRefresh = hoursSinceUpdate >= 24;
  
  // Or rely on backend 'refresh_needed' if it strictly follows the logic, 
  // but user asked for specific "24h check" on frontend too for immediate feedback or if backend logic differs.
  // The user requirement: "24시간 이내에 갱신이 완료되어있으면, 갱신이 불가능하다고 뜨고"
  
  const onRegister = async (data: RegisterValorantRequest) => {
    try {
      await registerValorant.mutateAsync(data);
      addToast('Valorant 계정이 연동되었습니다.', 'success');
    } catch (error: any) {
      addToast(error.message || '연동 실패', 'error');
    }
  };

  const onUnlink = async () => {
    if (!confirm('정말로 연동을 해제하시겠습니까?')) return;
    setIsUnlinking(true);
    try {
      await unlinkValorant.mutateAsync();
      addToast('Valorant 계정 연동이 해제되었습니다.', 'success');
    } catch (error: any) {
      addToast(error.message || '해제 실패', 'error');
    } finally {
      setIsUnlinking(false);
    }
  };

  const onRefresh = async () => {
    if (!canRefresh) return;
    try {
      await refreshValorant.mutateAsync();
      addToast('Valorant 정보가 갱신되었습니다.', 'success');
    } catch (error: any) {
      addToast(error.message || '갱신 실패', 'error');
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-neon-cyan" /></div>;
  }

  return (
    <div className="w-full bg-deep-black/50 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Image src="/images/games/valorant-logo.png" alt="Valorant" width={32} height={32} className="object-contain" /> 
        {/* Placeholder image path, might need adjustment or use icon */}
        <h2 className="text-xl font-bold text-white">Valorant Integration</h2>
      </div>

      {!valorantInfo ? (
        // Not Linked State
        <form onSubmit={handleSubmit(onRegister)} className="space-y-4 max-w-md">
          <div className="space-y-2">
             <label className="text-sm font-medium text-muted-foreground">Region</label>
             <select {...register('region')} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white">
                <option value="kr">Korea (KR)</option>
                <option value="ap">Asia Pacific (AP)</option>
                <option value="na">North America (NA)</option>
                <option value="eu">Europe (EU)</option>
             </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
             <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Riot Name</label>
                <input 
                  {...register('riot_name', { required: true })} 
                  placeholder="Name"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white" 
                />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Tag</label>
                <input 
                  {...register('riot_tag', { required: true })} 
                  placeholder="#KR1"
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
            Valorant 계정 연동하기
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
                    <span className="text-muted-foreground">ELO Rating</span>
                    <span className="font-mono font-bold text-neon-cyan">{valorantInfo.elo}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Peak Rank</span>
                    <span className="text-white">{valorantInfo.peak_tier_patched}</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                 {lastUpdated && <>최근 갱신: {formatDistanceToNow(lastUpdated, { addSuffix: true, locale: ko })}</>}
              </div>
              <div className="flex gap-3">
                 <button 
                   onClick={onUnlink} 
                   disabled={isUnlinking}
                   className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                 >
                    {isUnlinking ? <Loader2 className="animate-spin w-4 h-4" /> : <Unlink size={16} />}
                    연동 해제
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
                           갱신 불가능 (24시간 이내)
                        </>
                    ) : (
                        <>
                           <RefreshCw size={16} />
                           정보 갱신
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
