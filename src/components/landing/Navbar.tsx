'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Search, User } from 'lucide-react';

const navLinks = [
  { key: 'find_contests', href: '/contests' },
  { key: 'my_contests', href: '/my-contests' },
  { key: 'community', href: '/community' },
];

export function Navbar() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-neon-mint text-deep-black font-barlow font-black text-sm">
              G
            </div>
            <span className="font-space text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-neon-mint">
              GAMERS
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-neon-mint',
                  pathname === link.href ? 'text-neon-mint' : 'text-muted-gray'
                )}
              >
                {t(`navbar.${link.key}`)}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 text-muted-gray hover:text-foreground transition-colors cursor-pointer">
            <Search className="h-4 w-4" />
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 overflow-hidden rounded-full bg-white/5 p-0.5 border border-white/10">
            <button
              onClick={() => i18n.changeLanguage('ko')}
              className={cn(
                'px-2 py-0.5 text-[10px] font-bold transition-all rounded-full',
                i18n.language === 'ko' ? 'bg-white/10 text-foreground' : 'text-muted-gray hover:text-foreground'
              )}
            >
              KR
            </button>
            <div className="h-2 w-[1px] bg-white/10" />
            <button
              onClick={() => i18n.changeLanguage('ja')}
              className={cn(
                'px-2 py-0.5 text-[10px] font-bold transition-all rounded-full',
                i18n.language === 'ja' ? 'bg-white/10 text-foreground' : 'text-muted-gray hover:text-foreground'
              )}
            >
              JP
            </button>
          </div>

          <div className="flex items-center gap-1 text-muted-gray hover:text-foreground transition-colors cursor-pointer">
            <User className="h-5 w-5" />
          </div>

          <Link
            href="/login"
            className="text-sm font-medium text-muted-gray transition-colors hover:text-foreground"
          >
            {t('navbar.login')}
          </Link>
          <Button
            size="sm"
            className="bg-neon-mint font-bold text-deep-black hover:bg-neon-mint/90"
          >
            {t('navbar.get_started')}
          </Button>
        </div>
      </div>
    </nav>
  );
}
