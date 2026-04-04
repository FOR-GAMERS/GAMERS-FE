import type { Metadata } from 'next';
import { Inter, Barlow_Condensed, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ClientProviders } from '@/components/providers/client-providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-barlow',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GAMERS | 모든 경쟁이 기억이 되는 곳',
  description: '캐주얼부터 정식 리그까지. 당신만의 무대에서 경쟁하세요. 모든 경쟁이 기록되고 기억되는 국내 최대 게이밍 플랫폼 GAMERS.',
  keywords: ['Gaming', 'Esports', 'Tournament', 'Pro Gaming', 'Valorant', 'LoL', 'Community'],
  openGraph: {
    title: 'GAMERS | 모든 경쟁이 기억이 되는 곳',
    description: '모든 경쟁이 기록되고 기억되는 국내 최대 게이밍 플랫폼 GAMERS.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          barlow.variable,
          spaceGrotesk.variable,
          'min-h-screen bg-background text-foreground font-sans antialiased overflow-x-hidden'
        )}
      >
        <ClientProviders>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
