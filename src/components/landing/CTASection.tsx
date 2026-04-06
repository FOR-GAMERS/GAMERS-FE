'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden py-24 px-6 md:py-40">
      <div className="absolute inset-x-0 top-1/2 -z-10 h-[400px] -translate-y-1/2 opacity-10 blur-[100px] bg-neon-mint/30" />
      
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="mb-8 inline-flex items-center gap-2 rounded-full border border-neon-mint/20 bg-neon-mint/5 py-1 px-4 text-xs font-bold uppercase tracking-widest text-neon-mint"
        >
          <Sparkles className="h-3 w-3" />
          {t('landing.cta.tag')}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-barlow text-5xl font-black italic tracking-tighter sm:text-6xl md:text-8xl lg:text-9xl uppercase"
        >
          {t('landing.cta.title')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 text-lg font-medium text-muted-gray md:text-xl"
        >
          {t('landing.cta.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <Button variant="neon" size="xl" className="h-16 px-12 text-lg shadow-[0_0_40px_rgba(110,231,183,0.3)]">
            {t('landing.cta.button')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
