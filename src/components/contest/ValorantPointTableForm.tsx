"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { valorantScoreTableSchema, ValorantScoreTableFormValues } from "@/schemas/contest-schema";
import { useValorantMutations } from "@/hooks/use-valorant";
import { useToast } from "@/context/ToastContext";
import { useState, forwardRef, useImperativeHandle } from "react";
import { Check, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ValorantPointTableFormHandle {
    submit: () => Promise<number | null>;
}

interface ValorantPointTableFormProps {
    onSuccess: (id: number) => void;
    mode?: "standalone" | "embedded";
}

const ValorantPointTableForm = forwardRef<ValorantPointTableFormHandle, ValorantPointTableFormProps>(
    ({ onSuccess, mode = "standalone" }, ref) => {
    const { 
        control,
        handleSubmit, 
        formState: { errors } 
    } = useForm<ValorantScoreTableFormValues>({
        resolver: zodResolver(valorantScoreTableSchema) as any,
        defaultValues: {
            iron_1: 1, iron_2: 2, iron_3: 3,
            bronze_1: 4, bronze_2: 5, bronze_3: 6,
            silver_1: 7, silver_2: 8, silver_3: 9,
            gold_1: 10, gold_2: 11, gold_3: 12,
            platinum_1: 13, platinum_2: 14, platinum_3: 15,
            diamond_1: 16, diamond_2: 17, diamond_3: 18,
            ascendant_1: 19, ascendant_2: 20, ascendant_3: 21,
            immortal_1: 22, immortal_2: 23, immortal_3: 24,
            radiant: 25
        }
    });

    const { createScoreTable } = useValorantMutations();
    const { addToast } = useToast();
    const [isCreated, setIsCreated] = useState(false);

    const onSubmit = async (data: ValorantScoreTableFormValues) => {
        try {
            const response = await createScoreTable.mutateAsync(data);
            if (response.data) {
                setIsCreated(true);
                onSuccess(response.data.score_table_id);
                addToast("Point Table created successfully!", "success");
                return response.data.score_table_id;
            }
            return null;
        } catch (error: any) {
            console.error(error);
            addToast("Failed to create Point Table", "error");
            throw error;
        }
    };

    useImperativeHandle(ref, () => ({
        submit: async () => {
            return new Promise((resolve, reject) => {
                handleSubmit(
                    async (data) => {
                        try {
                            const id = await onSubmit(data);
                            resolve(id);
                        } catch (e) {
                            reject(e);
                        }
                    },
                    (errors) => {
                        reject(new Error("Validation failed"));
                        console.error(errors);
                        addToast("Please fill in all rank points", "error");
                    }
                )();
            });
        }
    }));

    if (isCreated && mode === "standalone") {
        return (
            <div className="bg-neon-cyan/10 border border-neon-cyan/50 rounded-xl p-6 flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-300">
                <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan">
                    <Check size={24} strokeWidth={3} />
                </div>
                <p className="text-neon-cyan font-bold text-lg">Point Table Configured</p>
                <button 
                    type="button" 
                    onClick={() => setIsCreated(false)} // Allow editing again? Or maybe logic to reset
                    className="text-white/50 text-xs underline hover:text-white transition-colors"
                >
                    Edit Points
                </button>
            </div>
        );
    }

    const rankGroups = [
        { name: "Iron", color: "text-gray-400", subRanks: ["iron_1", "iron_2", "iron_3"] },
        { name: "Bronze", color: "text-amber-700", subRanks: ["bronze_1", "bronze_2", "bronze_3"] },
        { name: "Silver", color: "text-gray-200", subRanks: ["silver_1", "silver_2", "silver_3"] },
        { name: "Gold", color: "text-yellow-400", subRanks: ["gold_1", "gold_2", "gold_3"] },
        { name: "Platinum", color: "text-cyan-200", subRanks: ["platinum_1", "platinum_2", "platinum_3"] },
        { name: "Diamond", color: "text-purple-400", subRanks: ["diamond_1", "diamond_2", "diamond_3"] },
        { name: "Ascendant", color: "text-emerald-400", subRanks: ["ascendant_1", "ascendant_2", "ascendant_3"] },
        { name: "Immortal", color: "text-red-500", subRanks: ["immortal_1", "immortal_2", "immortal_3"] },
        { name: "Radiant", color: "text-yellow-100 drop-shadow-[0_0_5px_rgba(255,255,200,0.8)]", subRanks: ["radiant"] },
    ] as const;

    return (
        <div className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="text-neon-cyan" size={20} />
                <h3 className="text-lg font-bold text-white">Valorant Point Configuration</h3>
            </div>
            
            <div className="space-y-6">
                {rankGroups.map((group) => (
                    <div key={group.name} className="space-y-2">
                        <label className={cn("text-xs font-bold uppercase", group.color)}>
                            {group.name}
                        </label>
                        <div className={cn("grid gap-3", group.subRanks.length === 1 ? "grid-cols-1" : "grid-cols-3")}>
                            {group.subRanks.map((rankKey) => (
                                <div key={rankKey} className="relative group/input">
                                    <Controller
                                        control={control}
                                        name={rankKey as keyof ValorantScoreTableFormValues}
                                        render={({ field: { onChange, value } }) => (
                                            <input 
                                                type="text"
                                                value={value}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                                    onChange(val === '' ? 0 : parseInt(val, 10));
                                                }}
                                                placeholder="0"
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-neon-cyan outline-none transition-all focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] text-center font-mono"
                                            />
                                        )}
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none uppercase opacity-50">
                                         {rankKey.split('_')[1] || ''}
                                    </span>
                                    {errors[rankKey as keyof ValorantScoreTableFormValues] && <span className="text-red-500 text-[10px] absolute -bottom-4 left-0">Required</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {mode === "standalone" && (
                <button 
                    type="button" 
                    onClick={handleSubmit((d) => onSubmit(d))}
                    disabled={createScoreTable.isPending}
                    className="w-full py-3 mt-4 bg-white/10 hover:bg-neon-cyan/20 border border-white/10 hover:border-neon-cyan text-white hover:text-neon-cyan font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    {createScoreTable.isPending ? "Saving..." : "Save Point Table"}
                </button>
            )}
        </div>
    );
});

ValorantPointTableForm.displayName = "ValorantPointTableForm";
export default ValorantPointTableForm;
