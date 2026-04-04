'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-20">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[120px] bg-neon-mint/30" />
      <div className="absolute top-20 right-0 -z-10 h-[400px] w-[400px] opacity-10 blur-[100px] bg-neon-purple/20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 px-4 backdrop-blur-sm"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-neon-mint animate-pulse" />
        <span className="text-xs font-medium text-muted-gray tracking-wide uppercase">
          {t('hero.tag')}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center"
      >
        <h1 className="font-barlow text-6xl font-[900] leading-[1.1] tracking-tighter sm:text-8xl md:text-9xl uppercase italic">
          <span className="text-foreground block">{t('hero.title_1')}</span>
          <span className="text-neon-mint text-glow-mint block">{t('hero.title_2')}</span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 max-w-[620px] text-center text-lg leading-relaxed text-muted-gray md:text-xl whitespace-pre-line"
      >
        {t('hero.subtitle')}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12 flex flex-col gap-4 sm:flex-row"
      >
        <Button variant="neon" size="xl" className="group">
          <Trophy className="mr-2 h-5 w-5" />
          {t('hero.cta_join')}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        <Button variant="outline" size="xl" className="border-white/10 text-foreground hover:bg-white/5">
          {t('hero.cta_create')}
        </Button>
      </motion.div>
      
      {/* Decorative Grid */}
      <div className="absolute bottom-0 left-0 right-0 -z-20 h-full w-full opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
    </section>
  );
}
