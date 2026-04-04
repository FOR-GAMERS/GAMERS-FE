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

export function ContestCreateContent() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('basic_info');
  
  const methods = useForm<ContestCreateFormValues>({
    resolver: zodResolver(contestCreateSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      game: 'VALORANT',
      maxTeams: 16,
      teamSize: 5,
      totalPoints: 0,
      startDate: '',
      endDate: '',
      autoStart: false,
      valorant: {
        format: 'TOURNAMENT',
        roundsPerMatch: 3,
        mapPool: [],
        agentRestrictions: [],
      },
      lol: {
        format: 'TOURNAMENT',
        patchVersion: '14.6',
        championRestrictions: [],
      }
    },
  });

  const { watch, handleSubmit } = methods;
  const values = watch();

  // Calculate progress based on filled fields
  const calculateProgress = () => {
    let completed = 0;
    if (values.name && values.description) completed += 1;
    if (values.thumbnail || values.banner) completed += 1;
    if (values.game) completed += 1;
    if (values.maxTeams && values.teamSize) completed += 1;
    if (values.startDate && values.endDate) completed += 1;
    // discord is optional
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

  const onSubmit: SubmitHandler<ContestCreateFormValues> = (data) => {
    console.log('Form Submitted:', data);
    alert('대회가 성공적으로 생성되었습니다!');
  };

  const handleSaveDraft = () => {
    console.log('Saving Draft:', methods.getValues());
    alert('임시저장되었습니다.');
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="relative min-h-screen bg-[#060608]">
        {/* Main Layout Container */}
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-32 flex flex-col lg:flex-row gap-12">
          
          {/* Left Sidebar: Navigation */}
          <aside className="w-full lg:w-[280px] flex-shrink-0 hidden lg:block">
            <ContestCreateSidebar 
              activeSection={activeSection} 
              onSectionClick={handleSectionClick} 
              progress={progress} 
            />
          </aside>

          {/* Center: Form Sections */}
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

          {/* Right: Live Preview */}
          <aside className="w-full lg:w-[380px] flex-shrink-0 hidden xl:block">
            <ContestPreviewCard />
          </aside>

        </div>

        {/* Global Footer Actions */}
        <ContestCreateFooter 
          onCancel={() => window.history.back()}
          onSaveDraft={handleSaveDraft}
          onPublish={() => handleSubmit(onSubmit)()}
        />
      </form>
    </FormProvider>
  );
}
