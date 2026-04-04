'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, Users, GitMerge, LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const features = [
  {
    icon: LayoutGrid,
    key: 'card_1',
  },
  {
    icon: Users,
    key: 'card_2',
  },
  {
    icon: GitMerge,
    key: 'card_3',
  },
  {
    icon: LayoutDashboard,
    key: 'card_4',
  },
];

export function FeaturesGrid() {
  const { t } = useTranslation();

  return (
    <section className="bg-deep-black py-24 px-6 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-neon-mint"
          >
            {t('features.tag')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-barlow text-4xl font-black italic tracking-tight sm:text-5xl md:text-6xl"
          >
            {t('features.title')}
          </motion.h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="glass-card group p-8 transition-all hover:bg-white/[0.03] hover:border-white/10"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 text-neon-mint transition-transform group-hover:scale-110">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-bold tracking-tight text-foreground">
                {t(`features.${feature.key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-gray">
                {t(`features.${feature.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
