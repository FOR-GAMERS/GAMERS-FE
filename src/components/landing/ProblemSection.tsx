'use client';

import { motion } from 'framer-motion';
import { AlertCircle, History, ZapOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const problems = [
  {
    icon: AlertCircle,
    key: 'card_1',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
  {
    icon: History,
    key: 'card_2',
    color: 'text-neon-purple',
    bg: 'bg-neon-purple/10',
  },
  {
    icon: ZapOff,
    key: 'card_3',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
  },
];

export function ProblemSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-deep-black py-24 px-6 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center md:mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-neon-mint"
          >
            {t('problem.tag')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-barlow text-4xl font-black italic tracking-tight sm:text-5xl md:text-6xl"
          >
            {t('problem.title')}
          </motion.h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="glass-card group flex flex-col items-start p-8 transition-all hover:-translate-y-1 hover:border-white/10"
            >
              <div className={`mb-6 rounded-xl ${problem.bg} p-3 transition-transform group-hover:scale-110`}>
                <problem.icon className={`h-6 w-6 ${problem.color}`} />
              </div>
              <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground">
                {t(`problem.${problem.key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-gray">
                {t(`problem.${problem.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
