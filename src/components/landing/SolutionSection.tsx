'use client';

import { motion } from 'framer-motion';
import { Target, BarChart3, Medal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const solutions = [
  {
    icon: Target,
    key: 'item_1',
    color: 'text-neon-mint',
  },
  {
    icon: BarChart3,
    key: 'item_2',
    color: 'text-neon-mint',
  },
  {
    icon: Medal,
    key: 'item_3',
    color: 'text-neon-mint',
  },
];

export function SolutionSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-deep-black py-24 px-6 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-20 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-neon-mint"
          >
            {t('solution.tag')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-barlow text-4xl font-black italic tracking-tight sm:text-5xl md:text-6xl"
          >
            {t('solution.title')}
          </motion.h2>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          {solutions.map((sol, i) => (
            <motion.div
              key={sol.key}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col items-center gap-8 md:flex-row ${
                i % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="relative flex aspect-video w-full flex-1 items-center justify-center rounded-2xl bg-white/5 border border-white/5 md:w-1/2">
                <sol.icon className="h-16 w-16 text-neon-mint opacity-20" />
                <div className="absolute inset-0 glow-bg-mint opacity-10" />
                <div className="font-barlow absolute -top-4 -left-4 text-8xl font-black opacity-[0.03] italic">
                  0{i + 1}
                </div>
              </div>
              <div className="flex-1 space-y-4 text-center md:w-1/2 md:text-left">
                <h3 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {t(`solution.${sol.key}.title`)}
                </h3>
                <p className="max-w-[420px] text-lg leading-relaxed text-muted-gray mx-auto md:mx-0">
                  {t(`solution.${sol.key}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
