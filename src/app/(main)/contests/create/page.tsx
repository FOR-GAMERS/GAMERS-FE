"use client";

import { useForm, useFieldArray, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContestSchema, CreateContestFormValues } from "@/schemas/contest-schema";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from 'next/link';
import { 
  ChevronLeft, 
  Image as ImageIcon, 
  Upload, 
} from "lucide-react";
import DiscordServerSelector from "@/components/contest/DiscordServerSelector";
import { addDays, format } from "date-fns";
import { useContestMutations } from "@/hooks/use-contests";
import { useToast } from "@/context/ToastContext";
import { GameType, ContestType } from "@/types/api";

export default function CreateContestPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');

  // React Hook Form Setup
  const { 
      register, 
      control, 
      handleSubmit, 
      watch, 
      setValue, 
      formState: { errors, isValid, isSubmitting } 
  } = useForm<CreateContestFormValues>({
      resolver: zodResolver(createContestSchema) as Resolver<CreateContestFormValues>,
      mode: "onChange",
      defaultValues: {
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
          discord_guild_id: "",
          discord_text_channel_id: "",
          games: [{ id: Date.now(), startTime: "" }]
      }
  });

  const { fields,append, remove } = useFieldArray({
      control,
      name: "games"
  });

  const watchedDescription = watch("description");
  const games = watch("games");

  // GSAP Animation
  useGSAP(() => {
    gsap.from(".animate-section", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all"
    });
  }, { scope: containerRef });

  const { createContest } = useContestMutations();
  const { addToast } = useToast();

  const onSubmit = async (data: CreateContestFormValues) => {
    try {
        await createContest.mutateAsync({
            title: data.title,
            description: data.description,
            max_team_count: data.max_team_count,
            total_team_member: data.total_team_member,
            total_point: data.total_point,
            contest_type: data.contest_type as ContestType,
            game_type: data.game_type as GameType,
            started_at: new Date(data.started_at).toISOString(),
            ended_at: new Date(data.ended_at).toISOString(),
            discord_guild_id: data.discord_guild_id,
            discord_text_channel_id: data.discord_text_channel_id,
            auto_start: data.auto_start,
            thumbnail: data.thumbnail
        });
        addToast("Contest created successfully!", "success");
        // Navigation is handled in the mutation onSuccess
    } catch (error: any) {
        console.error(error);
        addToast(error.message || "Failed to create contest", "error");
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
        setValue("thumbnail", reader.result as string); // Set string in form
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen bg-deep-black text-white relative overflow-hidden pb-32">
       {/* Background */}
       <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/10 pointer-events-none" />

       {/* Header */}
       <header className="sticky top-0 z-40 w-full h-16 bg-deep-black/80 backdrop-blur-md border-b border-white/5 flex items-center">
        <div className="container mx-auto px-4 max-w-5xl flex items-center gap-4">
            <Link href="/contests" className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-white">
                <ChevronLeft size={24} />
            </Link>
            <h1 className="text-lg font-bold tracking-tight">Create Contest</h1>
        </div>
      </header>

      <div ref={containerRef} className="container mx-auto px-4 py-8 max-w-5xl relative z-10 space-y-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            
            {/* 1. Title */}
            <section className="animate-section space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Contest Title</label>
                <input 
                    {...register("title")}
                    placeholder="Enter contest title (e.g. 2026 Cyber League)"
                    className="w-full bg-transparent text-3xl md:text-5xl font-black placeholder:text-white/10 border-b-2 border-white/10 focus:border-neon-cyan focus:outline-none py-4 transition-colors"
                    maxLength={64}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                {/* Left: Thumbnail (4 cols) */}
                <section className="animate-section lg:col-span-4 space-y-4">
                    <div className="aspect-[4/3] rounded-2xl border-2 border-dashed border-white/20 hover:border-neon-purple hover:bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group"
                         onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                        {thumbnailPreview ? (
                            <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center p-6 space-y-2">
                                <ImageIcon className="w-12 h-12 mx-auto text-white/30 group-hover:text-neon-purple transition-colors" />
                                <p className="text-sm font-bold text-white/50">Upload Thumbnail</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Right: Settings (8 cols) */}
                <section className="lg:col-span-8 space-y-8">
                    {/* General Settings */}
                    <div className="animate-section grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Max Teams</label>
                            <select {...register("max_team_count", { valueAsNumber: true })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none">
                                <option value="4">4 Teams</option>
                                <option value="8">8 Teams</option>
                                <option value="16">16 Teams</option>
                                <option value="32">32 Teams</option>
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Team Size</label>
                            <input 
                                type="number" 
                                {...register("total_team_member")} 
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white"
                                min={1}
                                max={6} 
                            />
                            {errors.total_team_member && <p className="text-red-500 text-xs">{errors.total_team_member.message}</p>}
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Contest Type</label>
                            <select {...register("contest_type")} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white">
                                <option value="TOURNAMENT">Tournament</option>
                                <option value="LEAGUE">League</option>
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Game Type</label>
                            <select {...register("game_type")} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white">
                                <option value="VALORANT">Valorant</option>
                                <option value="LOL">League of Legends</option>
                                <option value="OVERWATCH_2">Overwatch 2</option>
                                <option value="FC_ONLINE">FC Online</option>
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Start Date</label>
                            <input type="datetime-local" {...register("started_at")} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-neon-cyan outline-none dark-calendar" />
                            {errors.started_at && <p className="text-red-500 text-xs">{errors.started_at.message}</p>}
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">End Date</label>
                            <input type="datetime-local" {...register("ended_at")} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-neon-cyan outline-none dark-calendar" />
                            {errors.ended_at && <p className="text-red-500 text-xs">{errors.ended_at.message}</p>}
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Total Points</label>
                            <input 
                                type="number" 
                                {...register("total_point", { valueAsNumber: true })} 
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white"
                                min={0}
                                placeholder="0"
                            />
                         </div>
                         <div className="flex items-center gap-3 pt-6">
                            <input 
                                type="checkbox" 
                                id="auto_start"
                                {...register("auto_start")} 
                                className="w-5 h-5 rounded border-gray-600 text-neon-cyan focus:ring-neon-cyan bg-black/40"
                            />
                            <label htmlFor="auto_start" className="text-sm font-medium text-white cursor-pointer select-none">
                                Auto Start when full?
                            </label>
                         </div>
                    </div>

                    {/* Discord Selector */}
                    <DiscordServerSelector control={control} setValue={setValue} watch={watch} />
                </section>
            </div>

            {/* Markdown Editor */}
            <section className="animate-section space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground ml-1">Description (Markdown)</label>
                    <div className="flex lg:hidden bg-white/5 rounded-lg p-1 gap-1">
                        <button type="button" onClick={() => setEditorTab('write')} className={cn("px-3 py-1 text-xs rounded-md transition-all", editorTab === 'write' ? "bg-white/10 text-white font-bold" : "text-muted-foreground")}>Edit</button>
                        <button type="button" onClick={() => setEditorTab('preview')} className={cn("px-3 py-1 text-xs rounded-md transition-all", editorTab === 'preview' ? "bg-white/10 text-white font-bold" : "text-muted-foreground")}>Preview</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[400px]">
                    <div className={cn("h-full", editorTab === 'preview' && "hidden lg:block")}>
                        <textarea 
                            {...register("description")} 
                            placeholder="# Enter contest details..." 
                            className="w-full h-full bg-[#0f172a] border border-white/10 rounded-xl p-4 font-mono text-sm leading-relaxed resize-none focus:border-neon-cyan outline-none" 
                        />
                    </div>
                    <div className={cn("h-full bg-black/40 border border-white/5 rounded-xl p-6 overflow-y-auto", editorTab === 'write' && "hidden lg:block")}>
                        <div className="prose prose-invert prose-sm max-w-none">
                            {watchedDescription ? <ReactMarkdown>{watchedDescription}</ReactMarkdown> : <p className="text-muted-foreground/30 text-center mt-10">Preview Area</p>}
                        </div>
                    </div>
                </div>
            </section>

             {/* Footer Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-deep-black/90 backdrop-blur-xl border-t border-white/5 z-[60]">
                <div className="container mx-auto max-w-5xl flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        {isValid ? <span className="text-neon-cyan font-bold">Ready to Launch 🚀</span> : <span>Please fill in all required fields</span>}
                    </div>
                    <button 
                        type="submit" 
                        disabled={!isValid || isSubmitting}
                        className={cn("px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2", isValid ? "bg-neon-cyan text-black hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]" : "bg-white/10 text-white/30 cursor-not-allowed")}
                    >
                        {isSubmitting ? "Creating..." : "Create Contest"} <Upload size={18} />
                    </button>
                </div>
            </div>

        </form>
      </div>
    </main>
  );
}
