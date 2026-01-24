"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useQuery } from "@tanstack/react-query";
import { contestService } from "@/services/contest-service";
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

import { useTranslation } from "react-i18next";

interface ContestApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data?: any) => void;
    contestId: number;
    scoreTableId?: number;
    isApplying: boolean;
}

export default function ContestApplicationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    contestId,
    scoreTableId,
    isApplying
}: ContestApplicationModalProps) {
    const { t } = useTranslation();
    const [shouldFetchPoints, setShouldFetchPoints] = useState(false);

    // Fetch Points Query
    const { data: pointResponse, isLoading, error, isSuccess } = useQuery({
        queryKey: ['contest-point', contestId, scoreTableId],
        queryFn: () => contestService.getContestPoint(contestId, scoreTableId!),
        enabled: shouldFetchPoints && !!scoreTableId,
        retry: false
    });

    const pointData = pointResponse?.data;

    const handleCalculatePoints = () => {
        setShouldFetchPoints(true);
    };

    const handleConfirm = () => {
        if (pointData) {
            onConfirm({
                point: pointData.final_point,
                current_tier: pointData.current_tier_patched,
                peak_tier: pointData.peak_tier_patched
            });
        } else {
            onConfirm();
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={() => {
                setShouldFetchPoints(false);
                onClose();
            }} 
            title={t('contestModal.title')}
        >
            <div className="space-y-6">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h3 className="text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-neon-cyan" />
                        {t('contestModal.qualification')}
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                        {t('contestModal.description')}
                    </p>
                </div>

                {/* Point Calculation Section */}
                <div className="space-y-4">
                    {!shouldFetchPoints ? (
                        <button 
                            onClick={handleCalculatePoints}
                            disabled={!scoreTableId}
                            className={cn(
                                "w-full py-3 border rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                                scoreTableId 
                                    ? "bg-white/10 hover:bg-white/20 border-white/10 text-white" 
                                    : "bg-white/5 border-white/5 text-white/30 cursor-not-allowed"
                            )}
                        >
                            {scoreTableId ? t('contestModal.calculate') : t('contestModal.notConfigured')}
                        </button>
                    ) : (
                        <div className={cn(
                            "p-6 rounded-xl border transition-all flex flex-col items-center justify-center gap-3",
                            isLoading ? "bg-white/5 border-white/10" : 
                            error ? "bg-red-500/10 border-red-500/30" :
                            "bg-neon-cyan/5 border-neon-cyan/30"
                        )}>
                            {isLoading && (
                                <>
                                    <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
                                    <p className="text-sm text-muted-foreground">{t('contestModal.calculating')}</p>
                                </>
                            )}
                            
                            {error && (
                                <>
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                    <p className="text-sm text-red-400 font-bold">{t('contestModal.failed')}</p>
                                    <p className="text-xs text-muted-foreground text-center">
                                        {(error as any).response?.data?.message || "Please make sure your Valorant account is linked."}
                                    </p>
                                    <button 
                                        onClick={() => window.open('/my', '_blank')}
                                        className="text-xs text-white underline mt-2"
                                    >
                                        {t('contestModal.checkProfile')}
                                    </button>
                                </>
                            )}

                            {isSuccess && pointData && (
                                <>
                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        <div className="text-center space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase font-bold">{t('contestModal.currentTier')}</p>
                                            <p className="text-lg font-bold text-white">{pointData.current_tier_patched}</p>
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase font-bold">{t('contestModal.peakTier')}</p>
                                            <p className="text-lg font-bold text-white">{pointData.peak_tier_patched}</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-px bg-white/10 my-1" />
                                    <div className="text-center space-y-1">
                                        <p className="text-xs text-neon-cyan uppercase font-bold">{t('contestModal.calculatedPoints')}</p>
                                        <p className="text-3xl font-black text-neon-cyan drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                                            {pointData.final_point} PT
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white rounded-xl font-bold transition-colors"
                    >
                        {t('contestModal.cancel')}
                    </button>
                    <button 
                        onClick={handleConfirm}
                        disabled={!isSuccess || isApplying} // Only allow apply if points calculated success? Or allow anyway? 
                        // User request: "calculate User's Valorant Point ... so that they can apply" -> Implies calculation is a prerequisite or helper. 
                        // I will make it required for now as it seems to be the intent "to calculate ... to apply".
                        className={cn(
                            "flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                            (!isSuccess || isApplying) 
                                ? "bg-white/10 text-white/30 cursor-not-allowed" 
                                : "bg-neon-cyan text-black hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                        )}
                    >
                        {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : t('contestModal.createTeam')}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
