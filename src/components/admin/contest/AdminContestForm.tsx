"use client";

import { useForm, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContestSchema, CreateContestFormValues } from "@/schemas/contest-schema"; // Reuse schema
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Loader2,
  Save,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { ContestType, GameType, ContestResponse } from "@/types/api";
import { adminContestService } from "@/services/admin-contest-service";
import AnimatedSelect from "@/components/ui/AnimatedSelect"; 
import MarkdownEditor from "@/components/ui/MarkdownEditor"; 
// import DiscordServerSelector from "@/components/contest/DiscordServerSelector"; // Decide if Admin needs this
import Link from "next/link";
import { format, addDays } from "date-fns";

interface AdminContestFormProps {
    initialData?: ContestResponse;
    isEditing?: boolean;
}

export function AdminContestForm({ initialData, isEditing = false }: AdminContestFormProps) {
    const router = useRouter();
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultValues: Partial<CreateContestFormValues> = {
        title: "",
        description: "",
        max_team_count: 16,
        total_team_member: 5,
        total_point: 0,
        contest_type: "TOURNAMENT",
        game_type: "VALORANT",
        started_at: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
        ended_at: format(addDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm"),
        auto_start: false,
        discord_guild_id: "", // Optional
        discord_text_channel_id: "", // Optional
        games: []
    };

    const { 
        register, 
        control, 
        handleSubmit, 
        reset,
        formState: { errors } 
    } = useForm<CreateContestFormValues>({
        resolver: zodResolver(createContestSchema) as Resolver<CreateContestFormValues>,
        defaultValues
    });

    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title,
                description: initialData.description || "",
                max_team_count: initialData.max_team_count,
                total_team_member: initialData.total_team_member,
                total_point: initialData.total_point,
                contest_type: initialData.contest_type,
                game_type: initialData.game_type,
                started_at: initialData.started_at ? format(new Date(initialData.started_at), "yyyy-MM-dd'T'HH:mm") : "",
                ended_at: initialData.ended_at ? format(new Date(initialData.ended_at), "yyyy-MM-dd'T'HH:mm") : "",
                auto_start: initialData.auto_start || false,
                discord_guild_id: initialData.discord_guild_id || "",
                discord_text_channel_id: initialData.discord_text_channel_id || "",
                thumbnail: initialData.thumbnail,
                game_point_table_id: initialData.game_point_table_id,
                 // Existing games logic omitted for simplicity unless needed
                games: [] 
            });
        }
    }, [initialData, reset]);

    const onSubmit = async (data: CreateContestFormValues) => {
        setIsSubmitting(true);
        try {
            // Adjust dates to ISO
             const payload = {
                ...data,
                started_at: new Date(data.started_at).toISOString(),
                ended_at: new Date(data.ended_at).toISOString(),
                // Ensure enums are typed correctly
                contest_type: data.contest_type as ContestType,
                game_type: data.game_type as GameType,
            };

            if (isEditing && initialData) {
                await adminContestService.updateContest(initialData.contest_id, payload);
                addToast("Contest updated successfully", "success");
            } else {
                await adminContestService.createContest(payload);
                addToast("Contest created successfully", "success");
            }
            router.push("/admin/contests-manage");
        } catch (error: any) {
            console.error(error);
            addToast(error.message || "Failed to save contest", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-neutral-900/50 p-8 rounded-xl border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-400">Title</label>
                    <input 
                        {...register("title")}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none"
                    />
                     {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-400">Type</label>
                     <div className="flex gap-4">
                        <Controller
                            control={control}
                            name="contest_type"
                            render={({ field }) => (
                                 <select 
                                    {...field}
                                    className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none w-full"
                                 >
                                    <option value="TOURNAMENT">Tournament</option>
                                    <option value="LEAGUE">League</option>
                                    <option value="CASUAL">Casual</option>
                                 </select>
                            )}
                        />
                         <Controller
                            control={control}
                            name="game_type"
                            render={({ field }) => (
                                 <select 
                                    {...field}
                                    className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none w-full"
                                 >
                                    <option value="VALORANT">Valorant</option>
                                    <option value="LOL">League of Legends</option>
                                 </select>
                            )}
                        />
                    </div>
                </div>

                 <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-400">Start Date</label>
                    <input 
                        type="datetime-local" 
                        {...register("started_at")}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none dark:[color-scheme:dark]"
                    />
                     {errors.started_at && <p className="text-red-500 text-xs">{errors.started_at.message}</p>}
                </div>

                 <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-400">End Date</label>
                    <input 
                        type="datetime-local" 
                        {...register("ended_at")}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none dark:[color-scheme:dark]"
                    />
                     {errors.ended_at && <p className="text-red-500 text-xs">{errors.ended_at.message}</p>}
                </div>

                 <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-400">Max Teams</label>
                    <input 
                        type="number"
                        {...register("max_team_count", { valueAsNumber: true })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none"
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-400">Team Size</label>
                    <input 
                        type="number"
                        {...register("total_team_member", { valueAsNumber: true })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none"
                    />
                </div>
            </div>

            <div className="space-y-2">
                 <label className="text-sm font-bold text-neutral-400">Description</label>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <textarea
                            {...field}
                             className="w-full h-32 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none resize-none"
                             placeholder="Contest description..."
                        />
                         // Or re-enable MarkdownEditor if styling allows
                    )}
                />
            </div>
            
             <div className="flex items-center gap-2">
                 <input type="checkbox" {...register("auto_start")} id="auto_start" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                 <label htmlFor="auto_start" className="text-white text-sm">Auto Start Contest</label>
             </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
                <Link href="/admin/contests-manage" className="px-6 py-2 rounded-lg text-neutral-400 hover:text-white transition-colors">
                    Cancel
                </Link>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                    {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {isEditing ? "Update Contest" : "Create Contest"}
                </button>
            </div>
        </form>
    );
}
