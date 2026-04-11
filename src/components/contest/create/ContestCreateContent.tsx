'use client';

import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contestCreateSchema, ContestCreateFormValues } from './schema';
import { ContestCreateSidebar } from './ContestCreateSidebar';
import { ContestCreateFooter } from './ContestCreateFooter';
import { ContestPreviewCard } from './ContestPreviewCard';
import { BasicInfoSection } from './sections/BasicInfoSection';
import { ImageSettingsSection } from './sections/ImageSettingsSection';
import { GameSettingsSection } from './sections/GameSettingsSection';
import { TeamCompositionSection } from './sections/TeamCompositionSection';
import { ScheduleSettingsSection } from './sections/ScheduleSettingsSection';
import { DiscordIntegrationSection } from './sections/DiscordIntegrationSection';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCreateContest, useUploadThumbnail } from '@/hooks/use-contests';
import { useRouter } from 'next/navigation';
import { ContestType } from '@/types/contest';

export function ContestCreateContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('basic_info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createContestMutation = useCreateContest();
  const uploadThumbnailMutation = useUploadThumbnail();
  
  const methods = useForm<ContestCreateFormValues>({
    resolver: zodResolver(contestCreateSchema),
    defaultValues: {
      title: '',
      description: '',
      contest_type: ContestType.TOURNAMENT,
      game_type: 'VALORANT',
      max_team_count: 16,
      total_team_member: 5,
      total_point: 100,
      started_at: '',
      ended_at: '',
      auto_start: false,
    },
  });

  const { watch, handleSubmit } = methods;
  const values = watch();

  const calculateProgress = () => {
    let completed = 0;
    if (values.title && values.description) completed += 1;
    if (methods.getValues('thumbnail_file') || values.thumbnail) completed += 1;
    if (values.game_type) completed += 1;
    if (values.max_team_count && values.total_team_member) completed += 1;
    if (values.started_at && values.ended_at) completed += 1;
    return Math.min(Math.round((completed / 5) * 100), 100);
  };

  const progress = calculateProgress();

  const handleSectionClick = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const onSubmit: SubmitHandler<ContestCreateFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      // 1. Create Contest
      const createResponse = await createContestMutation.mutateAsync({
        title: data.title,
        description: data.description,
        contest_type: data.contest_type,
        max_team_count: data.max_team_count,
        total_point: data.total_point,
        started_at: data.started_at,
        ended_at: data.ended_at,
        auto_start: data.auto_start,
        game_type: data.game_type,
        total_team_member: data.total_team_member,
        discord_guild_id: data.discord_guild_id,
        discord_text_channel_id: data.discord_text_channel_id,
      });

      const contestId = createResponse.data.contest_id;

      // 2. Upload Thumbnail if present
      const thumbnailFile = methods.getValues('thumbnail_file');
      if (thumbnailFile instanceof File) {
        await uploadThumbnailMutation.mutateAsync({
          id: contestId,
          file: thumbnailFile,
        });
      }

      // Success
      router.push(`/contests/${contestId}`);
    } catch (error: any) {
      console.error('Failed to create contest:', error);
      if (error?.status === 403 && error?.data?.oauth_url) {
        if (confirm(t('common.discord_link_required', 'Discord 연동이 필요합니다. 연동 페이지로 이동하시겠습니까?'))) {
          // Save draft in localStorage? (Optional but good)
          localStorage.setItem('contest_draft', JSON.stringify(data));
          window.location.href = error.data.oauth_url;
        }
      } else {
        alert(t('common.error_occurred', '오류가 발생했습니다.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="relative min-h-screen bg-[#060608]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-32 flex flex-col lg:flex-row gap-12">
          
          <aside className="w-full lg:w-[280px] flex-shrink-0 hidden lg:block">
            <ContestCreateSidebar 
              activeSection={activeSection} 
              onSectionClick={handleSectionClick} 
              progress={progress} 
            />
          </aside>

          <main className="flex-grow flex flex-col gap-0 pb-32">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className="mb-12 px-4"
             >
                <h1 className="text-4xl font-black text-[#EEEEF0] tracking-tight mb-4">
                  {t('contests.create.title')}
                </h1>
                <p className="text-[#7A7A85] font-medium">
                  {t('contests.create.subtitle')}
                </p>
             </motion.div>

             <div className="flex flex-col gap-12">
                <BasicInfoSection />
                <ImageSettingsSection />
                <GameSettingsSection />
                <TeamCompositionSection />
                <ScheduleSettingsSection />
                <DiscordIntegrationSection />
             </div>
          </main>

          <aside className="w-full lg:w-[380px] flex-shrink-0 hidden xl:block">
            <ContestPreviewCard />
          </aside>

        </div>

        <ContestCreateFooter 
          onCancel={() => window.history.back()}
          onSaveDraft={() => {}}
          onPublish={() => handleSubmit(onSubmit)()}
          isSubmitting={isSubmitting}
        />
      </form>
    </FormProvider>
  );
}

