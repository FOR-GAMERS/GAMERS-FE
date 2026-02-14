"use client";

import { useForm, useFieldArray, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContestSchema, CreateContestFormValues } from "@/schemas/contest-schema";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from 'next/link';
import { 
  ChevronLeft, 
  Image as ImageIcon, 
  Upload, 
  Loader2,
  Trash2
} from "lucide-react";
import Image from "next/image";
import DiscordServerSelector from "@/components/contest/DiscordServerSelector";
import ValorantPointTableForm, { ValorantPointTableFormHandle } from "@/components/contest/ValorantPointTableForm";
import { addDays, format } from "date-fns";
import { useContestMutations } from "@/hooks/use-contests";
import { useToast } from "@/context/ToastContext";
import { GameType, ContestType } from "@/types/api";
import { storageService } from "@/services/storage-service";
import AnimatedSelect from "@/components/ui/AnimatedSelect";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import { useTranslation } from "react-i18next";

export default function CreateContestPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const valorantTableRef = useRef<ValorantPointTableFormHandle>(null);

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
          // games is required by schema but not used in mutation/UI currently. 
          // Providing valid default to pass validation.
          games: [{ id: Date.now(), startTime: new Date().toISOString() }]
      }
  });

  const { fields,append, remove } = useFieldArray({
      control,
      name: "games"
  });


  const games = watch("games");
  const gameType = watch("game_type");
  const gamePointTableId = watch("game_point_table_id");

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

  const { createContest, uploadThumbnail } = useContestMutations();
  const { addToast } = useToast();

  const onSubmit = async (data: CreateContestFormValues) => {
    try {
        setIsUploading(true);

        // 1. Process Point Table for Valorant sequentially
        let pointTableId = data.game_point_table_id;
        if (data.game_type === "VALORANT" && !pointTableId) {
             // If not created yet, try to submit the embedded form
             if (valorantTableRef.current) {
                try {
                    const createdId = await valorantTableRef.current.submit();
                    if (createdId) {
                        pointTableId = createdId;
                    } else {
                        // Submission failed or returned null
                        setIsUploading(false);
                        return;
                    }
                } catch (err) {
                    setIsUploading(false);
                    return; // Error handled in the child component already (toast)
                }
             } else {
                 addToast("Point table configuration is missing.", "error");
                 setIsUploading(false);
                 return;
             }
        }

        // 2. Create Contest first (without thumbnail URL initially)
        const contestResponse = await createContest.mutateAsync({
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
            thumbnail: "", // Will be uploaded separately
            game_point_table_id: pointTableId
        });
        
        const contestId = contestResponse.data.contest_id;

        // 3. Upload Thumbnail if exists
        if (thumbnailFile && contestId) {
            try {
                await uploadThumbnail.mutateAsync({
                    contestId: contestId,
                    file: thumbnailFile
                });
            } catch (error) {
                console.error("Thumbnail upload failed", error);
                addToast("Contest created but failed to upload thumbnail", "error");
                // We still proceed to success page as contest is created
            }
        }
        
        // 4. Redirect
        router.push("/contests/create/success");
    } catch (error: any) {
        console.error(error);
        addToast(error.message || "Failed to create contest", "error");
    } finally {
        setIsUploading(false);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file); // Store file for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
        // We set a temporary string to satisfy "required" validation if needed, 
        // though actual upload happens on submit. 
        // If the schema requires a valid URL format, this might fail, so we might need to adjust schema or use a dummy URL.
        // Assuming schema just checks minLength(1).
        setValue("thumbnail", reader.result as string); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering file input
    setThumbnailPreview(null);
    setThumbnailFile(null);
    setValue("thumbnail", "");
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
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
            <h1 className="text-lg font-bold tracking-tight">{t('contestCreate.title')}</h1>
        </div>
      </header>

      <div ref={containerRef} className="container mx-auto px-4 py-8 max-w-5xl relative z-10 space-y-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            
            {/* 1. Title */}
            <section className="animate-section space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">{t('contestCreate.form.titleLabel')}</label>
                <input 
                    {...register("title")}
                    placeholder={t('contestCreate.form.titlePlaceholder')}
                    className="w-full bg-transparent text-3xl md:text-5xl font-black placeholder:text-white/10 border-b-2 border-white/10 focus:border-neon-cyan focus:outline-none py-4 transition-colors"
                    maxLength={64}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                <section className="animate-section lg:col-span-4 space-y-4">
                    <div className="aspect-[4/3] rounded-2xl border-2 border-dashed border-white/20 hover:border-neon-purple hover:bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group"
                         onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                        {thumbnailPreview ? (
                            <div className="relative w-full h-full group">
                                <Image src={thumbnailPreview} alt="Preview" fill className="object-cover" />
                                <button
                                    onClick={handleRemoveThumbnail}
                                    className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                                    type="button"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center p-6 space-y-2">
                                <ImageIcon className="w-12 h-12 mx-auto text-white/30 group-hover:text-neon-purple transition-colors" />
                                <p className="text-sm font-bold text-white/50">{t('contestCreate.form.thumbnail')}</p>
                            </div>
                        )}
                    </div>
                    <input type="hidden" {...register("thumbnail")} />
                    {errors.thumbnail && <p className="text-red-500 text-xs text-center">{errors.thumbnail.message}</p>}
                </section>

                <section className="lg:col-span-8 space-y-8">
                    <div className="animate-section grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                         <div className="space-y-0">
                            <Controller
                                control={control}
                                name="max_team_count"
                                render={({ field }) => (
                                    <AnimatedSelect
                                        label={t('contestCreate.form.maxTeams')}
                                        options={[
                                            { value: 4, label: "4 Teams" },
                                            { value: 8, label: "8 Teams" },
                                            { value: 16, label: "16 Teams" },
                                            { value: 32, label: "32 Teams" }
                                        ]}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">{t('contestCreate.form.teamSize')}</label>
                            <Controller
                                control={control}
                                name="total_team_member"
                                render={({ field }) => (
                                    <input 
                                        type="text" 
                                        value={field.value}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            field.onChange(val === '' ? 0 : Number(val));
                                        }}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white transition-all focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] font-mono"
                                        placeholder="0"
                                    />
                                )}
                            />
                            {errors.total_team_member && <p className="text-red-500 text-xs">{errors.total_team_member.message}</p>}
                         </div>
                         <div className="space-y-0">
                             <Controller
                                control={control}
                                name="contest_type"
                                render={({ field }) => (
                                    <AnimatedSelect
                                        label={t('contestCreate.form.contestType')}
                                        options={[
                                            { value: "TOURNAMENT", label: t('contestCreate.options.tournament') },
                                            { value: "LEAGUE", label: t('contestCreate.options.league') }
                                        ]}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                         </div>
                         <div className="space-y-0">
                            <Controller
                                control={control}
                                name="game_type"
                                render={({ field }) => (
                                    <AnimatedSelect
                                        label={t('contestCreate.form.gameType')}
                                        options={[
                                            { value: "VALORANT", label: "Valorant" },
                                            { value: "LOL", label: "League of Legends" },
                                            { value: "OVERWATCH_2", label: "Overwatch 2" },
                                            { value: "FC_ONLINE", label: "FC Online" }
                                        ]}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">{t('contestCreate.form.startDate')}</label>
                            <input type="datetime-local" {...register("started_at")} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-neon-cyan outline-none dark-calendar" />
                            {errors.started_at && <p className="text-red-500 text-xs">{errors.started_at.message}</p>}
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">{t('contestCreate.form.endDate')}</label>
                            <input type="datetime-local" {...register("ended_at")} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-neon-cyan outline-none dark-calendar" />
                            {errors.ended_at && <p className="text-red-500 text-xs">{errors.ended_at.message}</p>}
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">{t('contestCreate.form.totalPoints')}</label>
                            <Controller
                                control={control}
                                name="total_point"
                                render={({ field }) => (
                                    <input 
                                        type="text" 
                                        value={field.value}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            field.onChange(val === '' ? 0 : Number(val));
                                        }}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white transition-all focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] font-mono"
                                        placeholder="0"
                                    />
                                )}
                            />
                         </div>
                            <div className="flex items-center gap-3 pt-6">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        id="auto_start"
                                        {...register("auto_start")} 
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white/50 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan peer-checked:after:bg-white peer-checked:after:shadow-[0_0_5px_rgba(255,255,255,0.5)] transition-colors"></div>
                                </label>
                                <label htmlFor="auto_start" className="text-sm font-bold text-white cursor-pointer select-none hover:text-neon-cyan transition-colors">
                                    {t('contestCreate.form.autoStart')}
                                </label>
                             </div>
                    </div>

                    {/* Discord Selector */}
                    <DiscordServerSelector control={control} setValue={setValue} watch={watch} />

                    {/* Point Table Configuration (Only for Valorant) */}
                    {watch("game_type") === "VALORANT" && (
                         <section className="animate-section">
                            <ValorantPointTableForm 
                                ref={valorantTableRef}
                                onSuccess={(id) => setValue("game_point_table_id", id)} 
                                mode="embedded"
                            />
                         </section>
                    )}
                </section>
            </div>

            {/* Markdown Editor */}
            <section className="animate-section space-y-4">
                 <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <MarkdownEditor
                            value={field.value || ""}
                            onChange={field.onChange}
                            label={t('contestCreate.form.description')}
                            placeholder="# Enter contest details..."
                            className="h-full"
                        />
                    )}
                />
            </section>

             {/* Footer Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-deep-black/90 backdrop-blur-xl border-t border-white/5 z-[60]">
                <div className="container mx-auto max-w-5xl flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        {isValid ? <span className="text-neon-cyan font-bold">{t('contestCreate.status.ready')}</span> : <span>{t('contestCreate.status.fillRequired')}</span>}
                    </div>
                    <button 
                        type="submit" 
                        disabled={!isValid || isSubmitting || isUploading}
                        className={cn("px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2", isValid ? "bg-neon-cyan text-black hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]" : "bg-white/10 text-white/30 cursor-not-allowed")}
                    >
                        {(isSubmitting || isUploading) ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                {t('contestCreate.actions.creating')}
                            </>
                        ) : (
                            <>
                                {t('contestCreate.actions.submit')} <Upload size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>

        </form>
      </div>
    </main>
  );
}
