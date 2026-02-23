'use client';
import { useTranslation } from 'react-i18next';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { contestService } from '@/services/contest-service';
import PlaygroundHeader from './PlaygroundHeader';
import PlaygroundMain from './PlaygroundMain';
import { Loader2, AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ContestDetailClient({ contestId }: { contestId: string }) {
  const { t } = useTranslation();
  const { data: contestResponse, isLoading, error } = useQuery({
    queryKey: ['contest', contestId],
    queryFn: () => contestService.getContest(Number(contestId)),
  });

  const contest = contestResponse?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-neon-cyan animate-spin" />
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h1 className="text-2xl font-bold">{t('contestPlayground.loadingFail', 'Failed to load contest info')}</h1>
        <p className="text-neutral-400">{t('contestPlayground.retry', 'Please check the URL or try again later.')}</p>
      </div>
    );
  }

  return (
    <>
      <PlaygroundHeader contest={contest} />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <PlaygroundMain contest={contest} />
      </div>
    </>
  );
}
