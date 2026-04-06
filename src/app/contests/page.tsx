'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ContestsListContent } from '@/components/contest/ContestsListContent';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ContestsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-[#0C0C0F] text-[#EEEEF0]">
      <Navbar />
      
      <main className="flex-1 pt-32">
        {/* Page Hero */}
        <div className="mx-auto flex flex-col gap-4 px-6 md:px-16 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-baseline gap-6"
          >
            <h1 className="font-barlow text-6xl font-black italic tracking-tighter text-[#EEEEF0] md:text-8xl">
              {t('contests.list_hero_title')}
            </h1>
            <p className="font-inter text-lg text-[#7A7A85] md:text-xl font-medium">
              {t('contests.list_hero_subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Content Section */}
        <ContestsListContent />
      </main>

      <Footer />
    </div>
  );
}
