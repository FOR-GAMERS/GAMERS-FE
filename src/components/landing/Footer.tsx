'use client';

import Link from 'next/link';
import { Twitter, Github, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  const footerLinks = [
    {
      title: t('footer.product'),
      links: [
        { name: t('footer.find_contests'), href: '/contests' },
        { name: t('footer.create_contest'), href: '/contests/create' },
        { name: t('footer.community'), href: '/community' },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { name: t('footer.about'), href: '/about' },
        { name: t('footer.blog'), href: '/blog' },
        { name: t('footer.jobs'), href: '/jobs' },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { name: t('footer.terms'), href: '/terms' },
        { name: t('footer.privacy'), href: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/5 bg-deep-black pt-20 pb-10 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-neon-mint" />
              <span className="font-space text-xl font-bold tracking-tight text-foreground">
                GAMERS
              </span>
            </Link>
            <p className="text-sm whitespace-pre-line leading-relaxed text-muted-gray">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-gray transition-colors hover:text-neon-mint">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-gray transition-colors hover:text-neon-mint">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-gray transition-colors hover:text-neon-mint">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="hidden grid-cols-3 gap-8 lg:col-span-3 lg:grid">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-gray transition-colors hover:text-neon-mint"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 border-t border-white/5 pt-10 text-center md:text-left">
          <p className="text-xs text-muted-gray">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
